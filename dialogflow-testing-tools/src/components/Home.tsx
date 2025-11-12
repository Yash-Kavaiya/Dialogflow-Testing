import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { testDialogflowCX, testDialogflowES } from '../services/dialogflowService';
import { TestTube, Zap, CheckCircle2, XCircle, Sparkles, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const [dialogflowType, setDialogflowType] = useState('CX');
  const [projectId, setProjectId] = useState('');
  const [agentId, setAgentId] = useState('');
  const [location, setLocation] = useState('');
  const [testText, setTestText] = useState('');
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const config = { projectId, agentId, location };
    let result;
    try {
      if (dialogflowType === 'CX') {
        result = await testDialogflowCX(config, testText);
      } else {
        result = await testDialogflowES(config, testText);
      }
      setTestResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setTestResult(JSON.stringify({ error: 'Failed to test agent' }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-google-blue-50 via-white to-google-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-google-blue-500 to-google-teal-500 rounded-2xl mb-4 shadow-google-lg">
            <TestTube className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-google-blue-600 to-google-teal-600 bg-clip-text text-transparent dark:from-google-blue-400 dark:to-google-teal-400">
            Quick Test Your Agent
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Test your Dialogflow agent instantly with our simple interface. Perfect for quick validations and debugging.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Type Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-google-lg p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select Agent Type
            </label>
            <div className="flex gap-3">
              <button
                className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  dialogflowType === 'CX'
                    ? 'bg-gradient-to-r from-google-blue-500 to-google-blue-600 text-white shadow-google'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setDialogflowType('CX')}
              >
                <div className="flex items-center justify-center space-x-2">
                  {dialogflowType === 'CX' && <CheckCircle2 className="w-5 h-5" />}
                  <span>Dialogflow CX</span>
                </div>
              </button>
              <button
                className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  dialogflowType === 'ES'
                    ? 'bg-gradient-to-r from-google-teal-500 to-google-teal-600 text-white shadow-google'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setDialogflowType('ES')}
              >
                <div className="flex items-center justify-center space-x-2">
                  {dialogflowType === 'ES' && <CheckCircle2 className="w-5 h-5" />}
                  <span>Dialogflow ES</span>
                </div>
              </button>
            </div>
          </div>

          {/* Test Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-google-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project ID *
                  </label>
                  <input
                    type="text"
                    placeholder="your-project-id"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-google-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Agent ID *
                  </label>
                  <input
                    type="text"
                    placeholder="your-agent-id"
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-google-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    required
                  />
                </div>
              </div>

              {dialogflowType === 'CX' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., global, us-central1"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-google-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Test Message *
                </label>
                <textarea
                  placeholder="Enter your test message..."
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-google-blue-500 dark:bg-gray-700 dark:text-white transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-4 bg-gradient-to-r from-google-blue-500 to-google-teal-500 hover:from-google-blue-600 hover:to-google-teal-600 text-white font-semibold rounded-xl shadow-google-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Run Test</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-google-lg p-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-google-green-500 to-google-green-600 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Test Result</h3>
              </div>
              <pre className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl overflow-x-auto text-sm border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                {testResult}
              </pre>
            </div>
          )}

          {/* CTA Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Link
              to="/live-testing"
              className="group bg-gradient-to-br from-magenta-500 to-google-purple-600 rounded-2xl shadow-google-lg p-6 hover:shadow-xl transition-all transform hover:scale-105"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-6 h-6 text-white" />
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white">
                      NEW
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Live Testing Agent</h3>
                  <p className="text-magenta-100 text-sm">
                    Have real-time conversations with your agent and see detailed analytics
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/csv-testing"
              className="group bg-gradient-to-br from-google-blue-500 to-google-teal-500 rounded-2xl shadow-google-lg p-6 hover:shadow-xl transition-all transform hover:scale-105"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <TestTube className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Bulk CSV Testing</h3>
                  <p className="text-google-blue-100 text-sm">
                    Upload CSV files and test hundreds of conversations automatically
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;