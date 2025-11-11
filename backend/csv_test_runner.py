"""
CSV-based Dialogflow CX Test Runner
Reads test cases from CSV and executes them against Dialogflow CX agents
"""
import csv
import uuid
import time
from typing import List, Dict, Any
from google.cloud import dialogflowcx_v3 as dialogflow
from google.cloud import storage
import os


class DialogflowTestRunner:
    """Handles test execution for Dialogflow CX agents"""

    def __init__(self, project_id: str, location: str, agent_id: str, environment_id: str = None):
        """
        Initialize the test runner

        Args:
            project_id: GCP project ID
            location: Dialogflow location (e.g., 'global', 'us-central1')
            agent_id: Dialogflow CX agent ID
            environment_id: Environment ID (optional, defaults to '-')
        """
        self.project_id = project_id
        self.location = location
        self.agent_id = agent_id
        self.environment_id = environment_id or "-"

        # Set up client options based on location
        if location == "global":
            self.client_options = {"api_endpoint": "dialogflow.googleapis.com"}
        else:
            self.client_options = {"api_endpoint": f"{location}-dialogflow.googleapis.com"}

    def create_session(self) -> str:
        """Create a new Dialogflow session"""
        session_id = str(uuid.uuid4())
        session_path = (
            f"projects/{self.project_id}/locations/{self.location}/"
            f"agents/{self.agent_id}/environments/{self.environment_id}/"
            f"sessions/{session_id}"
        )
        return session_path

    def send_text_input(self, session_path: str, text: str, language_code: str = "en") -> dialogflow.QueryResult:
        """
        Send text input to Dialogflow and get response

        Args:
            session_path: Full session path
            text: User input text
            language_code: Language code (default: 'en')

        Returns:
            QueryResult with agent response
        """
        session_client = dialogflow.SessionsClient(client_options=self.client_options)
        request = dialogflow.DetectIntentRequest(
            session=session_path,
            query_input=dialogflow.QueryInput(
                text=dialogflow.TextInput(text=text),
                language_code=language_code
            ),
        )
        response = session_client.detect_intent(request=request)
        return response.query_result

    def run_conversation_test(self, conversation: List[str], language_code: str = "en") -> List[Dict[str, Any]]:
        """
        Run a single conversation test

        Args:
            conversation: List of user inputs for the conversation
            language_code: Language code for the test

        Returns:
            List of test results for each turn
        """
        session_path = self.create_session()
        results = []

        for turn_index, user_input in enumerate(conversation):
            try:
                start_time = time.time()
                query_result = self.send_text_input(session_path, user_input, language_code)
                response_time = time.time() - start_time

                # Extract response text
                response_messages = []
                for response_message in query_result.response_messages:
                    if response_message.text:
                        response_messages.extend(response_message.text.text)

                result = {
                    "turn": turn_index + 1,
                    "user_input": user_input,
                    "intent": query_result.intent.display_name if query_result.intent else "No Match",
                    "confidence": query_result.intent_detection_confidence if query_result.intent else 0.0,
                    "response_messages": response_messages,
                    "response_time": round(response_time, 3),
                    "parameters": dict(query_result.parameters) if query_result.parameters else {},
                    "status": "success"
                }

                results.append(result)
                time.sleep(0.2)  # Rate limiting

            except Exception as e:
                results.append({
                    "turn": turn_index + 1,
                    "user_input": user_input,
                    "intent": "Error",
                    "confidence": 0.0,
                    "response_messages": [],
                    "response_time": 0.0,
                    "parameters": {},
                    "status": "error",
                    "error": str(e)
                })

        return results

    def parse_csv(self, csv_file_path: str) -> List[Dict[str, Any]]:
        """
        Parse CSV file containing test cases

        CSV Format:
        - Column 1: Test Case ID
        - Column 2: Conversation (pipe-separated utterances)
        - Column 3 (optional): Expected Intent
        - Column 4 (optional): Language Code

        Example:
        test_1,Hi|I want to book a flight|Tomorrow,booking.flight,en
        test_2,Hello|Cancel my order,order.cancel,en

        Args:
            csv_file_path: Path to CSV file

        Returns:
            List of parsed test cases
        """
        test_cases = []

        with open(csv_file_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            header = next(reader, None)  # Skip header if exists

            for row in reader:
                if not row or not row[0]:  # Skip empty rows
                    continue

                test_case = {
                    "test_id": row[0].strip(),
                    "conversation": [msg.strip() for msg in row[1].split('|')],
                    "expected_intent": row[2].strip() if len(row) > 2 and row[2] else None,
                    "language_code": row[3].strip() if len(row) > 3 and row[3] else "en"
                }
                test_cases.append(test_case)

        return test_cases

    def run_csv_tests(self, csv_file_path: str) -> Dict[str, Any]:
        """
        Run all tests from CSV file

        Args:
            csv_file_path: Path to CSV file with test cases

        Returns:
            Dictionary with test summary and detailed results
        """
        test_cases = self.parse_csv(csv_file_path)
        all_results = []

        total_tests = len(test_cases)
        passed_tests = 0
        failed_tests = 0

        for test_case in test_cases:
            print(f"Running test: {test_case['test_id']}")

            conversation_results = self.run_conversation_test(
                test_case['conversation'],
                test_case['language_code']
            )

            # Check if test passed (if expected intent was provided)
            test_passed = True
            if test_case['expected_intent']:
                # Check last turn's intent
                last_result = conversation_results[-1] if conversation_results else None
                if last_result and last_result.get('intent') != test_case['expected_intent']:
                    test_passed = False

            # Check for errors
            if any(r.get('status') == 'error' for r in conversation_results):
                test_passed = False

            if test_passed:
                passed_tests += 1
            else:
                failed_tests += 1

            all_results.append({
                "test_id": test_case['test_id'],
                "expected_intent": test_case['expected_intent'],
                "passed": test_passed,
                "conversation_results": conversation_results
            })

        summary = {
            "total_tests": total_tests,
            "passed": passed_tests,
            "failed": failed_tests,
            "pass_rate": round((passed_tests / total_tests * 100), 2) if total_tests > 0 else 0
        }

        return {
            "summary": summary,
            "results": all_results,
            "config": {
                "project_id": self.project_id,
                "location": self.location,
                "agent_id": self.agent_id,
                "environment_id": self.environment_id
            }
        }


def get_project_id_from_gcloud() -> str:
    """Get project ID from default Google Cloud credentials"""
    try:
        storage_client = storage.Client()
        return storage_client.project
    except Exception as e:
        raise Exception(f"Could not determine project ID: {e}")


if __name__ == "__main__":
    # Example usage
    import sys

    if len(sys.argv) < 4:
        print("Usage: python csv_test_runner.py <csv_file> <agent_id> <location> [project_id] [environment_id]")
        sys.exit(1)

    csv_file = sys.argv[1]
    agent_id = sys.argv[2]
    location = sys.argv[3]
    project_id = sys.argv[4] if len(sys.argv) > 4 else get_project_id_from_gcloud()
    environment_id = sys.argv[5] if len(sys.argv) > 5 else None

    runner = DialogflowTestRunner(project_id, location, agent_id, environment_id)
    results = runner.run_csv_tests(csv_file)

    print("\n=== Test Summary ===")
    print(f"Total Tests: {results['summary']['total_tests']}")
    print(f"Passed: {results['summary']['passed']}")
    print(f"Failed: {results['summary']['failed']}")
    print(f"Pass Rate: {results['summary']['pass_rate']}%")
