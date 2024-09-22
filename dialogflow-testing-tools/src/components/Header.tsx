import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => (
  <header className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md">
    <div className="container mx-auto px-4 py-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Dialogflow Testing Tools</h1>
      <nav className="flex items-center">
        <Link to="/" className="mx-2 hover:text-blue-500 dark:hover:text-blue-400">Home</Link>
        <Link to="/test" className="mx-2 hover:text-blue-500 dark:hover:text-blue-400">Test</Link>
        <Link to="/about" className="mx-2 hover:text-blue-500 dark:hover:text-blue-400">About</Link>
        <Link to="/contact" className="mx-2 hover:text-blue-500 dark:hover:text-blue-400">Contact</Link>
        <Link to="/pricing" className="mx-2 hover:text-blue-500 dark:hover:text-blue-400">Pricing</Link>
        <button onClick={toggleDarkMode} className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>
    </div>
  </header>
);

export default Header;