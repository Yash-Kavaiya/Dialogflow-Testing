import React, { useState, useEffect } from 'react';
import {
  Workflow, Shield, CheckCircle, AlertTriangle, XCircle, Loader2, RefreshCw, Settings, Play
} from 'lucide-react';
import { listFlows, validateFlow, trainFlow, DialogflowConfig, Flow } from '../services/dialogflowService';

interface FlowValidationProps {
  isDarkMode?: boolean;
}

interface ValidationResult {
  name: string;
  validation_messages: Array<{
    severity?: string;
    detail?: string;
    resource_type?: string;
    resources?: string[];
  }>;
}

const FlowValidation: React.FC<FlowValidationProps> = ({ isDarkMode = false }) => {
  const [config, setConfig] = useState<DialogflowConfig>({
    projectId: '',
    agentId: '',
    location: 'global',
  });
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState<string | null>(null);
  const [training, setTraining] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({});

  const loadFlows = async () => {
    if (!config.projectId || !config.agentId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await listFlows(config);
      setFlows(data.flows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load flows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (configured && config.projectId && config.agentId) {
      loadFlows();
    }
  }, [configured, config.projectId, config.agentId]);

  const handleValidate = async (flowName: string) => {
    const flowId = flowName.split('/').pop() || '';
    setValidating(flowId);

    try {
      const result = await validateFlow(config, flowId) as ValidationResult;
      setValidationResults((prev) => ({ ...prev, [flowId]: result }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate flow');
    } finally {
      setValidating(null);
    }
  };

  const handleTrain = async (flowName: string) => {
    const flowId = flowName.split('/').pop() || '';
    setTraining(flowId);

    try {
      await trainFlow(config, flowId);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to train flow');
    } finally {
      setTraining(null);
    }
  };

  const validateAll = async () => {
    setLoading(true);
    for (const flow of flows) {
      await handleValidate(flow.name);
    }
    setLoading(false);
  };

  if (!configured) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-google-lg p-8`}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-gradient-to-br from-google-teal-500 to-google-green-600 p-3 rounded-xl">
                <Workflow className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Flow Validation
                </h1>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Validate and train your conversation flows
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Project ID
                </label>
                <input
                  type="text"
                  value={config.projectId}
                  onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  } focus:ring-2 focus:ring-google-teal-500 focus:border-transparent`}
                  placeholder="your-gcp-project-id"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Agent ID
                </label>
                <input
                  type="text"
                  value={config.agentId}
                  onChange={(e) => setConfig({ ...config, agentId: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  } focus:ring-2 focus:ring-google-teal-500 focus:border-transparent`}
                  placeholder="agent-uuid"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Location
                </label>
                <select
                  value={config.location}
                  onChange={(e) => setConfig({ ...config, location: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  } focus:ring-2 focus:ring-google-teal-500 focus:border-transparent`}
                >
                  <option value="global">Global</option>
                  <option value="us-central1">US Central</option>
                  <option value="europe-west1">Europe West 1</option>
                  <option value="asia-northeast1">Asia Northeast 1</option>
                </select>
              </div>

              <button
                onClick={() => setConfigured(true)}
                disabled={!config.projectId || !config.agentId}
                className="w-full py-3 px-6 bg-gradient-to-r from-google-teal-500 to-google-green-600 text-white font-medium rounded-lg hover:from-google-teal-600 hover:to-google-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-google"
              >
                Load Flows
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Flow Validation
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {flows.length} flows found
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={validateAll}
              disabled={loading || flows.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-google-teal-500 text-white rounded-lg hover:bg-google-teal-600 disabled:opacity-50 transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Validate All</span>
            </button>
            <button
              onClick={loadFlows}
              disabled={loading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              } transition-colors`}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setConfigured(false)}
              className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              } transition-colors`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-google-red-100 border border-google-red-300 rounded-lg text-google-red-700">
            {error}
          </div>
        )}

        {loading && !flows.length ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-google-teal-500" />
            <span className={`ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading flows...</span>
          </div>
        ) : flows.length === 0 ? (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-google p-12 text-center`}>
            <Workflow className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No flows found
            </h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Create flows in the Dialogflow CX console.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {flows.map((flow) => {
              const flowId = flow.name.split('/').pop() || '';
              const validation = validationResults[flowId];
              const hasErrors = validation?.validation_messages?.some(m => m.severity === 'ERROR');
              const hasWarnings = validation?.validation_messages?.some(m => m.severity === 'WARNING');

              return (
                <div
                  key={flow.name}
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-google overflow-hidden`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl ${
                          validation
                            ? hasErrors
                              ? 'bg-google-red-100'
                              : hasWarnings
                              ? 'bg-google-yellow-100'
                              : 'bg-google-green-100'
                            : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <Workflow className={`w-6 h-6 ${
                            validation
                              ? hasErrors
                                ? 'text-google-red-600'
                                : hasWarnings
                                ? 'text-google-yellow-600'
                                : 'text-google-green-600'
                              : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                        </div>
                        <div>
                          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {flow.display_name}
                          </h3>
                          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {flow.description || 'No description'}
                          </p>
                          {flow.nlu_settings && (
                            <div className="flex items-center space-x-4 mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                              }`}>
                                Model: {flow.nlu_settings.model_type}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                              }`}>
                                Threshold: {flow.nlu_settings.classification_threshold}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleValidate(flow.name)}
                          disabled={validating === flowId}
                          className="flex items-center space-x-2 px-4 py-2 bg-google-blue-500 text-white rounded-lg hover:bg-google-blue-600 disabled:opacity-50 transition-colors"
                        >
                          {validating === flowId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Shield className="w-4 h-4" />
                          )}
                          <span>Validate</span>
                        </button>
                        <button
                          onClick={() => handleTrain(flow.name)}
                          disabled={training === flowId}
                          className="flex items-center space-x-2 px-4 py-2 bg-google-green-500 text-white rounded-lg hover:bg-google-green-600 disabled:opacity-50 transition-colors"
                        >
                          {training === flowId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                          <span>Train</span>
                        </button>
                      </div>
                    </div>

                    {validation && (
                      <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        {!validation.validation_messages || validation.validation_messages.length === 0 ? (
                          <div className="flex items-center space-x-2 text-google-green-500">
                            <CheckCircle className="w-5 h-5" />
                            <span>Flow validation passed - no issues found</span>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center space-x-4 mb-3">
                              {hasErrors && (
                                <div className="flex items-center space-x-1 text-google-red-500">
                                  <XCircle className="w-4 h-4" />
                                  <span className="text-sm">
                                    {validation.validation_messages.filter(m => m.severity === 'ERROR').length} errors
                                  </span>
                                </div>
                              )}
                              {hasWarnings && (
                                <div className="flex items-center space-x-1 text-google-yellow-500">
                                  <AlertTriangle className="w-4 h-4" />
                                  <span className="text-sm">
                                    {validation.validation_messages.filter(m => m.severity === 'WARNING').length} warnings
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {validation.validation_messages.map((msg, idx) => (
                                <div
                                  key={idx}
                                  className={`p-3 rounded-lg text-sm ${
                                    msg.severity === 'ERROR'
                                      ? 'bg-google-red-50 border border-google-red-200'
                                      : 'bg-google-yellow-50 border border-google-yellow-200'
                                  }`}
                                >
                                  <div className="flex items-start space-x-2">
                                    {msg.severity === 'ERROR' ? (
                                      <XCircle className="w-4 h-4 text-google-red-500 mt-0.5 flex-shrink-0" />
                                    ) : (
                                      <AlertTriangle className="w-4 h-4 text-google-yellow-500 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div>
                                      <span className={`font-medium ${
                                        msg.severity === 'ERROR' ? 'text-google-red-700' : 'text-google-yellow-700'
                                      }`}>
                                        {msg.severity}
                                      </span>
                                      {msg.resource_type && (
                                        <span className="text-gray-500 ml-2">({msg.resource_type})</span>
                                      )}
                                      <p className="text-gray-700 mt-1">{msg.detail || 'No details available'}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowValidation;
