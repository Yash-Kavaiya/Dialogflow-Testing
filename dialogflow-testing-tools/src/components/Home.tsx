import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { testDialogflowCX, testDialogflowES } from '../services/dialogflowService';

const Home: React.FC = () => {
  const [dialogflowType, setDialogflowType] = useState('CX');
  const [projectId, setProjectId] = useState('');
  const [agentId, setAgentId] = useState('');
  const [location, setLocation] = useState('');
  const [testText, setTestText] = useState('');
  const [testResult, setTestResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const config = { projectId, agentId, location };
    let result;
    if (dialogflowType === 'CX') {
      result = await testDialogflowCX(config, testText);
    } else {
      result = await testDialogflowES(config, testText);
    }
    setTestResult(JSON.stringify(result, null, 2));
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Test Dialogflow Agent</h2>
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 rounded-l-lg ${dialogflowType === 'CX' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
          onClick={() => setDialogflowType('CX')}
        >
          Dialogflow CX
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg ${dialogflowType === 'ES' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
          onClick={() => setDialogflowType('ES')}
        >
          Dialogflow ES
        </button>
      </div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          required
        />
        <input
          type="text"
          placeholder="Agent ID"
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          required
        />
        {dialogflowType === 'CX' && (
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
          />
        )}
        <textarea
          placeholder="Enter test text"
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
          Run Test
        </button>
      </form>
      {testResult && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2 dark:text-white">Test Result:</h3>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto text-sm dark:text-white">
            {testResult}
          </pre>
        </div>
      )}
      <p className="text-center mt-4 dark:text-gray-300">
        For bulk testing, please subscribe to our <Link to="/pricing" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">premium plan</Link>.
      </p>
    </div>
  );
};

export default Home;