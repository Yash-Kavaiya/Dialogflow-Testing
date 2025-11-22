const API_BASE_URL = 'http://localhost:5000/api';

export interface DialogflowConfig {
  projectId: string;
  agentId: string;
  location?: string;
  environmentId?: string;
}

export interface Agent {
  name: string;
  display_name: string;
  default_language_code: string;
  time_zone: string;
  description: string;
  avatar_uri: string;
  start_flow: string;
  enable_stackdriver_logging: boolean;
  enable_spell_correction: boolean;
}

export interface Environment {
  name: string;
  display_name: string;
  description: string;
  update_time: string | null;
  version_configs: Array<{ version: string; flow: string }>;
}

export interface Flow {
  name: string;
  display_name: string;
  description: string;
  nlu_settings: {
    model_type: string;
    classification_threshold: number;
  } | null;
}

export interface TestCase {
  name: string;
  display_name: string;
  tags: string[];
  notes: string;
  creation_time: string | null;
  last_test_result: {
    name: string;
    test_result: string;
    test_time: string | null;
  } | null;
}

export interface Intent {
  name: string;
  display_name: string;
  description: string;
  priority: number;
  is_fallback: boolean;
  labels: Record<string, string>;
}

export interface ContinuousTestResult {
  name: string;
  result: string;
  run_time: string | null;
  test_case_results: string[];
}

export interface TestCoverage {
  agent: string;
  coverage_type: string;
  intent_coverage?: {
    coverage_score: number;
    intents: Array<{ intent: string; covered: boolean }>;
  };
  transition_coverage?: {
    coverage_score: number;
  };
  route_group_coverage?: {
    coverage_score: number;
  };
}

export interface DetectIntentResult {
  text: string;
  language_code: string;
  intent: {
    name: string;
    display_name: string;
  };
  intent_detection_confidence: number;
  response_messages: string[];
  parameters: Record<string, unknown>;
  current_page: {
    name: string;
    display_name: string;
  };
  response_time: number;
  session_id: string;
}

// Helper function to build query params
const buildQueryParams = (config: DialogflowConfig): string => {
  const params = new URLSearchParams();
  if (config.projectId) params.append('project_id', config.projectId);
  if (config.location) params.append('location', config.location);
  return params.toString();
};

// ==================== AGENTS ====================

