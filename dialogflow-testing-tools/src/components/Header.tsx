import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sun, Moon, Sparkles, TestTube, FileSpreadsheet, Home, Info, Mail, DollarSign,
  Bot, GitBranch, TrendingUp, Workflow, LayoutDashboard, Menu, X
} from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, highlight: true },
    { path: '/live-testing', label: 'Live Agent', icon: Sparkles },
    { path: '/test-cases', label: 'Test Cases', icon: TestTube },
    { path: '/csv-testing', label: 'Bulk Testing', icon: FileSpreadsheet },
    { path: '/agents', label: 'Agents', icon: Bot },
    { path: '/environments', label: 'Environments', icon: GitBranch },
    { path: '/test-coverage', label: 'Coverage', icon: TrendingUp },
    { path: '/flow-validation', label: 'Validation', icon: Workflow },
  ];

  const secondaryNavItems = [
    { path: '/about', label: 'About', icon: Info },
    { path: '/pricing', label: 'Pricing', icon: DollarSign },
    { path: '/contact', label: 'Contact', icon: Mail },
  ];

  return (
    <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-google-lg sticky top-0 z-50 border-b-2 ${darkMode ? 'border-magenta-900' : 'border-magenta-100'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-magenta-500 to-google-purple-600 p-2 rounded-xl transform group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-lg font-bold font-google ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Dialogflow Testing
              </h1>
              <p className="text-xs text-magenta-500 font-medium">Professional SaaS Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-all font-medium text-sm ${
                    item.highlight
                      ? active
                        ? 'bg-gradient-to-r from-magenta-500 to-google-purple-600 text-white shadow-google'
                        : darkMode
                        ? 'bg-magenta-900/30 text-magenta-300 hover:bg-magenta-900/50'
                        : 'bg-magenta-50 text-magenta-700 hover:bg-magenta-100'
                      : active
                      ? darkMode
                        ? 'bg-google-blue-900/40 text-google-blue-300'
                        : 'bg-google-blue-100 text-google-blue-700'
                      : darkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Secondary nav (desktop) */}
            <div className="hidden xl:flex items-center space-x-1 mr-2">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-all font-medium text-sm ${
                      active
                        ? darkMode
                          ? 'bg-gray-700 text-white'
                          : 'bg-gray-100 text-gray-900'
                        : darkMode
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                darkMode
                  ? 'bg-google-yellow-500 hover:bg-google-yellow-400 text-gray-900'
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
              }`}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t dark:border-gray-700 pt-4">
            <div className="grid grid-cols-2 gap-2">
              {[...navItems, ...secondaryNavItems].map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-lg flex items-center space-x-2 transition-all font-medium text-sm ${
                      active
                        ? darkMode
                          ? 'bg-google-blue-900/40 text-google-blue-300'
                          : 'bg-google-blue-100 text-google-blue-700'
                        : darkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
