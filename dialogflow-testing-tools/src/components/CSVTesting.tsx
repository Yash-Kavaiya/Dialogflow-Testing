import React, { useState } from 'react';
import { Upload, Play, Download, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

interface TestCase {
  test_id: string;
  conversation: string[];
  expected_intent: string | null;
  language_code: string;
}

interface TestResult {
  test_id: string;
  expected_intent: string | null;
  passed: boolean;
  conversation_results: ConversationResult[];
}

interface ConversationResult {
  turn: number;
  user_input: string;
  intent: string;
  confidence: number;
  response_messages: string[];
  response_time: number;
  parameters: Record<string, any>;
  status: string;
  error?: string;
}

interface TestSummary {
  total_tests: number;
  passed: number;
  failed: number;
  pass_rate: number;
}

interface UploadResponse {
  message: string;
  filename: string;
  test_count: number;
  test_cases: TestCase[];
  config: {
    project_id: string;
    agent_id: string;
    location: string;
    environment_id: string;
  };
}

interface TestResults {
  summary: TestSummary;
  results: TestResult[];
  config: any;
  result_id: string;
}

const CSVTesting: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [projectId, setProjectId] = useState('');
  const [agentId, setAgentId] = useState('');
  const [location, setLocation] = useState('global');
  const [environmentId, setEnvironmentId] = useState('');
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please select a valid CSV file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !agentId) {
      setError('Please provide a CSV file and Agent ID');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('agent_id', agentId);
    formData.append('location', location);
    if (projectId) formData.append('project_id', projectId);
    if (environmentId) formData.append('environment_id', environmentId);

    try {
      const response = await fetch(`${API_BASE_URL}/upload-csv`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data: UploadResponse = await response.json();
      setUploadResponse(data);
      setTestResults(null); // Clear previous results
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRunTests = async () => {
    if (!uploadResponse) {
      setError('Please upload a CSV file first');
      return;
    }

    setIsRunning(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/run-tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: uploadResponse.filename,
          project_id: uploadResponse.config.project_id,
          agent_id: uploadResponse.config.agent_id,
          location: uploadResponse.config.location,
          environment_id: uploadResponse.config.environment_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Test execution failed');
      }

      const data: TestResults = await response.json();
      setTestResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleDownloadSample = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/download-sample-csv`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sample_template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download sample CSV');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-google-blue-50 via-white to-google-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-google-blue-500 to-google-green-500 rounded-2xl mb-4 shadow-google-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-google-blue-600 to-google-green-600 bg-clip-text text-transparent dark:from-google-blue-400 dark:to-google-green-400">
            CSV Bulk Test Runner
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
            Upload a CSV file with test conversations and run automated tests against your Dialogflow CX agent
          </p>
        </div>

        {/* Configuration Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-google-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project ID (Optional)
            </label>
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Will use default credentials if not provided"
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:border-google-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Agent ID *
            </label>
            <input
              type="text"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              placeholder="Enter your Dialogflow CX Agent ID"
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:border-google-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:border-google-blue-500 transition-colors"
            >
              <option value="global">Global</option>
              <option value="us-central1">US Central 1</option>
              <option value="us-east1">US East 1</option>
              <option value="europe-west1">Europe West 1</option>
              <option value="asia-northeast1">Asia Northeast 1</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Environment ID (Optional)
            </label>
            <input
              type="text"
              value={environmentId}
              onChange={(e) => setEnvironmentId(e.target.value)}
              placeholder="Leave empty for default environment"
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:border-google-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload CSV File *
          </label>
          <div className="flex items-center gap-4">
            <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed
                            border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer
                            hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
              <Upload className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">
                {file ? file.name : 'Choose CSV file'}
              </span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <button
              onClick={handleDownloadSample}
              className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                       rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors
                       flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Sample CSV
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleUpload}
            disabled={!file || !agentId || isUploading}
            className="px-6 py-3 bg-gradient-to-r from-google-blue-500 to-google-blue-600 text-white rounded-xl hover:from-google-blue-600 hover:to-google-blue-700 shadow-google
                     disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105
                     flex items-center gap-2 font-semibold"
          >
            <Upload className="w-5 h-5" />
            {isUploading ? 'Uploading...' : 'Upload & Parse'}
          </button>

          <button
            onClick={handleRunTests}
            disabled={!uploadResponse || isRunning}
            className="px-6 py-3 bg-gradient-to-r from-google-green-500 to-google-green-600 text-white rounded-xl hover:from-google-green-600 hover:to-google-green-700 shadow-google
                     disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105
                     flex items-center gap-2 font-semibold"
          >
            <Play className="w-5 h-5" />
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-google-red-50 dark:bg-google-red-900/30 border-2 border-google-red-400
                        dark:border-google-red-600 rounded-xl text-google-red-700 dark:text-google-red-200 font-medium">
            {error}
          </div>
        )}
        </div>
      </div>

      {/* Upload Response */}
      {uploadResponse && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-google-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Parsed Test Cases
          </h2>
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300">
              Total test cases: <span className="font-bold">{uploadResponse.test_count}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              Showing preview of first {uploadResponse.test_cases.length} test cases
            </p>
          </div>
          <div className="space-y-3">
            {uploadResponse.test_cases.map((testCase, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {testCase.test_id}
                  </span>
                  {testCase.expected_intent && (
                    <span className="ml-auto text-sm text-gray-600 dark:text-gray-400">
                      Expected: {testCase.expected_intent}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {testCase.conversation.join(' → ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResults && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-google-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Test Results
          </h2>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-google-blue-50 dark:bg-google-blue-900/30 rounded-xl shadow-google">
              <p className="text-sm text-google-blue-600 dark:text-google-blue-300 mb-1 font-medium">Total Tests</p>
              <p className="text-3xl font-bold text-google-blue-700 dark:text-google-blue-200">
                {testResults.summary.total_tests}
              </p>
            </div>
            <div className="p-4 bg-google-green-50 dark:bg-google-green-900/30 rounded-xl shadow-google">
              <p className="text-sm text-google-green-600 dark:text-google-green-300 mb-1 font-medium">Passed</p>
              <p className="text-3xl font-bold text-google-green-700 dark:text-google-green-200">
                {testResults.summary.passed}
              </p>
            </div>
            <div className="p-4 bg-google-red-50 dark:bg-google-red-900/30 rounded-xl shadow-google">
              <p className="text-sm text-google-red-600 dark:text-google-red-300 mb-1 font-medium">Failed</p>
              <p className="text-3xl font-bold text-google-red-700 dark:text-google-red-200">
                {testResults.summary.failed}
              </p>
            </div>
            <div className="p-4 bg-google-purple-50 dark:bg-google-purple-900/30 rounded-xl shadow-google">
              <p className="text-sm text-google-purple-600 dark:text-google-purple-300 mb-1 font-medium">Pass Rate</p>
              <p className="text-3xl font-bold text-google-purple-700 dark:text-google-purple-200">
                {testResults.summary.pass_rate}%
              </p>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-4">
            {testResults.results.map((result, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div
                  className={`p-4 cursor-pointer ${
                    result.passed
                      ? 'bg-green-50 dark:bg-green-900'
                      : 'bg-red-50 dark:bg-red-900'
                  }`}
                  onClick={() => setSelectedTest(selectedTest?.test_id === result.test_id ? null : result)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {result.passed ? (
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 dark:text-red-300" />
                      )}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {result.test_id}
                      </span>
                      {result.expected_intent && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Expected: {result.expected_intent}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {result.conversation_results.length} turns
                    </span>
                  </div>
                </div>

                {selectedTest?.test_id === result.test_id && (
                  <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-3">
                      {result.conversation_results.map((turn, turnIndex) => (
                        <div key={turnIndex} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Turn {turn.turn}
                              </p>
                              <p className="text-gray-900 dark:text-white font-medium">
                                {turn.user_input}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              {turn.response_time}s
                            </div>
                          </div>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              <span className="font-semibold">Intent:</span> {turn.intent}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              <span className="font-semibold">Confidence:</span>{' '}
                              {(turn.confidence * 100).toFixed(2)}%
                            </p>
                            {turn.response_messages.length > 0 && (
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">Response:</span>{' '}
                                {turn.response_messages.join(', ')}
                              </p>
                            )}
                            {turn.error && (
                              <p className="text-sm text-red-600 dark:text-red-400">
                                <span className="font-semibold">Error:</span> {turn.error}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVTesting;
