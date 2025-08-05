import React, { useState, useEffect } from 'react';
import { Phone, Shield, Mic, MapPin, Users, Settings, Moon, Sun } from 'lucide-react';
import Dashboard from './components/Dashboard';
import PanicButton from './components/PanicButton';
import FakeCall from './components/FakeCall';
import AudioRecorder from './components/AudioRecorder';
import Helplines from './components/Helplines';
import EmergencyContacts from './components/EmergencyContacts';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [showFakeCall, setShowFakeCall] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('safety-app-theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('safety-app-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('safety-app-theme', 'light');
      }
      return newMode;
    });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'helplines', label: 'Helplines', icon: Phone },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'recorder', label: 'Record', icon: Mic },
  ];

  if (showFakeCall) {
    return <FakeCall onEnd={() => setShowFakeCall(false)} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 min-h-screen shadow-xl">
        {/* Header */}
        <header className="bg-red-600 dark:bg-red-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6" />
            <h1 className="text-lg font-semibold">SheSecure</h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 pb-20">
          {activeTab === 'dashboard' && (
            <Dashboard 
              onTriggerFakeCall={() => setShowFakeCall(true)}
              onNavigateToTab={setActiveTab}
            />
          )}
          {activeTab === 'helplines' && <Helplines />}
          {activeTab === 'contacts' && <EmergencyContacts />}
          {activeTab === 'recorder' && <AudioRecorder />}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Floating Panic Button */}
        <PanicButton />
      </div>
    </div>
  );
}

export default App;