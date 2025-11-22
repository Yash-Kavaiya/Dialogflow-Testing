"""
Flask Backend for Dialogflow CX SaaS Testing Platform
Provides comprehensive REST API for Dialogflow CX testing operations
"""
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json
import time
import uuid
from datetime import datetime
from csv_test_runner import DialogflowTestRunner, get_project_id_from_gcloud
from dialogflow_cx_api import DialogflowCXService

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


def get_service(project_id: str, location: str) -> DialogflowCXService:
    """Create DialogflowCXService instance"""
    return DialogflowCXService(project_id, location)


# ==================== HEALTH CHECK ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0"
    })


# ==================== AGENTS ====================

@app.route('/api/agents', methods=['GET'])
def list_agents():
    """List all agents in the project/location"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        agents = service.list_agents()
        return jsonify({"agents": agents, "count": len(agents)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>', methods=['GET'])
def get_agent(agent_id):
    """Get a specific agent"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        agent = service.get_agent(agent_id)
        return jsonify(agent), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/validate', methods=['POST'])
def validate_agent(agent_id):
    """Validate an agent"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        result = service.validate_agent(agent_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/validation-result', methods=['GET'])
def get_agent_validation_result(agent_id):
    """Get agent validation result"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        result = service.get_agent_validation_result(agent_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== ENVIRONMENTS ====================

@app.route('/api/agents/<agent_id>/environments', methods=['GET'])
def list_environments(agent_id):
    """List environments for an agent"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        environments = service.list_environments(agent_id)
        return jsonify({"environments": environments, "count": len(environments)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/environments/<environment_id>', methods=['GET'])
def get_environment(agent_id, environment_id):
    """Get a specific environment"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        environment = service.get_environment(agent_id, environment_id)
        return jsonify(environment), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/environments/<environment_id>/run-continuous-test', methods=['POST'])
