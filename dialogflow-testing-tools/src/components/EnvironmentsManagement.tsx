import React, { useState, useEffect } from 'react';
import {
  GitBranch, Play, Clock, CheckCircle, XCircle, Loader2, RefreshCw, Settings, Rocket
} from 'lucide-react';
import {
  listEnvironments, runContinuousTest, listContinuousTestResults,
  DialogflowConfig, Environment, ContinuousTestResult
} from '../services/dialogflowService';

interface EnvironmentsManagementProps {
  isDarkMode?: boolean;
}

const EnvironmentsManagement: React.FC<EnvironmentsManagementProps> = ({ isDarkMode = false }) => {
  const [config, setConfig] = useState<DialogflowConfig>({
    projectId: '',
    agentId: '',
    location: 'global',
  });
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [testResults, setTestResults] = useState<Record<string, ContinuousTestResult[]>>({});
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState<string | null>(null);

  const loadEnvironments = async () => {
    if (!config.projectId || !config.agentId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await listEnvironments(config);
      setEnvironments(data.environments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load environments');
    } finally {
      setLoading(false);
    }
  };

  const loadTestResults = async (envId: string) => {
    try {
      const data = await listContinuousTestResults(config, envId);
      setTestResults((prev) => ({ ...prev, [envId]: data.results }));
    } catch (err) {
      console.error('Failed to load test results:', err);
    }
  };

  useEffect(() => {
    if (configured && config.projectId && config.agentId) {
      loadEnvironments();
    }
  }, [configured, config.projectId, config.agentId]);

  const handleRunContinuousTest = async (envId: string) => {
    setRunning(envId);
    try {
      await runContinuousTest(config, envId);
      await loadTestResults(envId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run continuous test');
    } finally {
      setRunning(null);
    }
  };

  const getEnvId = (name: string) => name.split('/').pop() || '';

  if (!configured) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-google-lg p-8`}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-gradient-to-br from-google-green-500 to-google-teal-600 p-3 rounded-xl">
                <GitBranch className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Environment Management
                </h1>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Manage environments and run continuous tests
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
                  } focus:ring-2 focus:ring-google-green-500 focus:border-transparent`}
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
                  } focus:ring-2 focus:ring-google-green-500 focus:border-transparent`}
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
                  } focus:ring-2 focus:ring-google-green-500 focus:border-transparent`}
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
                className="w-full py-3 px-6 bg-gradient-to-r from-google-green-500 to-google-teal-600 text-white font-medium rounded-lg hover:from-google-green-600 hover:to-google-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-google"
              >
                Load Environments
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
              Environments
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {environments.length} environments found
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={loadEnvironments}
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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-google-green-500" />
            <span className={`ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading environments...</span>
          </div>
        ) : environments.length === 0 ? (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-google p-12 text-center`}>
            <GitBranch className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No environments found
            </h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Create an environment in the Dialogflow CX console.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {environments.map((env) => {
              const envId = getEnvId(env.name);
              const results = testResults[envId] || [];

              return (
                <div
                  key={env.name}
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-google overflow-hidden`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-to-br from-google-green-500 to-google-teal-600 p-3 rounded-xl">
                          <GitBranch className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {env.display_name}
                          </h3>
                          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {env.description || 'No description'}
                          </p>
                          {env.update_time && (
                            <div className="flex items-center space-x-2 mt-2">
                              <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Updated: {new Date(env.update_time).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedEnv(selectedEnv === envId ? null : envId);
                            if (!testResults[envId]) {
                              loadTestResults(envId);
                            }
                          }}
                          className={`px-4 py-2 rounded-lg ${
                            isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          } transition-colors`}
                        >
                          {selectedEnv === envId ? 'Hide Results' : 'View Results'}
                        </button>
                        <button
                          onClick={() => handleRunContinuousTest(envId)}
                          disabled={running === envId}
                          className="flex items-center space-x-2 px-4 py-2 bg-google-green-500 text-white rounded-lg hover:bg-google-green-600 disabled:opacity-50 transition-colors"
                        >
                          {running === envId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Rocket className="w-4 h-4" />
                          )}
                          <span>Run Continuous Test</span>
                        </button>
                      </div>
                    </div>

                    {env.version_configs && env.version_configs.length > 0 && (
                      <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Version Configs
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {env.version_configs.map((vc, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1 text-sm rounded-full ${
                                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {vc.version ? vc.version.split('/').pop() : 'N/A'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedEnv === envId && (
                    <div className={`border-t ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'} p-6`}>
                      <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Continuous Test Results
                      </h4>
                      {results.length === 0 ? (
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          No test results available. Run a continuous test to see results.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {results.slice(0, 10).map((result, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center justify-between p-3 rounded-lg ${
                                isDarkMode ? 'bg-gray-800' : 'bg-white'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                {result.result === 'PASSED' ? (
                                  <CheckCircle className="w-5 h-5 text-google-green-500" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-google-red-500" />
                                )}
                                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                  {result.result}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {result.test_case_results?.length || 0} test cases
                                </span>
                                {result.run_time && (
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {new Date(result.run_time).toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnvironmentsManagement;
