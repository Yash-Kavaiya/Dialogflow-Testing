# Dialogflow CSV Testing Backend

Flask-based backend API for running automated Dialogflow CX tests from CSV files.

## Features

- Upload CSV files with test conversations
- Parse and validate test cases
- Execute tests against Dialogflow CX agents
- Store and retrieve test results
- Download sample CSV template
- RESTful API for frontend integration

## Prerequisites

- Python 3.8+
- Google Cloud Platform account
- Dialogflow CX agent
- Google Cloud credentials configured

## Installation

### 1. Install Python dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Set up Google Cloud credentials

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"
```

Or place your credentials file in the backend directory and update the environment variable.

### 3. Start the Flask server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## CSV Format

The CSV file should have the following columns:

| Column | Description | Required |
|--------|-------------|----------|
| test_id | Unique identifier for the test case | Yes |
| conversation | Pipe-separated user utterances | Yes |
| expected_intent | Expected intent for validation | No |
| language_code | Language code (e.g., 'en', 'es') | No (defaults to 'en') |

### Example CSV

```csv
test_id,conversation,expected_intent,language_code
test_1,Hi|I want to book a flight|Tomorrow,booking.flight,en
test_2,Hello|I need help,help.general,en
test_3,What's the weather like?|Show me forecast for New York,weather.check,en
test_4,Cancel my order|Order number 12345,order.cancel,en
test_5,Hi|Goodbye,greeting.bye,en
```

## API Endpoints

### Health Check

```http
GET /api/health
```

Returns the health status of the server.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00"
}
```

### Upload CSV

```http
POST /api/upload-csv
```

Upload and parse a CSV file with test cases.

**Form Data:**
- `file`: CSV file
- `agent_id`: Dialogflow CX agent ID (required)
- `location`: Dialogflow location (optional, defaults to 'global')
- `project_id`: GCP project ID (optional, uses default credentials if not provided)
- `environment_id`: Environment ID (optional, defaults to '-')

**Response:**
```json
{
  "message": "File uploaded successfully",
  "filename": "1642245600_test_cases.csv",
  "test_count": 10,
  "test_cases": [...],
  "config": {
    "project_id": "my-project",
    "agent_id": "agent-123",
    "location": "global",
    "environment_id": "-"
  }
}
```

### Run Tests

```http
POST /api/run-tests
```

Execute tests from an uploaded CSV file.

**Request Body:**
```json
{
  "filename": "1642245600_test_cases.csv",
  "project_id": "my-project",
  "agent_id": "agent-123",
  "location": "global",
  "environment_id": "-"
}
```

**Response:**
```json
{
  "summary": {
    "total_tests": 10,
    "passed": 8,
    "failed": 2,
    "pass_rate": 80.0
  },
  "results": [...],
  "config": {...},
  "result_id": "results_1642245700.json"
}
```

### Get Results

```http
GET /api/results/<result_id>
```

Retrieve test results by ID.

**Response:**
```json
{
  "summary": {...},
  "results": [...],
  "config": {...}
}
```

### List All Results

```http
GET /api/results
```

List all available test results.

**Response:**
```json
[
  {
    "result_id": "results_1642245700.json",
    "created_at": "2025-01-15T10:35:00",
    "summary": {...},
    "config": {...}
  }
]
```

### Download Sample CSV

```http
GET /api/download-sample-csv
```

Download a sample CSV template.

## Project Structure

```
backend/
├── app.py                  # Flask application with API endpoints
├── csv_test_runner.py      # Core test runner logic
├── requirements.txt        # Python dependencies
├── README.md              # This file
├── uploads/               # Uploaded CSV files (created automatically)
└── results/               # Test results (created automatically)
```

## Usage Examples

### Command Line Test Runner

You can also run tests directly from the command line:

```bash
python csv_test_runner.py test_cases.csv <agent_id> <location> [project_id] [environment_id]
```

**Example:**
```bash
python csv_test_runner.py my_tests.csv abc123 global my-gcp-project
```

### Python API

```python
from csv_test_runner import DialogflowTestRunner

# Initialize runner
runner = DialogflowTestRunner(
    project_id="my-project",
    location="global",
    agent_id="abc123",
    environment_id=None  # Optional
)

# Run tests from CSV
results = runner.run_csv_tests("test_cases.csv")

# Print summary
print(f"Total Tests: {results['summary']['total_tests']}")
print(f"Passed: {results['summary']['passed']}")
print(f"Failed: {results['summary']['failed']}")
print(f"Pass Rate: {results['summary']['pass_rate']}%")
```

## Configuration

### Environment Variables

- `GOOGLE_APPLICATION_CREDENTIALS`: Path to Google Cloud credentials JSON file
- `LOCATION`: Default Dialogflow location (optional)

### Flask Configuration

You can modify the following in `app.py`:

- `UPLOAD_FOLDER`: Directory for uploaded files (default: 'uploads')
- `RESULTS_FOLDER`: Directory for test results (default: 'results')
- `MAX_FILE_SIZE`: Maximum upload file size (default: 5MB)

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad request (missing parameters, invalid file)
- `404`: Resource not found
- `413`: File too large
- `500`: Internal server error

## Testing Best Practices

1. **Start Simple**: Begin with basic single-turn conversations
2. **Use Descriptive IDs**: Name test cases clearly (e.g., `booking_flight_success`)
3. **Test Edge Cases**: Include fallback and error scenarios
4. **Validate Intents**: Provide expected intents for verification
5. **Multi-language**: Test in all supported languages
6. **Monitor Performance**: Check response times in results

## Troubleshooting

### Authentication Errors

If you get authentication errors:
1. Verify `GOOGLE_APPLICATION_CREDENTIALS` is set correctly
2. Ensure the service account has Dialogflow API access
3. Check that the project ID is correct

### Connection Errors

If you get connection errors:
1. Verify the agent ID and location are correct
2. Check that the Dialogflow API is enabled in your project
3. Ensure network connectivity to Google Cloud

### CSV Parsing Errors

If CSV parsing fails:
1. Verify the CSV format matches the specification
2. Check for empty rows or malformed data
3. Ensure proper UTF-8 encoding
4. Download and reference the sample CSV template

## Contributing

Contributions are welcome! Please ensure:
- Code follows PEP 8 style guidelines
- All functions have docstrings
- Error handling is comprehensive
- API changes are documented

## License

MIT License - See main repository for details

## Support

For issues or questions:
- Open an issue on GitHub
- Check the main project README
- Review Dialogflow CX documentation