export const listAgents = async (config: DialogflowConfig): Promise<{ agents: Agent[]; count: number }> => {
  const response = await fetch(`${API_BASE_URL}/agents?${buildQueryParams(config)}`);
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const getAgent = async (config: DialogflowConfig): Promise<Agent> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}?${buildQueryParams(config)}`);
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const validateAgent = async (config: DialogflowConfig): Promise<unknown> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/validate?${buildQueryParams(config)}`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const getAgentValidationResult = async (config: DialogflowConfig): Promise<unknown> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/validation-result?${buildQueryParams(config)}`);
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

// ==================== ENVIRONMENTS ====================

export const listEnvironments = async (config: DialogflowConfig): Promise<{ environments: Environment[]; count: number }> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/environments?${buildQueryParams(config)}`);
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const getEnvironment = async (config: DialogflowConfig, environmentId: string): Promise<Environment> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/environments/${environmentId}?${buildQueryParams(config)}`);
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const runContinuousTest = async (config: DialogflowConfig, environmentId: string): Promise<unknown> => {
  const response = await fetch(
    `${API_BASE_URL}/agents/${config.agentId}/environments/${environmentId}/run-continuous-test?${buildQueryParams(config)}`,
    { method: 'POST' }
  );
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const listContinuousTestResults = async (
  config: DialogflowConfig,
  environmentId: string
): Promise<{ results: ContinuousTestResult[]; count: number }> => {
  const response = await fetch(
    `${API_BASE_URL}/agents/${config.agentId}/environments/${environmentId}/continuous-test-results?${buildQueryParams(config)}`
  );
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const listDeployments = async (
  config: DialogflowConfig,
  environmentId: string
): Promise<{ deployments: unknown[]; count: number }> => {
  const response = await fetch(
    `${API_BASE_URL}/agents/${config.agentId}/environments/${environmentId}/deployments?${buildQueryParams(config)}`
  );
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

// ==================== FLOWS ====================

export const listFlows = async (config: DialogflowConfig): Promise<{ flows: Flow[]; count: number }> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/flows?${buildQueryParams(config)}`);
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const validateFlow = async (config: DialogflowConfig, flowId: string): Promise<unknown> => {
  const response = await fetch(
    `${API_BASE_URL}/agents/${config.agentId}/flows/${flowId}/validate?${buildQueryParams(config)}`,
    { method: 'POST' }
  );
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const getFlowValidationResult = async (config: DialogflowConfig, flowId: string): Promise<unknown> => {
  const response = await fetch(
    `${API_BASE_URL}/agents/${config.agentId}/flows/${flowId}/validation-result?${buildQueryParams(config)}`
  );
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const trainFlow = async (config: DialogflowConfig, flowId: string): Promise<unknown> => {
  const response = await fetch(
    `${API_BASE_URL}/agents/${config.agentId}/flows/${flowId}/train?${buildQueryParams(config)}`,
    { method: 'POST' }
  );
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const listPages = async (config: DialogflowConfig, flowId: string): Promise<{ pages: unknown[]; count: number }> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/flows/${flowId}/pages?${buildQueryParams(config)}`);
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

// ==================== TEST CASES ====================

export const listTestCases = async (config: DialogflowConfig): Promise<{ test_cases: TestCase[]; count: number }> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/test-cases?${buildQueryParams(config)}`);
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const getTestCase = async (config: DialogflowConfig, testCaseId: string): Promise<TestCase> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/test-cases/${testCaseId}?${buildQueryParams(config)}`);
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const createTestCase = async (
  config: DialogflowConfig,
  data: { display_name: string; tags?: string[]; notes?: string; test_conversation?: unknown[] }
): Promise<TestCase> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/test-cases?${buildQueryParams(config)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const deleteTestCase = async (config: DialogflowConfig, testCaseId: string): Promise<unknown> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/test-cases/${testCaseId}?${buildQueryParams(config)}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const batchDeleteTestCases = async (config: DialogflowConfig, testCaseIds: string[]): Promise<unknown> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/test-cases:batch-delete?${buildQueryParams(config)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ test_case_ids: testCaseIds }),
  });
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const runTestCase = async (
  config: DialogflowConfig,
  testCaseId: string,
  environmentId?: string
): Promise<unknown> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/test-cases/${testCaseId}/run?${buildQueryParams(config)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ environment_id: environmentId }),
  });
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const batchRunTestCases = async (
  config: DialogflowConfig,
  testCaseIds: string[],
  environmentId?: string
): Promise<unknown> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/test-cases:batch-run?${buildQueryParams(config)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ test_case_ids: testCaseIds, environment_id: environmentId }),
  });
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const listTestCaseResults = async (
  config: DialogflowConfig,
  testCaseId: string
): Promise<{ results: unknown[]; count: number }> => {
  const response = await fetch(
    `${API_BASE_URL}/agents/${config.agentId}/test-cases/${testCaseId}/results?${buildQueryParams(config)}`
  );
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const calculateTestCoverage = async (
  config: DialogflowConfig,
  coverageType: string = 'INTENT'
): Promise<TestCoverage> => {
  const params = buildQueryParams(config) + `&type=${coverageType}`;
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/test-coverage?${params}`);
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

// ==================== INTENTS ====================

export const listIntents = async (config: DialogflowConfig): Promise<{ intents: Intent[]; count: number }> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/intents?${buildQueryParams(config)}`);
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const getIntent = async (config: DialogflowConfig, intentId: string): Promise<Intent> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/intents/${intentId}?${buildQueryParams(config)}`);
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

// ==================== DETECT INTENT ====================

export const detectIntent = async (
  config: DialogflowConfig,
  text: string,
  sessionId?: string,
  languageCode: string = 'en'
): Promise<DetectIntentResult> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/detect-intent?${buildQueryParams(config)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      session_id: sessionId,
      language_code: languageCode,
      environment_id: config.environmentId,
    }),
  });
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

export const matchIntent = async (
  config: DialogflowConfig,
  text: string,
  sessionId?: string,
  languageCode: string = 'en'
): Promise<unknown> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/match-intent?${buildQueryParams(config)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, session_id: sessionId, language_code: languageCode }),
  });
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

// ==================== CHANGELOGS ====================

export const listChangelogs = async (config: DialogflowConfig): Promise<{ changelogs: unknown[]; count: number }> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/changelogs?${buildQueryParams(config)}`);
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

// ==================== WEBHOOKS ====================

export const listWebhooks = async (config: DialogflowConfig): Promise<{ webhooks: unknown[]; count: number }> => {
  const response = await fetch(`${API_BASE_URL}/agents/${config.agentId}/webhooks?${buildQueryParams(config)}`);
  if (!response.ok) throw new Error((await response.json()).error);
  return response.json();
};

// ==================== LEGACY (Dialogflow ES Mock) ====================

export const testDialogflowCX = async (config: DialogflowConfig, text: string) => {
  return detectIntent(config, text);
};

export const testDialogflowES = async (config: DialogflowConfig, text: string) => {
  console.log('Testing Dialogflow ES:', config, text);
  return { response: "Dialogflow ES not supported in this version" };
};
