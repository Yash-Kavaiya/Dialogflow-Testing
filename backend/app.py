"""
Flask Backend for Dialogflow CSV Testing Tool
Provides REST API for CSV upload and test execution
"""
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json
import time
from datetime import datetime
from csv_test_runner import DialogflowTestRunner, get_project_id_from_gcloud

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
UPLOAD_FOLDER = 'uploads'
RESULTS_FOLDER = 'results'
ALLOWED_EXTENSIONS = {'csv'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['RESULTS_FOLDER'] = RESULTS_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)


def allowed_file(filename):
    """Check if file has allowed extension"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    })


@app.route('/api/upload-csv', methods=['POST'])
def upload_csv():
    """
    Upload CSV file endpoint

    Request:
        - file: CSV file
        - project_id: GCP project ID (optional)
        - agent_id: Dialogflow agent ID
        - location: Dialogflow location
        - environment_id: Environment ID (optional)

    Returns:
        JSON with file info and parsed test cases
    """
    # Check if file is in request
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Only CSV files allowed"}), 400

    # Get configuration from form data
    agent_id = request.form.get('agent_id')
    location = request.form.get('location', 'global')
    project_id = request.form.get('project_id')
    environment_id = request.form.get('environment_id')

    if not agent_id:
        return jsonify({"error": "agent_id is required"}), 400

    # Get project ID from credentials if not provided
    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    # Save file
    filename = secure_filename(file.filename)
    timestamp = int(time.time())
    unique_filename = f"{timestamp}_{filename}"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(filepath)

    try:
        # Parse CSV to show preview
        runner = DialogflowTestRunner(project_id, location, agent_id, environment_id)
        test_cases = runner.parse_csv(filepath)

        return jsonify({
            "message": "File uploaded successfully",
            "filename": unique_filename,
            "test_count": len(test_cases),
            "test_cases": test_cases[:5],  # Preview first 5 test cases
            "config": {
                "project_id": project_id,
                "agent_id": agent_id,
                "location": location,
                "environment_id": environment_id or "-"
            }
        }), 200

    except Exception as e:
        # Clean up file on error
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({"error": f"Failed to parse CSV: {str(e)}"}), 400


@app.route('/api/run-tests', methods=['POST'])
def run_tests():
    """
    Run tests from uploaded CSV file

    Request body:
        {
            "filename": "uploaded_csv_filename",
            "project_id": "gcp-project-id",
            "agent_id": "agent-id",
            "location": "global",
            "environment_id": "environment-id" (optional)
        }

    Returns:
        JSON with test results and summary
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    filename = data.get('filename')
    agent_id = data.get('agent_id')
    location = data.get('location', 'global')
    project_id = data.get('project_id')
    environment_id = data.get('environment_id')

    if not filename or not agent_id:
        return jsonify({"error": "filename and agent_id are required"}), 400

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404

    # Get project ID from credentials if not provided
    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        # Run tests
        runner = DialogflowTestRunner(project_id, location, agent_id, environment_id)
        results = runner.run_csv_tests(filepath)

        # Save results to file
        result_filename = f"results_{int(time.time())}.json"
        result_filepath = os.path.join(app.config['RESULTS_FOLDER'], result_filename)

        with open(result_filepath, 'w') as f:
            json.dump(results, f, indent=2)

        results['result_id'] = result_filename

        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": f"Test execution failed: {str(e)}"}), 500


@app.route('/api/results/<result_id>', methods=['GET'])
def get_results(result_id):
    """
    Get test results by ID

    Args:
        result_id: Result filename

    Returns:
        JSON with test results
    """
    result_filepath = os.path.join(app.config['RESULTS_FOLDER'], result_id)

    if not os.path.exists(result_filepath):
        return jsonify({"error": "Results not found"}), 404

    try:
        with open(result_filepath, 'r') as f:
            results = json.load(f)
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": f"Failed to load results: {str(e)}"}), 500


@app.route('/api/results', methods=['GET'])
def list_results():
    """
    List all available test results

    Returns:
        JSON array of result files with metadata
    """
    try:
        results = []
        for filename in os.listdir(app.config['RESULTS_FOLDER']):
            if filename.endswith('.json'):
                filepath = os.path.join(app.config['RESULTS_FOLDER'], filename)
                stat = os.stat(filepath)

                # Load summary info
                with open(filepath, 'r') as f:
                    data = json.load(f)

                results.append({
                    "result_id": filename,
                    "created_at": datetime.fromtimestamp(stat.st_ctime).isoformat(),
                    "summary": data.get('summary', {}),
                    "config": data.get('config', {})
                })

        # Sort by creation time (newest first)
        results.sort(key=lambda x: x['created_at'], reverse=True)

        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": f"Failed to list results: {str(e)}"}), 500


@app.route('/api/download-sample-csv', methods=['GET'])
def download_sample_csv():
    """
    Download sample CSV template

    Returns:
        CSV file
    """
    sample_csv = """test_id,conversation,expected_intent,language_code
test_1,Hi|I want to book a flight|Tomorrow,booking.flight,en
test_2,Hello|I need help,help.general,en
test_3,What's the weather like?|Show me forecast for New York,weather.check,en
test_4,Cancel my order|Order number 12345,order.cancel,en
test_5,Hi|Goodbye,greeting.bye,en"""

    # Save sample CSV temporarily
    sample_filepath = os.path.join(app.config['UPLOAD_FOLDER'], 'sample_template.csv')
    with open(sample_filepath, 'w') as f:
        f.write(sample_csv)

    return send_from_directory(app.config['UPLOAD_FOLDER'], 'sample_template.csv', as_attachment=True)


@app.errorhandler(413)
def file_too_large(e):
    """Handle file too large error"""
    return jsonify({"error": "File too large. Maximum size is 5MB"}), 413


@app.errorhandler(500)
def internal_error(e):
    """Handle internal server error"""
    return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    print("Starting Dialogflow CSV Testing Backend...")
    print(f"Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")
    print(f"Results folder: {os.path.abspath(RESULTS_FOLDER)}")
    app.run(debug=True, host='0.0.0.0', port=5000)
