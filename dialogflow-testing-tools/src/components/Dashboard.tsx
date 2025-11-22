import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot, TestTube, GitBranch, CheckCircle, XCircle, AlertTriangle,
  Activity, TrendingUp, Clock, Loader2, RefreshCw, Settings
} from 'lucide-react';
import {
  listAgents, listTestCases, listEnvironments, calculateTestCoverage,
  DialogflowConfig, Agent, TestCase, Environment, TestCoverage
} from '../services/dialogflowService';

interface DashboardProps {
  isDarkMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isDarkMode = false }) => {
  const [config, setConfig] = useState<DialogflowConfig>({
    projectId: '',
    agentId: '',
    location: 'global',
  });
  const [agents, setAgents] = useState<Agent[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [coverage, setCoverage] = useState<TestCoverage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);

  const loadDashboardData = async () => {
    if (!config.projectId) return;

    setLoading(true);
    setError(null);

    try {
      // Load agents
      const agentsData = await listAgents(config);
      setAgents(agentsData.agents);

      if (config.agentId) {
        // Load test cases
        const testCasesData = await listTestCases(config);
        setTestCases(testCasesData.test_cases);

        // Load environments
        const envsData = await listEnvironments(config);
        setEnvironments(envsData.environments);

        // Load coverage
        try {
          const coverageData = await calculateTestCoverage(config, 'INTENT');
          setCoverage(coverageData);
        } catch {
          setCoverage(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (configured && config.projectId) {
      loadDashboardData();
    }
  }, [configured, config.projectId, config.agentId]);

  const passedTests = testCases.filter(tc => tc.last_test_result?.test_result === 'PASSED').length;
  const failedTests = testCases.filter(tc => tc.last_test_result?.test_result === 'FAILED').length;

  if (!configured) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-google-lg p-8`}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-gradient-to-br from-google-blue-500 to-google-purple-600 p-3 rounded-xl">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Configure Dashboard
                </h1>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Enter your Dialogflow CX project details
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
                  <option value="us-west1">US West</option>
                  <option value="europe-west1">Europe West 1</option>
                  <option value="europe-west2">Europe West 2</option>
                  <option value="asia-northeast1">Asia Northeast 1</option>
                  <option value="asia-southeast1">Asia Southeast 1</option>
                  <option value="australia-southeast1">Australia Southeast 1</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Agent ID (optional)
                </label>
                <input
                  type="text"
                  value={config.agentId}
                  onChange={(e) => setConfig({ ...config, agentId: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  } focus:ring-2 focus:ring-google-blue-500 focus:border-transparent`}
                  placeholder="agent-uuid"
                />
              </div>

              <button
                onClick={() => setConfigured(true)}
                disabled={!config.projectId}
                className="w-full py-3 px-6 bg-gradient-to-r from-google-blue-500 to-google-blue-600 text-white font-medium rounded-lg hover:from-google-blue-600 hover:to-google-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-google"
              >
                Load Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Dialogflow CX Dashboard
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Project: {config.projectId} | Location: {config.location}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={loadDashboardData}
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
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              } transition-colors`}
            >
              <Settings className="w-4 h-4" />
              <span>Configure</span>
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
            <span className={`ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading dashboard...</span>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Agents */}
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-google p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-google-blue-100 dark:bg-google-blue-900/30 p-3 rounded-lg">
                    <Bot className="w-6 h-6 text-google-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-google-blue-600">{agents.length}</span>
                </div>
                <h3 className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Agents</h3>
                <Link to="/agents" className="text-sm text-google-blue-500 hover:underline">View all agents</Link>
              </div>

              {/* Test Cases */}
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-google p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-google-purple-100 dark:bg-google-purple-900/30 p-3 rounded-lg">
                    <TestTube className="w-6 h-6 text-google-purple-600" />
                  </div>
                  <span className="text-2xl font-bold text-google-purple-600">{testCases.length}</span>
                </div>
                <h3 className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Test Cases</h3>
                <Link to="/test-cases" className="text-sm text-google-purple-500 hover:underline">Manage test cases</Link>
              </div>

              {/* Environments */}
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-google p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-google-green-100 dark:bg-google-green-900/30 p-3 rounded-lg">
                    <GitBranch className="w-6 h-6 text-google-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-google-green-600">{environments.length}</span>
                </div>
                <h3 className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Environments</h3>
                <Link to="/environments" className="text-sm text-google-green-500 hover:underline">View environments</Link>
              </div>

              {/* Test Coverage */}
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-google p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-google-yellow-100 dark:bg-google-yellow-900/30 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-google-yellow-600" />
                  </div>
                  <span className="text-2xl font-bold text-google-yellow-600">
                    {coverage?.intent_coverage?.coverage_score
                      ? `${Math.round(coverage.intent_coverage.coverage_score * 100)}%`
                      : 'N/A'}
                  </span>
                </div>
                <h3 className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Intent Coverage</h3>
                <Link to="/test-coverage" className="text-sm text-google-yellow-500 hover:underline">View coverage</Link>
              </div>
            </div>

            {/* Test Results Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Test Status */}
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-google p-6`}>
                <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Test Results Overview
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-google-green-500" />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Passed</span>
                    </div>
                    <span className="font-semibold text-google-green-500">{passedTests}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <XCircle className="w-5 h-5 text-google-red-500" />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Failed</span>
                    </div>
                    <span className="font-semibold text-google-red-500">{failedTests}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-google-yellow-500" />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Not Run</span>
                    </div>
                    <span className="font-semibold text-google-yellow-500">
                      {testCases.length - passedTests - failedTests}
                    </span>
                  </div>
                </div>
                {testCases.length > 0 && (
                  <div className="mt-4 pt-4 border-t dark:border-gray-700">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-google-green-500 h-3 rounded-full"
                        style={{ width: `${(passedTests / testCases.length) * 100}%` }}
                      />
                    </div>
                    <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Pass Rate: {testCases.length > 0 ? Math.round((passedTests / testCases.length) * 100) : 0}%
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-google p-6`}>
                <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/live-testing"
                    className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-magenta-500 to-google-purple-600 text-white hover:opacity-90 transition-opacity"
                  >
                    <Activity className="w-5 h-5" />
                    <span className="font-medium">Live Testing</span>
                  </Link>
                  <Link
                    to="/test-cases"
                    className={`flex items-center space-x-3 p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <TestTube className="w-5 h-5 text-google-purple-500" />
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Run Tests</span>
                  </Link>
                  <Link
                    to="/flow-validation"
                    className={`flex items-center space-x-3 p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <CheckCircle className="w-5 h-5 text-google-green-500" />
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Validate</span>
                  </Link>
                  <Link
                    to="/csv-testing"
                    className={`flex items-center space-x-3 p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <Clock className="w-5 h-5 text-google-blue-500" />
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Bulk Test</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Agents */}
            {agents.length > 0 && (
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-google p-6`}>
                <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Available Agents
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Agent Name
                        </th>
                        <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Language
                        </th>
                        <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Timezone
                        </th>
                        <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {agents.slice(0, 5).map((agent) => (
                        <tr
                          key={agent.name}
                          className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
                        >
                          <td className={`py-3 px-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {agent.display_name}
                          </td>
                          <td className={`py-3 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {agent.default_language_code}
                          </td>
                          <td className={`py-3 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {agent.time_zone}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => {
                                const agentId = agent.name.split('/').pop() || '';
                                setConfig({ ...config, agentId });
                              }}
                              className="text-google-blue-500 hover:text-google-blue-600 font-medium text-sm"
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
