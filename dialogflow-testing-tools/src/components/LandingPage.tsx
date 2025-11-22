import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, TestTube, Bot, GitBranch, TrendingUp, Workflow, FileSpreadsheet,
  CheckCircle, ArrowRight, Shield, Zap, BarChart3, MessageSquare
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Bot,
      title: 'Agent Management',
      description: 'View and validate all your Dialogflow CX agents with one-click validation.',
      link: '/agents',
      color: 'from-google-blue-500 to-google-blue-600',
    },
    {
      icon: TestTube,
      title: 'Test Cases',
      description: 'Create, run, and manage test cases with batch execution support.',
      link: '/test-cases',
      color: 'from-google-purple-500 to-magenta-600',
    },
    {
      icon: GitBranch,
      title: 'Environments',
      description: 'Manage environments and run continuous tests across deployments.',
      link: '/environments',
      color: 'from-google-green-500 to-google-teal-600',
    },
    {
      icon: TrendingUp,
      title: 'Test Coverage',
      description: 'Analyze intent coverage and identify gaps in your test suite.',
      link: '/test-coverage',
      color: 'from-google-yellow-500 to-google-orange-600',
    },
    {
      icon: Workflow,
      title: 'Flow Validation',
      description: 'Validate and train conversation flows to ensure quality.',
      link: '/flow-validation',
      color: 'from-google-teal-500 to-google-green-600',
    },
    {
      icon: FileSpreadsheet,
      title: 'Bulk Testing',
      description: 'Upload CSV files to test multiple conversations at once.',
      link: '/csv-testing',
      color: 'from-google-red-500 to-google-pink-600',
    },
  ];

  const stats = [
    { label: 'API Endpoints', value: '50+' },
    { label: 'Test Features', value: '10+' },
    { label: 'Coverage Types', value: '3' },
    { label: 'Regions Supported', value: '15+' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-magenta-500 via-google-purple-600 to-google-blue-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Dialogflow CX Testing Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Complete SaaS Solution for
              <span className="block text-google-yellow-300">Dialogflow CX Testing</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Professional testing platform powered by the Dialogflow CX API.
              Manage agents, run test cases, track coverage, and validate flows - all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-white text-google-purple-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
              >
                Open Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/live-testing"
                className="inline-flex items-center px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Try Live Testing
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-900" />
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-900 relative -mt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white dark:bg-gray-800 rounded-2xl shadow-google-lg p-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl font-bold text-google-blue-600 dark:text-google-blue-400">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Complete Testing Toolkit
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to test your Dialogflow CX agents, powered by the official API.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={idx}
                  to={feature.link}
                  className="group bg-white dark:bg-gray-900 rounded-xl shadow-google p-6 hover:shadow-google-lg transition-all hover:-translate-y-1"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-google-blue-600 dark:group-hover:text-google-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center text-google-blue-600 dark:text-google-blue-400 font-medium text-sm">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* API Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Built on the Official
                  <span className="text-google-blue-600"> Dialogflow CX API</span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  Our platform leverages the complete Dialogflow CX v3 API to provide enterprise-grade
                  testing capabilities for your conversational AI applications.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Shield, text: 'Secure authentication with Google Cloud credentials' },
                    { icon: Zap, text: 'Real-time intent detection and matching' },
                    { icon: BarChart3, text: 'Comprehensive test coverage analytics' },
                    { icon: CheckCircle, text: 'Automated validation and training' },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-google-green-100 dark:bg-google-green-900/30 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-google-green-600" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white font-mono text-sm overflow-hidden">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-google-red-500" />
                  <div className="w-3 h-3 rounded-full bg-google-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-google-green-500" />
                </div>
                <pre className="text-green-400 overflow-x-auto">
{`// Dialogflow CX API Integration

// List Agents
GET /api/agents

// Run Test Cases
POST /api/agents/{id}/test-cases:batch-run

// Calculate Coverage
GET /api/agents/{id}/test-coverage

// Detect Intent (Live Testing)
POST /api/agents/{id}/detect-intent

// Validate Flows
POST /api/agents/{id}/flows/{flowId}/validate`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-google-blue-600 to-google-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Test Your Dialogflow CX Agents?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Start testing your conversational AI with our comprehensive platform.
            Configure your GCP credentials and begin exploring.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-white text-google-purple-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-magenta-500 to-google-purple-600 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-white">Dialogflow Testing Platform</span>
            </div>
            <p className="text-sm">
              Powered by the Dialogflow CX API v3
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
