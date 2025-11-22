import React, { useState, useEffect } from 'react';
import {
  TestTube, Play, Trash2, Plus, CheckCircle, XCircle, Clock,
  Loader2, RefreshCw, Settings, PlayCircle, ChevronDown, ChevronRight
} from 'lucide-react';
import {
  listTestCases, runTestCase, batchRunTestCases, deleteTestCase, createTestCase,
  DialogflowConfig, TestCase
} from '../services/dialogflowService';

interface TestCasesManagementProps {
  isDarkMode?: boolean;
}

const TestCasesManagement: React.FC<TestCasesManagementProps> = ({ isDarkMode = false }) => {
  const [config, setConfig] = useState<DialogflowConfig>({
    projectId: '',
    agentId: '',
    location: 'global',
  });
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);
  const [newTestCase, setNewTestCase] = useState({ display_name: '', tags: '', notes: '' });

  const loadTestCases = async () => {
    if (!config.projectId || !config.agentId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await listTestCases(config);
      setTestCases(data.test_cases);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load test cases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (configured && config.projectId && config.agentId) {
      loadTestCases();
    }
  }, [configured, config.projectId, config.agentId]);

  const handleRunTest = async (testCaseId: string) => {
    setRunning(testCaseId);
    try {
      await runTestCase(config, testCaseId);
      await loadTestCases();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run test');
    } finally {
      setRunning(null);
    }
  };

  const handleBatchRun = async () => {
    if (selectedTests.length === 0) return;

    setLoading(true);
    try {
      await batchRunTestCases(config, selectedTests);
      await loadTestCases();
      setSelectedTests([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run tests');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (testCaseId: string) => {
    if (!window.confirm('Are you sure you want to delete this test case?')) return;

    try {
      await deleteTestCase(config, testCaseId);
      await loadTestCases();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete test case');
    }
  };

  const handleCreateTestCase = async () => {
    try {
      await createTestCase(config, {
        display_name: newTestCase.display_name,
        tags: newTestCase.tags ? newTestCase.tags.split(',').map(t => t.trim()) : [],
        notes: newTestCase.notes,
      });
      setShowCreateModal(false);
      setNewTestCase({ display_name: '', tags: '', notes: '' });
      await loadTestCases();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create test case');
    }
  };

  const toggleSelectAll = () => {
    if (selectedTests.length === testCases.length) {
      setSelectedTests([]);
    } else {
      setSelectedTests(testCases.map(tc => tc.name.split('/').pop() || ''));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedTests(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const getStatusIcon = (result?: string | null) => {
    if (!result) return <Clock className="w-5 h-5 text-gray-400" />;
    if (result === 'PASSED') return <CheckCircle className="w-5 h-5 text-google-green-500" />;
    if (result === 'FAILED') return <XCircle className="w-5 h-5 text-google-red-500" />;
    return <Clock className="w-5 h-5 text-google-yellow-500" />;
  };

  if (!configured) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-google-lg p-8`}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-gradient-to-br from-google-purple-500 to-magenta-600 p-3 rounded-xl">
                <TestTube className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Test Cases Management
                </h1>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Configure your Dialogflow CX agent
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
                  } focus:ring-2 focus:ring-google-purple-500 focus:border-transparent`}
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
                  } focus:ring-2 focus:ring-google-purple-500 focus:border-transparent`}
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
                  } focus:ring-2 focus:ring-google-purple-500 focus:border-transparent`}
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
                className="w-full py-3 px-6 bg-gradient-to-r from-google-purple-500 to-magenta-600 text-white font-medium rounded-lg hover:from-google-purple-600 hover:to-magenta-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-google"
              >
                Load Test Cases
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Test Cases
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {testCases.length} test cases found
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-google-purple-500 text-white rounded-lg hover:bg-google-purple-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Test</span>
            </button>
            <button
              onClick={handleBatchRun}
              disabled={selectedTests.length === 0 || loading}
              className="flex items-center space-x-2 px-4 py-2 bg-google-green-500 text-white rounded-lg hover:bg-google-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Run Selected ({selectedTests.length})</span>
            </button>
            <button
              onClick={loadTestCases}
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

        {loading && !testCases.length ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-google-purple-500" />
            <span className={`ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading test cases...</span>
          </div>
        ) : (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-google overflow-hidden`}>
            {/* Table Header */}
            <div className={`flex items-center px-6 py-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
              <input
                type="checkbox"
                checked={selectedTests.length === testCases.length && testCases.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-google-purple-600 focus:ring-google-purple-500"
              />
              <span className={`ml-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Select All
              </span>
            </div>

            {/* Test Cases List */}
            {testCases.length === 0 ? (
              <div className="p-8 text-center">
                <TestTube className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No test cases found</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 text-google-purple-500 hover:text-google-purple-600 font-medium"
                >
                  Create your first test case
                </button>
              </div>
            ) : (
              <div className="divide-y dark:divide-gray-700">
                {testCases.map((tc) => {
                  const id = tc.name.split('/').pop() || '';
                  const isExpanded = expandedTest === id;

                  return (
                    <div key={tc.name} className={`${isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`}>
                      <div className="flex items-center px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedTests.includes(id)}
                          onChange={() => toggleSelect(id)}
                          className="w-4 h-4 rounded border-gray-300 text-google-purple-600 focus:ring-google-purple-500"
                        />
                        <button
                          onClick={() => setExpandedTest(isExpanded ? null : id)}
                          className="ml-3 p-1"
                        >
                          {isExpanded ? (
                            <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          ) : (
                            <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          )}
                        </button>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(tc.last_test_result?.test_result)}
                            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {tc.display_name}
                            </span>
                            {tc.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`px-2 py-0.5 text-xs rounded-full ${
                                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          {tc.notes && (
                            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {tc.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleRunTest(id)}
                            disabled={running === id}
                            className="p-2 text-google-green-500 hover:bg-google-green-50 dark:hover:bg-google-green-900/20 rounded-lg transition-colors"
                            title="Run test"
                          >
                            {running === id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Play className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(id)}
                            className="p-2 text-google-red-500 hover:bg-google-red-50 dark:hover:bg-google-red-900/20 rounded-lg transition-colors"
                            title="Delete test"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className={`px-6 pb-4 ml-12 ${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Created: </span>
                              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                {tc.creation_time ? new Date(tc.creation_time).toLocaleString() : 'Unknown'}
                              </span>
                            </div>
                            {tc.last_test_result && (
                              <>
                                <div>
                                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Last Run: </span>
                                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                    {tc.last_test_result.test_time
                                      ? new Date(tc.last_test_result.test_time).toLocaleString()
                                      : 'N/A'}
                                  </span>
                                </div>
                                <div>
                                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Result: </span>
                                  <span className={
                                    tc.last_test_result.test_result === 'PASSED'
                                      ? 'text-google-green-500'
                                      : 'text-google-red-500'
                                  }>
                                    {tc.last_test_result.test_result}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 w-full max-w-md`}>
              <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Create Test Case
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={newTestCase.display_name}
                    onChange={(e) => setNewTestCase({ ...newTestCase, display_name: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                    placeholder="Test case name"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newTestCase.tags}
                    onChange={(e) => setNewTestCase({ ...newTestCase, tags: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                    placeholder="regression, smoke, etc."
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Notes
                  </label>
                  <textarea
                    value={newTestCase.notes}
                    onChange={(e) => setNewTestCase({ ...newTestCase, notes: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                    rows={3}
                    placeholder="Test case description..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTestCase}
                  disabled={!newTestCase.display_name}
                  className="px-4 py-2 bg-google-purple-500 text-white rounded-lg hover:bg-google-purple-600 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCasesManagement;