def run_continuous_test(agent_id, environment_id):
    """Run continuous test for an environment"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        result = service.run_continuous_test(agent_id, environment_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/environments/<environment_id>/continuous-test-results', methods=['GET'])
def list_continuous_test_results(agent_id, environment_id):
    """List continuous test results"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        results = service.list_continuous_test_results(agent_id, environment_id)
        return jsonify({"results": results, "count": len(results)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/environments/<environment_id>/deployments', methods=['GET'])
def list_deployments(agent_id, environment_id):
    """List deployments for an environment"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        deployments = service.list_deployments(agent_id, environment_id)
        return jsonify({"deployments": deployments, "count": len(deployments)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== FLOWS ====================

@app.route('/api/agents/<agent_id>/flows', methods=['GET'])
def list_flows(agent_id):
    """List flows for an agent"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        flows = service.list_flows(agent_id)
        return jsonify({"flows": flows, "count": len(flows)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/flows/<flow_id>/validate', methods=['POST'])
def validate_flow(agent_id, flow_id):
    """Validate a flow"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        result = service.validate_flow(agent_id, flow_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/flows/<flow_id>/validation-result', methods=['GET'])
def get_flow_validation_result(agent_id, flow_id):
    """Get flow validation result"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        result = service.get_flow_validation_result(agent_id, flow_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/flows/<flow_id>/train', methods=['POST'])
def train_flow(agent_id, flow_id):
    """Train a flow"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        result = service.train_flow(agent_id, flow_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/flows/<flow_id>/pages', methods=['GET'])
def list_pages(agent_id, flow_id):
    """List pages for a flow"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        pages = service.list_pages(agent_id, flow_id)
        return jsonify({"pages": pages, "count": len(pages)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== TEST CASES ====================

@app.route('/api/agents/<agent_id>/test-cases', methods=['GET'])
def list_test_cases(agent_id):
    """List test cases for an agent"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        test_cases = service.list_test_cases(agent_id)
        return jsonify({"test_cases": test_cases, "count": len(test_cases)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/test-cases/<test_case_id>', methods=['GET'])
def get_test_case(agent_id, test_case_id):
    """Get a specific test case"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        test_case = service.get_test_case(agent_id, test_case_id)
        return jsonify(test_case), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/test-cases', methods=['POST'])
def create_test_case(agent_id):
    """Create a new test case"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')
    data = request.get_json()

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    if not data or not data.get('display_name'):
        return jsonify({"error": "display_name is required"}), 400

    try:
        service = get_service(project_id, location)
        result = service.create_test_case(
            agent_id,
            display_name=data['display_name'],
            tags=data.get('tags', []),
            notes=data.get('notes', ''),
            test_conversation=data.get('test_conversation', [])
        )
        return jsonify(result), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/test-cases/<test_case_id>', methods=['DELETE'])
def delete_test_case(agent_id, test_case_id):
    """Delete a test case"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        result = service.delete_test_case(agent_id, test_case_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/test-cases:batch-delete', methods=['POST'])
def batch_delete_test_cases(agent_id):
    """Batch delete test cases"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')
    data = request.get_json()

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    if not data or not data.get('test_case_ids'):
        return jsonify({"error": "test_case_ids is required"}), 400

    try:
        service = get_service(project_id, location)
        result = service.batch_delete_test_cases(agent_id, data['test_case_ids'])
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/test-cases/<test_case_id>/run', methods=['POST'])
def run_test_case(agent_id, test_case_id):
    """Run a single test case"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')
    data = request.get_json() or {}

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        result = service.run_test_case(agent_id, test_case_id, data.get('environment_id'))
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/test-cases:batch-run', methods=['POST'])
def batch_run_test_cases(agent_id):
    """Batch run test cases"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')
    data = request.get_json()

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    if not data or not data.get('test_case_ids'):
        return jsonify({"error": "test_case_ids is required"}), 400

    try:
        service = get_service(project_id, location)
        result = service.batch_run_test_cases(
            agent_id,
            data['test_case_ids'],
            data.get('environment_id')
        )
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/test-cases/<test_case_id>/results', methods=['GET'])
def list_test_case_results(agent_id, test_case_id):
    """List test case results"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        results = service.list_test_case_results(agent_id, test_case_id)
        return jsonify({"results": results, "count": len(results)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/test-coverage', methods=['GET'])
def calculate_test_coverage(agent_id):
    """Calculate test coverage"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')
    coverage_type = request.args.get('type', 'INTENT')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        result = service.calculate_test_coverage(agent_id, coverage_type)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== INTENTS ====================

@app.route('/api/agents/<agent_id>/intents', methods=['GET'])
def list_intents(agent_id):
    """List intents for an agent"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        intents = service.list_intents(agent_id)
        return jsonify({"intents": intents, "count": len(intents)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/intents/<intent_id>', methods=['GET'])
def get_intent(agent_id, intent_id):
    """Get a specific intent"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        intent = service.get_intent(agent_id, intent_id)
        return jsonify(intent), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== SESSIONS / DETECT INTENT ====================

@app.route('/api/agents/<agent_id>/detect-intent', methods=['POST'])
def detect_intent(agent_id):
    """Detect intent for text input"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')
    data = request.get_json()

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    if not data or not data.get('text'):
        return jsonify({"error": "text is required"}), 400

    session_id = data.get('session_id', str(uuid.uuid4()))

    try:
        service = get_service(project_id, location)
        result = service.detect_intent(
            agent_id,
            session_id,
            data['text'],
            data.get('language_code', 'en'),
            data.get('environment_id')
        )
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents/<agent_id>/match-intent', methods=['POST'])
def match_intent(agent_id):
    """Match intent without changing session state"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')
    data = request.get_json()

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    if not data or not data.get('text'):
        return jsonify({"error": "text is required"}), 400

    session_id = data.get('session_id', str(uuid.uuid4()))

    try:
        service = get_service(project_id, location)
        result = service.match_intent(
            agent_id,
            session_id,
            data['text'],
            data.get('language_code', 'en')
        )
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== CHANGELOGS ====================

@app.route('/api/agents/<agent_id>/changelogs', methods=['GET'])
def list_changelogs(agent_id):
    """List changelogs for an agent"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        changelogs = service.list_changelogs(agent_id)
        return jsonify({"changelogs": changelogs, "count": len(changelogs)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== WEBHOOKS ====================

@app.route('/api/agents/<agent_id>/webhooks', methods=['GET'])
def list_webhooks(agent_id):
    """List webhooks for an agent"""
    project_id = request.args.get('project_id')
    location = request.args.get('location', 'global')

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        service = get_service(project_id, location)
        webhooks = service.list_webhooks(agent_id)
        return jsonify({"webhooks": webhooks, "count": len(webhooks)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== CSV TESTING (Legacy) ====================

@app.route('/api/upload-csv', methods=['POST'])
def upload_csv():
    """Upload CSV file endpoint"""
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Only CSV files allowed"}), 400

    agent_id = request.form.get('agent_id')
    location = request.form.get('location', 'global')
    project_id = request.form.get('project_id')
    environment_id = request.form.get('environment_id')

    if not agent_id:
        return jsonify({"error": "agent_id is required"}), 400

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    filename = secure_filename(file.filename)
    timestamp = int(time.time())
    unique_filename = f"{timestamp}_{filename}"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(filepath)

    try:
        runner = DialogflowTestRunner(project_id, location, agent_id, environment_id)
        test_cases = runner.parse_csv(filepath)

        return jsonify({
            "message": "File uploaded successfully",
            "filename": unique_filename,
            "test_count": len(test_cases),
            "test_cases": test_cases[:5],
            "config": {
                "project_id": project_id,
                "agent_id": agent_id,
                "location": location,
                "environment_id": environment_id or "-"
            }
        }), 200

    except Exception as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({"error": f"Failed to parse CSV: {str(e)}"}), 400


@app.route('/api/run-tests', methods=['POST'])
def run_tests():
    """Run tests from uploaded CSV file"""
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

    if not project_id:
        try:
            project_id = get_project_id_from_gcloud()
        except Exception as e:
            return jsonify({"error": f"Could not determine project ID: {str(e)}"}), 400

    try:
        runner = DialogflowTestRunner(project_id, location, agent_id, environment_id)
        results = runner.run_csv_tests(filepath)

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
    """Get test results by ID"""
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
    """List all available test results"""
    try:
        results = []
        for filename in os.listdir(app.config['RESULTS_FOLDER']):
            if filename.endswith('.json'):
                filepath = os.path.join(app.config['RESULTS_FOLDER'], filename)
                stat = os.stat(filepath)

                with open(filepath, 'r') as f:
                    data = json.load(f)

                results.append({
                    "result_id": filename,
                    "created_at": datetime.fromtimestamp(stat.st_ctime).isoformat(),
                    "summary": data.get('summary', {}),
                    "config": data.get('config', {})
                })

        results.sort(key=lambda x: x['created_at'], reverse=True)

        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": f"Failed to list results: {str(e)}"}), 500


@app.route('/api/download-sample-csv', methods=['GET'])
def download_sample_csv():
    """Download sample CSV template"""
    sample_csv = """test_id,conversation,expected_intent,language_code
test_1,Hi|I want to book a flight|Tomorrow,booking.flight,en
test_2,Hello|I need help,help.general,en
test_3,What's the weather like?|Show me forecast for New York,weather.check,en
test_4,Cancel my order|Order number 12345,order.cancel,en
test_5,Hi|Goodbye,greeting.bye,en"""

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
    print("Starting Dialogflow CX SaaS Testing Platform...")
    print(f"Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")
    print(f"Results folder: {os.path.abspath(RESULTS_FOLDER)}")
    print("API endpoints available at http://localhost:5000/api/")
    app.run(debug=True, host='0.0.0.0', port=5000)
