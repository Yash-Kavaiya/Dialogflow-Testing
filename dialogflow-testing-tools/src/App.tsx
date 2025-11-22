// File: src/App.tsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Pricing from './components/Pricing';
import CSVTesting from './components/CSVTesting';
import LiveTestingAgent from './components/LiveTestingAgent';
import Dashboard from './components/Dashboard';
import TestCasesManagement from './components/TestCasesManagement';
import AgentsManagement from './components/AgentsManagement';
import EnvironmentsManagement from './components/EnvironmentsManagement';
import TestCoverage from './components/TestCoverage';
import FlowValidation from './components/FlowValidation';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard isDarkMode={darkMode} />} />
        <Route path="/test" element={<Home />} />
        <Route path="/live-testing" element={<LiveTestingAgent isDarkMode={darkMode} />} />
        <Route path="/csv-testing" element={<CSVTesting />} />
        <Route path="/test-cases" element={<TestCasesManagement isDarkMode={darkMode} />} />
        <Route path="/agents" element={<AgentsManagement isDarkMode={darkMode} />} />
        <Route path="/environments" element={<EnvironmentsManagement isDarkMode={darkMode} />} />
        <Route path="/test-coverage" element={<TestCoverage isDarkMode={darkMode} />} />
        <Route path="/flow-validation" element={<FlowValidation isDarkMode={darkMode} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
    </div>
  );
};

export default App;
