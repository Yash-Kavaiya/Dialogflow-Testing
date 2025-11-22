import React, { useState, useEffect } from 'react';
import {
  TrendingUp, CheckCircle, XCircle, Loader2, RefreshCw, Settings, BarChart3, Target
} from 'lucide-react';
import { calculateTestCoverage, listIntents, DialogflowConfig, TestCoverage as TestCoverageType, Intent } from '../services/dialogflowService';

interface TestCoverageProps {
  isDarkMode?: boolean;
}

const TestCoverage: React.FC<TestCoverageProps> = ({ isDarkMode = false }) => {
  const [config, setConfig] = useState<DialogflowConfig>({
    projectId: '',
    agentId: '',
    location: 'global',
  });
  const [coverage, setCoverage] = useState<TestCoverageType | null>(null);
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);
  const [coverageType, setCoverageType] = useState<'INTENT' | 'PAGE_TRANSITION' | 'TRANSITION_ROUTE_GROUP'>('INTENT');

  const loadCoverage = async () => {
    if (!config.projectId || !config.agentId) return;

    setLoading(true);
    setError(null);

    try {
      const [coverageData, intentsData] = await Promise.all([
        calculateTestCoverage(config, coverageType),
        listIntents(config),
      ]);
      setCoverage(coverageData);
      setIntents(intentsData.intents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load coverage data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (configured && config.projectId && config.agentId) {
      loadCoverage();
    }
  }, [configured, config.projectId, config.agentId, coverageType]);

  const getCoverageScore = () => {
    if (!coverage) return 0;
    if (coverage.intent_coverage) return coverage.intent_coverage.coverage_score;
    if (coverage.transition_coverage) return coverage.transition_coverage.coverage_score;
    if (coverage.route_group_coverage) return coverage.route_group_coverage.coverage_score;
    return 0;
  };

  const getCoveragePercentage = () => Math.round(getCoverageScore() * 100);

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-google-green-500';
    if (score >= 0.5) return 'text-google-yellow-500';
    return 'text-google-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 0.8) return 'bg-google-green-500';
    if (score >= 0.5) return 'bg-google-yellow-500';
    return 'bg-google-red-500';
  };

  if (!configured) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-google-lg p-8`}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-gradient-to-br from-google-yellow-500 to-google-orange-600 p-3 rounded-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Test Coverage
                </h1>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Analyze your test coverage metrics
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
                  } focus:ring-2 focus:ring-google-yellow-500 focus:border-transparent`}
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
                  } focus:ring-2 focus:ring-google-yellow-500 focus:border-transparent`}
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
                  } focus:ring-2 focus:ring-google-yellow-500 focus:border-transparent`}
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
                className="w-full py-3 px-6 bg-gradient-to-r from-google-yellow-500 to-google-orange-600 text-white font-medium rounded-lg hover:from-google-yellow-600 hover:to-google-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-google"
              >
                Calculate Coverage
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
              Test Coverage
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Coverage analysis for your Dialogflow CX agent
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={coverageType}
              onChange={(e) => setCoverageType(e.target.value as typeof coverageType)}
              className={`px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <option value="INTENT">Intent Coverage</option>
              <option value="PAGE_TRANSITION">Page Transition</option>
              <option value="TRANSITION_ROUTE_GROUP">Route Group</option>
            </select>
            <button
              onClick={loadCoverage}
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
            <Loader2 className="w-8 h-8 animate-spin text-google-yellow-500" />
            <span className={`ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Calculating coverage...</span>
          </div>
        ) : (
          <>
            {/* Coverage Score Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-google p-6 lg:col-span-1`}>
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        className={isDarkMode ? 'text-gray-700' : 'text-gray-200'}
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="56"
                        cx="64"
                        cy="64"
                      />
                      <circle
                        className={getScoreColor(getCoverageScore())}
                        strokeWidth="8"
                        strokeDasharray={`${getCoveragePercentage() * 3.52} 352`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="56"
                        cx="64"
                        cy="64"
                      />
                    </svg>
                    <span className={`absolute text-3xl font-bold ${getScoreColor(getCoverageScore())}`}>
                      {getCoveragePercentage()}%
                    </span>
                  </div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Overall Coverage
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {coverageType.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-google p-6 lg:col-span-2`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Coverage Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-5 h-5 text-google-blue-500" />
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Total Intents
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-google-blue-500">
                      {intents.length}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-google-green-500" />
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Covered
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-google-green-500">
                      {coverage?.intent_coverage?.intents?.filter(i => i.covered).length || 0}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <XCircle className="w-5 h-5 text-google-red-500" />
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Uncovered
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-google-red-500">
                      {coverage?.intent_coverage?.intents?.filter(i => !i.covered).length || 0}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-google-purple-500" />
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Fallback Intents
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-google-purple-500">
                      {intents.filter(i => i.is_fallback).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Intent Coverage Details */}
            {coverage?.intent_coverage?.intents && (
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-google p-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Intent Coverage Details
                </h3>
                <div className="space-y-3">
                  {coverage.intent_coverage.intents.map((intentCov, idx) => {
                    const intent = intents.find(i => i.name === intentCov.intent);
                    const displayName = intent?.display_name || intentCov.intent.split('/').pop() || '';

                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {intentCov.covered ? (
                            <CheckCircle className="w-5 h-5 text-google-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-google-red-500" />
                          )}
                          <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                            {displayName}
                          </span>
                          {intent?.is_fallback && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-google-purple-100 text-google-purple-700">
                              Fallback
                            </span>
                          )}
                        </div>
                        <span className={`text-sm font-medium ${
                          intentCov.covered ? 'text-google-green-500' : 'text-google-red-500'
                        }`}>
                          {intentCov.covered ? 'Covered' : 'Not Covered'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Intents List */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-google p-6 mt-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                All Intents ({intents.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Intent Name
                      </th>
                      <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Priority
                      </th>
                      <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Type
                      </th>
                      <th className={`text-left py-3 px-4 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Coverage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {intents.map((intent) => {
                      const intentCov = coverage?.intent_coverage?.intents?.find(i => i.intent === intent.name);
                      return (
                        <tr
                          key={intent.name}
                          className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
                        >
                          <td className={`py-3 px-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {intent.display_name}
                          </td>
                          <td className={`py-3 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {intent.priority}
                          </td>
                          <td className="py-3 px-4">
                            {intent.is_fallback ? (
                              <span className="px-2 py-1 text-xs rounded-full bg-google-purple-100 text-google-purple-700">
                                Fallback
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs rounded-full bg-google-blue-100 text-google-blue-700">
                                Standard
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {intentCov ? (
                              intentCov.covered ? (
                                <span className="flex items-center space-x-1 text-google-green-500">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Covered</span>
                                </span>
                              ) : (
                                <span className="flex items-center space-x-1 text-google-red-500">
                                  <XCircle className="w-4 h-4" />
                                  <span>Not Covered</span>
                                </span>
                              )
                            ) : (
                              <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TestCoverage;
