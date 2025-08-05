import React, { useState, useEffect } from 'react';
import { Phone, Mic, MapPin, Clock, AlertTriangle, Users } from 'lucide-react';

interface DashboardProps {
  onTriggerFakeCall: () => void;
  onNavigateToTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onTriggerFakeCall, onNavigateToTab }) => {
  const [fakeCallTimer, setFakeCallTimer] = useState(10);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            onTriggerFakeCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, onTriggerFakeCall]);

  const startFakeCallTimer = () => {
    setTimeRemaining(fakeCallTimer * 60);
    setTimerActive(true);
  };

  const cancelTimer = () => {
    setTimerActive(false);
    setTimeRemaining(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
          const message = `🚨 EMERGENCY: I need help! My location: ${locationUrl}`;
          
          // Open SMS with location
          const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
          window.open(smsUrl, '_blank');
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get location. Please check permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const quickActions = [
    {
      title: 'Fake Call',
      description: 'Schedule a fake call',
      icon: Phone,
      color: 'bg-blue-500',
      action: startFakeCallTimer
    },
    {
      title: 'Record Audio',
      description: 'Start discrete recording',
      icon: Mic,
      color: 'bg-purple-500',
      action: () => onNavigateToTab('recorder')
    },
    {
      title: 'Share Location',
      description: 'Send location to contacts',
      icon: MapPin,
      color: 'bg-green-500',
      action: shareLocation
    },
    {
      title: 'Emergency Contacts',
      description: 'Quick access to contacts',
      icon: Users,
      color: 'bg-orange-500',
      action: () => onNavigateToTab('contacts')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-8 h-8" />
          <div>
            <h2 className="text-xl font-bold">SheSecure Active</h2>
            <p className="text-red-100">Your safety features are ready</p>
          </div>
        </div>
      </div>

      {/* Fake Call Timer */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Fake Call Timer</h3>
          </div>
        </div>
        
        {!timerActive ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timer (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={fakeCallTimer}
                onChange={(e) => setFakeCallTimer(parseInt(e.target.value) || 10)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              onClick={startFakeCallTimer}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Start Timer
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-blue-500">
              {formatTime(timeRemaining)}
            </div>
            <p className="text-gray-600 dark:text-gray-400">Fake call incoming...</p>
            <button
              onClick={cancelTimer}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel Timer
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Safety Tips */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl">
        <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Safety Tip</h4>
        <p className="text-sm text-amber-700 dark:text-amber-400">
          Keep your emergency contacts updated and practice using these features in a safe environment.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;