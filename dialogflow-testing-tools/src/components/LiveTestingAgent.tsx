import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Settings, Clock, Target, Zap, RotateCcw } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  intent?: string;
  confidence?: number;
  responseTime?: number;
}

interface LiveTestingAgentProps {
  isDarkMode: boolean;
}

const LiveTestingAgent: React.FC<LiveTestingAgentProps> = ({ isDarkMode }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Dialogflow Testing Agent. Send me a message to test your agent in real-time!',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  // Configuration state
  const [projectId, setProjectId] = useState('');
  const [agentId, setAgentId] = useState('');
  const [location, setLocation] = useState('global');
  const [environment, setEnvironment] = useState('');
  const [sessionId] = useState(`session-${Date.now()}`);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (!projectId || !agentId) {
      alert('Please configure your Dialogflow agent settings first!');
      setShowConfig(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    const startTime = Date.now();

    try {
      // Simulate API call - Replace with actual Dialogflow API call
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

      const responseTime = Date.now() - startTime;

      // Mock response - Replace with actual Dialogflow response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `This is a simulated response. In production, this would be the actual Dialogflow response to: "${inputMessage}"`,
        sender: 'bot',
        timestamp: new Date(),
        intent: 'sample.intent.detected',
        confidence: 0.85 + Math.random() * 0.15,
        responseTime,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error processing your message. Please check your configuration.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetConversation = () => {
    setMessages([
      {
        id: Date.now().toString(),
        text: 'Conversation reset. Let\'s start fresh!',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-magenta-50 via-google-purple-50 to-google-blue-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className={`rounded-2xl shadow-google-lg p-6 mb-6 ${isDarkMode ? 'bg-gradient-to-r from-magenta-900 to-google-purple-900' : 'bg-gradient-to-r from-magenta-500 to-google-purple-600'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-full p-3">
                <Sparkles className="w-8 h-8 text-magenta-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white font-google">Live Testing Agent</h1>
                <p className="text-magenta-100 mt-1">Real-time Dialogflow conversation testing</p>
              </div>
            </div>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Configure</span>
            </button>
          </div>
        </div>

        {/* Configuration Panel */}
        {showConfig && (
          <div className={`rounded-xl shadow-google mb-6 p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Settings className="w-5 h-5 mr-2 text-magenta-500" />
              Agent Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Project ID *
                </label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-magenta-500 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="your-project-id"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Agent ID *
                </label>
                <input
                  type="text"
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-magenta-500 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="your-agent-id"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-magenta-500 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="global"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Environment (Optional)
                </label>
                <input
                  type="text"
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-magenta-500 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="draft or published"
                />
              </div>
            </div>
            <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-magenta-900/30' : 'bg-magenta-50'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-magenta-300' : 'text-magenta-700'}`}>
                <strong>Session ID:</strong> {sessionId}
              </p>
            </div>
          </div>
        )}

        {/* Main Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className={`rounded-xl shadow-google-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} flex flex-col h-[600px]`}>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`p-2 rounded-full ${
                        message.sender === 'user'
                          ? isDarkMode ? 'bg-google-blue-700' : 'bg-google-blue-500'
                          : isDarkMode ? 'bg-magenta-700' : 'bg-magenta-500'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Bot className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`rounded-2xl p-4 ${
                          message.sender === 'user'
                            ? isDarkMode ? 'bg-google-blue-700 text-white' : 'bg-google-blue-500 text-white'
                            : isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          {message.intent && (
                            <div className="mt-3 pt-3 border-t border-white/20 space-y-1">
                              <div className="flex items-center space-x-2 text-xs">
                                <Target className="w-3 h-3" />
                                <span className="font-medium">Intent:</span>
                                <span className="font-mono">{message.intent}</span>
                              </div>
                              {message.confidence && (
                                <div className="flex items-center space-x-2 text-xs">
                                  <Zap className="w-3 h-3" />
                                  <span className="font-medium">Confidence:</span>
                                  <span className="font-mono">{(message.confidence * 100).toFixed(1)}%</span>
                                </div>
                              )}
                              {message.responseTime && (
                                <div className="flex items-center space-x-2 text-xs">
                                  <Clock className="w-3 h-3" />
                                  <span className="font-medium">Response Time:</span>
                                  <span className="font-mono">{message.responseTime}ms</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2 max-w-[80%]">
                      <div className={`p-2 rounded-full ${isDarkMode ? 'bg-magenta-700' : 'bg-magenta-500'}`}>
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className={`rounded-2xl p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="flex space-x-2">
                          <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-magenta-400' : 'bg-magenta-500'} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                          <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-magenta-400' : 'bg-magenta-500'} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                          <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-magenta-400' : 'bg-magenta-500'} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-magenta-500 ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    } disabled:opacity-50`}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-gradient-to-r from-magenta-500 to-google-purple-600 hover:from-magenta-600 hover:to-google-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-google"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="space-y-6">
            {/* Session Stats */}
            <div className={`rounded-xl shadow-google p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Session Stats
              </h3>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-magenta-900/30' : 'bg-magenta-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-magenta-300' : 'text-magenta-700'}`}>
                      Total Messages
                    </span>
                    <span className={`text-2xl font-bold ${isDarkMode ? 'text-magenta-400' : 'text-magenta-600'}`}>
                      {messages.length}
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-google-blue-900/30' : 'bg-google-blue-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-google-blue-300' : 'text-google-blue-700'}`}>
                      User Messages
                    </span>
                    <span className={`text-2xl font-bold ${isDarkMode ? 'text-google-blue-400' : 'text-google-blue-600'}`}>
                      {messages.filter(m => m.sender === 'user').length}
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-google-purple-900/30' : 'bg-google-purple-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-google-purple-300' : 'text-google-purple-700'}`}>
                      Bot Responses
                    </span>
                    <span className={`text-2xl font-bold ${isDarkMode ? 'text-google-purple-400' : 'text-google-purple-600'}`}>
                      {messages.filter(m => m.sender === 'bot').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={`rounded-xl shadow-google p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={resetConversation}
                  className={`w-full px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                    isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Reset Conversation</span>
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className={`rounded-xl shadow-google p-6 ${isDarkMode ? 'bg-gradient-to-br from-magenta-900/40 to-google-purple-900/40' : 'bg-gradient-to-br from-magenta-50 to-google-purple-50'}`}>
              <div className="flex items-start space-x-3">
                <Sparkles className={`w-5 h-5 mt-1 ${isDarkMode ? 'text-magenta-400' : 'text-magenta-600'}`} />
                <div>
                  <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-magenta-300' : 'text-magenta-700'}`}>
                    Live Testing Tips
                  </h4>
                  <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-magenta-200' : 'text-magenta-600'}`}>
                    <li>• Test real conversations</li>
                    <li>• Monitor intent detection</li>
                    <li>• Track confidence scores</li>
                    <li>• Measure response times</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTestingAgent;
