import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-4xl font-bold mb-4 dark:text-white">Welcome to Dialogflow Testing Tools</h1>
      <p className="mb-4 dark:text-gray-300">Streamline your chatbot testing process with our powerful automation tools.</p>
      <Link to="/test" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Start Testing
      </Link>
    </div>
  );
};

export default LandingPage;