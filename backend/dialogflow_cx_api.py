"""
Dialogflow CX API Service
Comprehensive API wrapper for Dialogflow CX testing operations
"""
import uuid
import time
from typing import List, Dict, Any, Optional
from google.cloud import dialogflowcx_v3 as dialogflow
from google.protobuf import field_mask_pb2
import os


class DialogflowCXService:
    """Service class for Dialogflow CX API operations"""

    def __init__(self, project_id: str, location: str):
        """
        Initialize the Dialogflow CX service

        Args:
            project_id: GCP project ID
            location: Dialogflow location (e.g., 'global', 'us-central1')
        """
        self.project_id = project_id
        self.location = location

        # Set up client options based on location
        if location == "global":
            self.client_options = {"api_endpoint": "dialogflow.googleapis.com"}
        else:
            self.client_options = {"api_endpoint": f"{location}-dialogflow.googleapis.com"}

    def _get_parent(self) -> str:
        """Get parent path for API calls"""
        return f"projects/{self.project_id}/locations/{self.location}"

    # ==================== AGENTS ====================

    def list_agents(self) -> List[Dict[str, Any]]:
        """List all agents in the project/location"""
        client = dialogflow.AgentsClient(client_options=self.client_options)
        parent = self._get_parent()

        agents = []
        for agent in client.list_agents(parent=parent):
            agents.append({
                "name": agent.name,
                "display_name": agent.display_name,
                "default_language_code": agent.default_language_code,
                "time_zone": agent.time_zone,
                "description": agent.description or "",
                "avatar_uri": agent.avatar_uri or "",
                "start_flow": agent.start_flow,
                "enable_stackdriver_logging": agent.enable_stackdriver_logging,
                "enable_spell_correction": agent.enable_spell_correction,
            })
        return agents

    def get_agent(self, agent_id: str) -> Dict[str, Any]:
        """Get a specific agent"""
        client = dialogflow.AgentsClient(client_options=self.client_options)
        name = f"{self._get_parent()}/agents/{agent_id}"

        agent = client.get_agent(name=name)
        return {
            "name": agent.name,
            "display_name": agent.display_name,
            "default_language_code": agent.default_language_code,
            "time_zone": agent.time_zone,
            "description": agent.description or "",
            "avatar_uri": agent.avatar_uri or "",
            "start_flow": agent.start_flow,
            "supported_language_codes": list(agent.supported_language_codes),
        }

    def validate_agent(self, agent_id: str) -> Dict[str, Any]:
        """Validate an agent and get validation results"""
        client = dialogflow.AgentsClient(client_options=self.client_options)
        name = f"{self._get_parent()}/agents/{agent_id}"

        request = dialogflow.ValidateAgentRequest(name=name)
        result = client.validate_agent(request=request)

        validation_messages = []
        for msg in result.validation_messages:
            validation_messages.append({
                "resource_type": str(msg.resource_type),
                "resources": list(msg.resources),
                "resource_names": [
                    {"name": rn.name, "display_name": rn.display_name}
                    for rn in msg.resource_names
                ],
                "severity": str(msg.severity),
                "detail": msg.detail,
            })

        return {
            "name": result.name,
            "validation_messages": validation_messages
        }

    def get_agent_validation_result(self, agent_id: str) -> Dict[str, Any]:
        """Get the latest validation result for an agent"""
        client = dialogflow.AgentsClient(client_options=self.client_options)
        name = f"{self._get_parent()}/agents/{agent_id}/validationResult"

        result = client.get_validation_result(name=name)

        validation_messages = []
        for msg in result.validation_messages:
            validation_messages.append({
                "resource_type": str(msg.resource_type),
                "resources": list(msg.resources),
                "severity": str(msg.severity),
                "detail": msg.detail,
            })

        return {
            "name": result.name,
            "validation_messages": validation_messages
        }

    # ==================== ENVIRONMENTS ====================

    def list_environments(self, agent_id: str) -> List[Dict[str, Any]]:
        """List all environments for an agent"""
        client = dialogflow.EnvironmentsClient(client_options=self.client_options)
        parent = f"{self._get_parent()}/agents/{agent_id}"

        environments = []
        for env in client.list_environments(parent=parent):
            environments.append({
                "name": env.name,
                "display_name": env.display_name,
                "description": env.description or "",
                "update_time": env.update_time.isoformat() if env.update_time else None,
                "version_configs": [
                    {"version": vc.version, "flow": getattr(vc, 'flow', '')}
                    for vc in env.version_configs
                ] if env.version_configs else [],
            })
        return environments

    def get_environment(self, agent_id: str, environment_id: str) -> Dict[str, Any]:
        """Get a specific environment"""
        client = dialogflow.EnvironmentsClient(client_options=self.client_options)
        name = f"{self._get_parent()}/agents/{agent_id}/environments/{environment_id}"

        env = client.get_environment(name=name)
        return {
            "name": env.name,
            "display_name": env.display_name,
            "description": env.description or "",
            "update_time": env.update_time.isoformat() if env.update_time else None,
        }

    def run_continuous_test(self, agent_id: str, environment_id: str) -> Dict[str, Any]:
        """Run continuous test for an environment"""
        client = dialogflow.EnvironmentsClient(client_options=self.client_options)
        environment = f"{self._get_parent()}/agents/{agent_id}/environments/{environment_id}"

        request = dialogflow.RunContinuousTestRequest(environment=environment)
        operation = client.run_continuous_test(request=request)

        # Wait for operation to complete
        result = operation.result(timeout=300)

        return {
            "name": result.continuous_test_result.name if result.continuous_test_result else "",
            "result": str(result.continuous_test_result.result) if result.continuous_test_result else "",
            "run_time": result.continuous_test_result.run_time.isoformat() if result.continuous_test_result and result.continuous_test_result.run_time else None,
            "test_case_results": [
                {"name": tcr.name, "test_result": str(tcr.test_result) if hasattr(tcr, 'test_result') else ""}
                for tcr in result.continuous_test_result.test_case_results
            ] if result.continuous_test_result and result.continuous_test_result.test_case_results else []
        }

    def list_continuous_test_results(self, agent_id: str, environment_id: str) -> List[Dict[str, Any]]:
        """List continuous test results for an environment"""
        client = dialogflow.ContinuousTestResultsClient(client_options=self.client_options)
        parent = f"{self._get_parent()}/agents/{agent_id}/environments/{environment_id}"

        results = []
        for result in client.list_continuous_test_results(parent=parent):
            results.append({
                "name": result.name,
                "result": str(result.result),
                "run_time": result.run_time.isoformat() if result.run_time else None,
                "test_case_results": [tcr.name for tcr in result.test_case_results] if result.test_case_results else []
            })
        return results

    # ==================== FLOWS ====================

    def list_flows(self, agent_id: str) -> List[Dict[str, Any]]:
        """List all flows for an agent"""
        client = dialogflow.FlowsClient(client_options=self.client_options)
        parent = f"{self._get_parent()}/agents/{agent_id}"

        flows = []
        for flow in client.list_flows(parent=parent):
            flows.append({
                "name": flow.name,
                "display_name": flow.display_name,
                "description": flow.description or "",
                "nlu_settings": {
                    "model_type": str(flow.nlu_settings.model_type) if flow.nlu_settings else "",
                    "classification_threshold": flow.nlu_settings.classification_threshold if flow.nlu_settings else 0,
                } if flow.nlu_settings else None,
            })
        return flows

    def validate_flow(self, agent_id: str, flow_id: str) -> Dict[str, Any]:
        """Validate a flow"""
        client = dialogflow.FlowsClient(client_options=self.client_options)
        name = f"{self._get_parent()}/agents/{agent_id}/flows/{flow_id}"

        request = dialogflow.ValidateFlowRequest(name=name)
        result = client.validate_flow(request=request)

        validation_messages = []
        for msg in result.validation_messages:
            validation_messages.append({
                "resource_type": str(msg.resource_type),
                "resources": list(msg.resources),
                "severity": str(msg.severity),
                "detail": msg.detail,
            })

        return {
            "name": result.name,
            "validation_messages": validation_messages
        }

    def get_flow_validation_result(self, agent_id: str, flow_id: str) -> Dict[str, Any]:
        """Get flow validation result"""
        client = dialogflow.FlowsClient(client_options=self.client_options)
        name = f"{self._get_parent()}/agents/{agent_id}/flows/{flow_id}/validationResult"

        result = client.get_flow_validation_result(name=name)

        validation_messages = []
        for msg in result.validation_messages:
            validation_messages.append({
                "resource_type": str(msg.resource_type),
                "resources": list(msg.resources),
                "severity": str(msg.severity),
                "detail": msg.detail,
            })

        return {
            "name": result.name,
            "validation_messages": validation_messages,
            "update_time": result.update_time.isoformat() if result.update_time else None
        }

    def train_flow(self, agent_id: str, flow_id: str) -> Dict[str, Any]:
        """Train a flow"""
        client = dialogflow.FlowsClient(client_options=self.client_options)
        name = f"{self._get_parent()}/agents/{agent_id}/flows/{flow_id}"

        request = dialogflow.TrainFlowRequest(name=name)
        operation = client.train_flow(request=request)

        # Wait for training to complete
        operation.result(timeout=300)

        return {"status": "success", "message": "Flow training completed"}

    # ==================== TEST CASES ====================

    def list_test_cases(self, agent_id: str) -> List[Dict[str, Any]]:
        """List all test cases for an agent"""
        client = dialogflow.TestCasesClient(client_options=self.client_options)
        parent = f"{self._get_parent()}/agents/{agent_id}"

        test_cases = []
        for tc in client.list_test_cases(parent=parent):
            test_cases.append({
                "name": tc.name,
                "display_name": tc.display_name,
                "tags": list(tc.tags) if tc.tags else [],
                "notes": tc.notes or "",
                "creation_time": tc.creation_time.isoformat() if tc.creation_time else None,
                "last_test_result": {
                    "name": tc.last_test_result.name,
                    "test_result": str(tc.last_test_result.test_result) if hasattr(tc.last_test_result, 'test_result') else "",
                    "test_time": tc.last_test_result.test_time.isoformat() if tc.last_test_result.test_time else None,
                } if tc.last_test_result else None,
            })
        return test_cases

    def get_test_case(self, agent_id: str, test_case_id: str) -> Dict[str, Any]:
        """Get a specific test case"""
        client = dialogflow.TestCasesClient(client_options=self.client_options)
        name = f"{self._get_parent()}/agents/{agent_id}/testCases/{test_case_id}"

        tc = client.get_test_case(name=name)

        # Parse test conversation turns
        test_config_turns = []
        if tc.test_case_conversation_turns:
            for turn in tc.test_case_conversation_turns:
                turn_data = {}
                if turn.user_input:
                    turn_data["user_input"] = {
                        "text": turn.user_input.input.text.text if turn.user_input.input and turn.user_input.input.text else "",
                        "is_webhook_enabled": turn.user_input.is_webhook_enabled,
                    }
                if turn.virtual_agent_output:
                    turn_data["virtual_agent_output"] = {
                        "triggered_intent": turn.virtual_agent_output.triggered_intent.display_name if turn.virtual_agent_output.triggered_intent else "",
                        "current_page": turn.virtual_agent_output.current_page.display_name if turn.virtual_agent_output.current_page else "",
                    }
                test_config_turns.append(turn_data)

        return {
            "name": tc.name,
            "display_name": tc.display_name,
            "tags": list(tc.tags) if tc.tags else [],
            "notes": tc.notes or "",
            "test_config": test_config_turns,
            "creation_time": tc.creation_time.isoformat() if tc.creation_time else None,
        }

    def create_test_case(self, agent_id: str, display_name: str, tags: List[str] = None,
                         notes: str = "", test_conversation: List[Dict] = None) -> Dict[str, Any]:
        """Create a new test case"""
        client = dialogflow.TestCasesClient(client_options=self.client_options)
        parent = f"{self._get_parent()}/agents/{agent_id}"

        # Build conversation turns
        conversation_turns = []
        if test_conversation:
            for turn in test_conversation:
                conversation_turn = dialogflow.ConversationTurn()

                if "user_input" in turn:
                    user_input = dialogflow.ConversationTurn.UserInput()
                    user_input.input = dialogflow.QueryInput(
                        text=dialogflow.TextInput(text=turn["user_input"]["text"]),
                        language_code=turn["user_input"].get("language_code", "en")
                    )
                    conversation_turn.user_input = user_input

                if "expected_intent" in turn:
                    virtual_agent = dialogflow.ConversationTurn.VirtualAgentOutput()
                    virtual_agent.triggered_intent = dialogflow.Intent(
                        display_name=turn["expected_intent"]
                    )
                    conversation_turn.virtual_agent_output = virtual_agent

                conversation_turns.append(conversation_turn)

        test_case = dialogflow.TestCase(
            display_name=display_name,
            tags=tags or [],
            notes=notes,
            test_case_conversation_turns=conversation_turns
        )

        request = dialogflow.CreateTestCaseRequest(
            parent=parent,
            test_case=test_case
        )

        result = client.create_test_case(request=request)

        return {
            "name": result.name,
            "display_name": result.display_name,
            "tags": list(result.tags) if result.tags else [],
            "notes": result.notes or "",
            "creation_time": result.creation_time.isoformat() if result.creation_time else None,
        }

    def run_test_case(self, agent_id: str, test_case_id: str, environment_id: str = None) -> Dict[str, Any]:
        """Run a single test case"""
        client = dialogflow.TestCasesClient(client_options=self.client_options)
        name = f"{self._get_parent()}/agents/{agent_id}/testCases/{test_case_id}"

        environment = None
        if environment_id:
            environment = f"{self._get_parent()}/agents/{agent_id}/environments/{environment_id}"

        request = dialogflow.RunTestCaseRequest(
            name=name,
            environment=environment
        )

        operation = client.run_test_case(request=request)
        result = operation.result(timeout=120)

        conversation_turns = []
        if result.result and result.result.conversation_turns:
            for turn in result.result.conversation_turns:
                turn_data = {}
                if turn.user_input:
                    turn_data["user_input"] = turn.user_input.input.text.text if turn.user_input.input and turn.user_input.input.text else ""
                if turn.virtual_agent_output:
                    turn_data["actual_output"] = {
                        "triggered_intent": turn.virtual_agent_output.triggered_intent.display_name if turn.virtual_agent_output.triggered_intent else "",
                        "current_page": turn.virtual_agent_output.current_page.display_name if turn.virtual_agent_output.current_page else "",
                        "differences": [
                            {"type": str(d.type_), "description": d.description}
                            for d in turn.virtual_agent_output.differences
                        ] if turn.virtual_agent_output.differences else []
                    }
                conversation_turns.append(turn_data)

        return {
            "name": result.result.name if result.result else "",
            "test_result": str(result.result.test_result) if result.result else "",
            "test_time": result.result.test_time.isoformat() if result.result and result.result.test_time else None,
            "conversation_turns": conversation_turns
        }

    def batch_run_test_cases(self, agent_id: str, test_case_ids: List[str], environment_id: str = None) -> Dict[str, Any]:
        """Batch run multiple test cases"""
        client = dialogflow.TestCasesClient(client_options=self.client_options)
        parent = f"{self._get_parent()}/agents/{agent_id}"

        test_cases = [
            f"{self._get_parent()}/agents/{agent_id}/testCases/{tc_id}"
            for tc_id in test_case_ids
        ]

        environment = None
        if environment_id:
            environment = f"{self._get_parent()}/agents/{agent_id}/environments/{environment_id}"

        request = dialogflow.BatchRunTestCasesRequest(
            parent=parent,
            test_cases=test_cases,
            environment=environment
        )

        operation = client.batch_run_test_cases(request=request)
        result = operation.result(timeout=600)

        results = []
        for tcr in result.results:
            results.append({
                "name": tcr.name,
                "test_result": str(tcr.test_result),
                "test_time": tcr.test_time.isoformat() if tcr.test_time else None,
            })

        return {"results": results}

    def calculate_test_coverage(self, agent_id: str, coverage_type: str = "INTENT") -> Dict[str, Any]:
        """Calculate test coverage for an agent"""
        client = dialogflow.TestCasesClient(client_options=self.client_options)
        agent = f"{self._get_parent()}/agents/{agent_id}"

        # Map coverage type string to enum
        type_map = {
            "INTENT": dialogflow.CalculateCoverageRequest.CoverageType.INTENT,
            "PAGE_TRANSITION": dialogflow.CalculateCoverageRequest.CoverageType.PAGE_TRANSITION,
            "TRANSITION_ROUTE_GROUP": dialogflow.CalculateCoverageRequest.CoverageType.TRANSITION_ROUTE_GROUP,
        }

        request = dialogflow.CalculateCoverageRequest(
            agent=agent,
            type_=type_map.get(coverage_type, dialogflow.CalculateCoverageRequest.CoverageType.INTENT)
        )

        result = client.calculate_coverage(request=request)

        coverage_data = {
            "agent": agent_id,
            "coverage_type": coverage_type,
        }

        if result.intent_coverage:
            coverage_data["intent_coverage"] = {
                "coverage_score": result.intent_coverage.coverage_score,
                "intents": [
                    {"intent": i.intent, "covered": i.covered}
                    for i in result.intent_coverage.intents
                ] if result.intent_coverage.intents else []
            }

        if result.transition_coverage:
            coverage_data["transition_coverage"] = {
                "coverage_score": result.transition_coverage.coverage_score,
            }

        if result.route_group_coverage:
            coverage_data["route_group_coverage"] = {
                "coverage_score": result.route_group_coverage.coverage_score,
            }

        return coverage_data

    def delete_test_case(self, agent_id: str, test_case_id: str) -> Dict[str, Any]:
        """Delete a test case"""
        client = dialogflow.TestCasesClient(client_options=self.client_options)
        name = f"{self._get_parent()}/agents/{agent_id}/testCases/{test_case_id}"

        client.delete_test_case(name=name)
        return {"status": "success", "message": f"Test case {test_case_id} deleted"}

    def batch_delete_test_cases(self, agent_id: str, test_case_ids: List[str]) -> Dict[str, Any]:
        """Batch delete test cases"""
        client = dialogflow.TestCasesClient(client_options=self.client_options)
        parent = f"{self._get_parent()}/agents/{agent_id}"

        names = [
            f"{self._get_parent()}/agents/{agent_id}/testCases/{tc_id}"
            for tc_id in test_case_ids
        ]

        request = dialogflow.BatchDeleteTestCasesRequest(
            parent=parent,
            names=names
        )

        client.batch_delete_test_cases(request=request)
        return {"status": "success", "message": f"Deleted {len(test_case_ids)} test cases"}

    def list_test_case_results(self, agent_id: str, test_case_id: str) -> List[Dict[str, Any]]:
        """List test case results"""
        client = dialogflow.TestCasesClient(client_options=self.client_options)
        parent = f"{self._get_parent()}/agents/{agent_id}/testCases/{test_case_id}"

        results = []
        for result in client.list_test_case_results(parent=parent):
            results.append({
                "name": result.name,
                "test_result": str(result.test_result),
                "test_time": result.test_time.isoformat() if result.test_time else None,
            })
        return results

    # ==================== INTENTS ====================

    def list_intents(self, agent_id: str) -> List[Dict[str, Any]]:
        """List all intents for an agent"""
        client = dialogflow.IntentsClient(client_options=self.client_options)
        parent = f"{self._get_parent()}/agents/{agent_id}"

        intents = []
        for intent in client.list_intents(parent=parent):
            intents.append({
                "name": intent.name,
                "display_name": intent.display_name,
                "description": intent.description or "",
                "priority": intent.priority,
                "is_fallback": intent.is_fallback,
                "labels": dict(intent.labels) if intent.labels else {},
            })
        return intents

    def get_intent(self, agent_id: str, intent_id: str) -> Dict[str, Any]:
        """Get a specific intent"""
        client = dialogflow.IntentsClient(client_options=self.client_options)
        name = f"{self._get_parent()}/agents/{agent_id}/intents/{intent_id}"

        intent = client.get_intent(name=name)

        training_phrases = []
        if intent.training_phrases:
            for tp in intent.training_phrases:
                parts_text = "".join(p.text for p in tp.parts) if tp.parts else ""
                training_phrases.append({
                    "id": tp.id,
                    "text": parts_text,
                    "repeat_count": tp.repeat_count,
                })

        return {
            "name": intent.name,
            "display_name": intent.display_name,
            "description": intent.description or "",
            "priority": intent.priority,
            "is_fallback": intent.is_fallback,
            "training_phrases": training_phrases,
            "parameters": [
                {
                    "id": p.id,
                    "entity_type": p.entity_type,
                    "is_list": p.is_list,
                    "redact": p.redact,
                }
                for p in intent.parameters
            ] if intent.parameters else []
        }

    # ==================== SESSIONS ====================

    def detect_intent(self, agent_id: str, session_id: str, text: str,
                      language_code: str = "en", environment_id: str = None) -> Dict[str, Any]:
        """Detect intent for a text input"""
        client = dialogflow.SessionsClient(client_options=self.client_options)

        if environment_id:
            session_path = (
                f"{self._get_parent()}/agents/{agent_id}/environments/{environment_id}"
                f"/sessions/{session_id}"
            )
        else:
            session_path = f"{self._get_parent()}/agents/{agent_id}/sessions/{session_id}"

        start_time = time.time()

        request = dialogflow.DetectIntentRequest(
            session=session_path,
            query_input=dialogflow.QueryInput(
                text=dialogflow.TextInput(text=text),
                language_code=language_code
            ),
        )

        response = client.detect_intent(request=request)
        response_time = time.time() - start_time
        query_result = response.query_result

        # Extract response messages
        response_messages = []
        for msg in query_result.response_messages:
            if msg.text:
                response_messages.extend(msg.text.text)

        return {
            "text": query_result.text,
            "language_code": query_result.language_code,
            "intent": {
                "name": query_result.intent.name if query_result.intent else "",
                "display_name": query_result.intent.display_name if query_result.intent else "No Match",
            },
            "intent_detection_confidence": query_result.intent_detection_confidence,
            "response_messages": response_messages,
            "parameters": dict(query_result.parameters) if query_result.parameters else {},
            "current_page": {
                "name": query_result.current_page.name if query_result.current_page else "",
                "display_name": query_result.current_page.display_name if query_result.current_page else "",
            },
            "response_time": round(response_time, 3),
            "session_id": session_id,
        }

    def match_intent(self, agent_id: str, session_id: str, text: str,
                     language_code: str = "en") -> Dict[str, Any]:
        """Match intent without changing session state"""
        client = dialogflow.SessionsClient(client_options=self.client_options)
        session_path = f"{self._get_parent()}/agents/{agent_id}/sessions/{session_id}"

        request = dialogflow.MatchIntentRequest(
            session=session_path,
            query_input=dialogflow.QueryInput(
                text=dialogflow.TextInput(text=text),
                language_code=language_code
            ),
        )

        response = client.match_intent(request=request)

        matches = []
        for match in response.matches:
            matches.append({
                "intent": {
                    "name": match.intent.name if match.intent else "",
                    "display_name": match.intent.display_name if match.intent else "",
                },
                "confidence": match.confidence,
                "parameters": dict(match.parameters) if match.parameters else {},
            })

        return {
            "text": response.text,
            "matches": matches,
            "current_page": {
                "name": response.current_page.name if response.current_page else "",
                "display_name": response.current_page.display_name if response.current_page else "",
            },
        }

    # ==================== DEPLOYMENTS ====================

    def list_deployments(self, agent_id: str, environment_id: str) -> List[Dict[str, Any]]:
        """List deployments for an environment"""
        client = dialogflow.DeploymentsClient(client_options=self.client_options)
        parent = f"{self._get_parent()}/agents/{agent_id}/environments/{environment_id}"

        deployments = []
        for deployment in client.list_deployments(parent=parent):
            deployments.append({
                "name": deployment.name,
                "flow_version": deployment.flow_version,
                "state": str(deployment.state),
                "start_time": deployment.start_time.isoformat() if deployment.start_time else None,
                "end_time": deployment.end_time.isoformat() if deployment.end_time else None,
            })
        return deployments

    # ==================== CHANGELOGS ====================

    def list_changelogs(self, agent_id: str) -> List[Dict[str, Any]]:
        """List changelogs for an agent"""
        client = dialogflow.ChangelogsClient(client_options=self.client_options)
        parent = f"{self._get_parent()}/agents/{agent_id}"

        changelogs = []
        for changelog in client.list_changelogs(parent=parent):
            changelogs.append({
                "name": changelog.name,
                "user_email": changelog.user_email,
                "display_name": changelog.display_name,
                "action": str(changelog.action),
                "type": str(changelog.type_),
                "resource": changelog.resource,
                "create_time": changelog.create_time.isoformat() if changelog.create_time else None,
            })
        return changelogs

    # ==================== WEBHOOKS ====================

    def list_webhooks(self, agent_id: str) -> List[Dict[str, Any]]:
        """List webhooks for an agent"""
        client = dialogflow.WebhooksClient(client_options=self.client_options)
        parent = f"{self._get_parent()}/agents/{agent_id}"

        webhooks = []
        for webhook in client.list_webhooks(parent=parent):
            webhooks.append({
                "name": webhook.name,
                "display_name": webhook.display_name,
                "timeout": webhook.timeout.seconds if webhook.timeout else 0,
                "disabled": webhook.disabled,
            })
        return webhooks

    # ==================== PAGES ====================

    def list_pages(self, agent_id: str, flow_id: str) -> List[Dict[str, Any]]:
        """List pages for a flow"""
        client = dialogflow.PagesClient(client_options=self.client_options)
        parent = f"{self._get_parent()}/agents/{agent_id}/flows/{flow_id}"

        pages = []
        for page in client.list_pages(parent=parent):
            pages.append({
                "name": page.name,
                "display_name": page.display_name,
                "entry_fulfillment": bool(page.entry_fulfillment),
                "form": bool(page.form),
                "transition_route_groups": list(page.transition_route_groups) if page.transition_route_groups else [],
            })
        return pages
