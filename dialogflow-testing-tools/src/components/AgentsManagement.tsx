import React, { useState, useEffect } from 'react';
import {
  Bot, Shield, CheckCircle, AlertTriangle, Loader2, RefreshCw, Globe, Clock
} from 'lucide-react';
import { listAgents, validateAgent, DialogflowConfig, Agent } from '../services/dialogflowService';

interface AgentsManagementProps {
  isDarkMode?: boolean;
}

const AgentsManagement: React.FC<AgentsManagementProps> = ({ isDarkMode = false }) => {
  const [config, setConfig] = useState<DialogflowConfig>({
    projectId: '',
    agentId: '',
    location: 'global',
  });
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);
  const [validationResults, setValidationResults] = useState<Record<string, unknown>>({});

  const loadAgents = async () => {
    if (!config.projectId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await listAgents(config);
      setAgents(data.agents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (configured && config.projectId) {
      loadAgents();
    }
  }, [configured, config.projectId, config.location]);

  const handleValidate = async (agentName: string) => {
    const agentId = agentName.split('/').pop() || '';
    setValidating(agentId);

    try {
      const result = await validateAgent({ ...config, agentId });
      setValidationResults((prev) => ({ ...prev, [agentId]: result }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate agent');
    } finally {
      setValidating(null);
    }
  };

  if (!configured) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-google-lg p-8`}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-gradient-to-br from-google-blue-500 to-google-blue-600 p-3 rounded-xl">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Agent Management
                </h1>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  View and manage your Dialogflow CX agents
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
                  } focus:ring-2 focus:ring-google-blue-500 focus:border-transparent`}
                  placeholder="your-gcp-project-id"
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
                  } focus:ring-2 focus:ring-google-blue-500 focus:border-transparent`}
                >
                  <option value="global">Global</option>
                  <option value="us-central1">US Central</option>
                  <option value="us-east1">US East</option>
                  <option value="europe-west1">Europe West 1</option>
                  <option value="europe-west2">Europe West 2</option>
                  <option value="asia-northeast1">Asia Northeast 1</option>
                  <option value="asia-southeast1">Asia Southeast 1</option>
                </select>
              </div>

              <button
                onClick={() => setConfigured(true)}
                disabled={!config.projectId}
                className="w-full py-3 px-6 bg-gradient-to-r from-google-blue-500 to-google-blue-600 text-white font-medium rounded-lg hover:from-google-blue-600 hover:to-google-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-google"
              >
                Load Agents
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
              Agents
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {agents.length} agents in {config.location}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={loadAgents}
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
              className={`px-4 py-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              } transition-colors`}
            >
              Change Project
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-google-red-100 border border-google-red-300 rounded-lg text-google-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-google-blue-500" />
            <span className={`ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading agents...</span>
          </div>
        ) : agents.length === 0 ? (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-google p-12 text-center`}>
            <Bot className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No agents found
            </h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Create an agent in the Dialogflow CX console to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {agents.map((agent) => {
              const agentId = agent.name.split('/').pop() || '';
              const validation = validationResults[agentId] as { validation_messages?: unknown[] } | undefined;

              return (
                <div
                  key={agent.name}
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-google p-6`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-br from-google-blue-500 to-google-blue-600 p-3 rounded-xl">
                        <Bot className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {agent.display_name}
                        </h3>
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {agent.description || 'No description'}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-4">
                          <div className="flex items-center space-x-2">
                            <Globe className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {agent.default_language_code}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {agent.time_zone}
                            </span>
                          </div>
                          {agent.enable_spell_correction && (
                            <span className="px-2 py-1 text-xs rounded-full bg-google-green-100 text-google-green-700">
                              Spell Correction
                            </span>
                          )}
                          {agent.enable_stackdriver_logging && (
                            <span className="px-2 py-1 text-xs rounded-full bg-google-blue-100 text-google-blue-700">
                              Logging Enabled
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleValidate(agent.name)}
                      disabled={validating === agentId}
                      className="flex items-center space-x-2 px-4 py-2 bg-google-blue-500 text-white rounded-lg hover:bg-google-blue-600 disabled:opacity-50 transition-colors"
                    >
                      {validating === agentId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Shield className="w-4 h-4" />
                      )}
                      <span>Validate</span>
                    </button>
                  </div>

                  {validation && (
                    <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      {!validation.validation_messages || validation.validation_messages.length === 0 ? (
                        <div className="flex items-center space-x-2 text-google-green-500">
                          <CheckCircle className="w-5 h-5" />
                          <span>Agent validation passed - no issues found</span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center space-x-2 text-google-yellow-500 mb-3">
                            <AlertTriangle className="w-5 h-5" />
                            <span>{validation.validation_messages.length} validation issue(s) found</span>
                          </div>
                          <div className="space-y-2">
                            {validation.validation_messages.slice(0, 5).map((msg: unknown, idx: number) => {
                              const message = msg as { severity?: string; detail?: string };
                              return (
                                <div
                                  key={idx}
                                  className={`p-3 rounded-lg text-sm ${
                                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                  }`}
                                >
                                  <span className={`font-medium ${
                                    message.severity === 'ERROR' ? 'text-google-red-500' : 'text-google-yellow-500'
                                  }`}>
                                    {message.severity || 'WARNING'}:
                                  </span>{' '}
                                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                    {message.detail || 'No details available'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Agent ID: {agentId}
                    </p>
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

export default AgentsManagement;
