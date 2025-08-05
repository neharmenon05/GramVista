import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, MessageSquare, User } from 'lucide-react';

interface FakeCallProps {
  onEnd: () => void;
}

const FakeCall: React.FC<FakeCallProps> = ({ onEnd }) => {
  const [isRinging, setIsRinging] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [audio] = useState(new Audio());

  const fakeContacts = [
    { name: 'Mom', number: '+1 (555) 123-4567' },
    { name: 'Sarah Johnson', number: '+1 (555) 987-6543' },
    { name: 'Dr. Smith', number: '+1 (555) 456-7890' },
    { name: 'Office', number: '+1 (555) 321-0987' }
  ];

  const [caller] = useState(fakeContacts[Math.floor(Math.random() * fakeContacts.length)]);

  useEffect(() => {
    // Create ringtone sound programmatically
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    let oscillator: OscillatorNode;
    let gainNode: GainNode;
    let intervalId: NodeJS.Timeout;

    const playRingtone = () => {
      oscillator = audioContext.createOscillator();
      gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
      
      setTimeout(() => {
        oscillator = audioContext.createOscillator();
        gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
      }, 600);
    };

    if (isRinging) {
      playRingtone();
      intervalId = setInterval(playRingtone, 2000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (oscillator) oscillator.disconnect();
      if (gainNode) gainNode.disconnect();
    };
  }, [isRinging]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isRinging) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRinging]);

  const answerCall = () => {
    setIsRinging(false);
  };

  const endCall = () => {
    onEnd();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex flex-col justify-between z-50 text-white">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-4 text-sm">
        <span>9:41 AM</span>
        <span>Carrier</span>
        <span>100%</span>
      </div>

      {/* Call Info */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {isRinging && (
          <div className="text-center mb-8">
            <p className="text-lg text-gray-300 mb-2">Incoming call</p>
            <p className="text-xs text-gray-400">iPhone</p>
          </div>
        )}

        {!isRinging && (
          <div className="text-center mb-8">
            <p className="text-lg text-green-400 mb-2">Connected</p>
            <p className="text-2xl font-light">{formatDuration(callDuration)}</p>
          </div>
        )}

        {/* Caller Avatar */}
        <div className="w-40 h-40 bg-gray-700 rounded-full flex items-center justify-center mb-6">
          <User className="w-20 h-20 text-gray-400" />
        </div>

        {/* Caller Info */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-light mb-2">{caller.name}</h2>
          <p className="text-lg text-gray-400">{caller.number}</p>
        </div>

        {isRinging && (
          <div className="text-center">
            <div className="flex space-x-4 animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="p-8">
        {isRinging ? (
          <div className="flex justify-between items-center">
            {/* Decline */}
            <button
              onClick={endCall}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"
            >
              <PhoneOff className="w-8 h-8" />
            </button>

            {/* Message */}
            <button className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </button>

            {/* Answer */}
            <button
              onClick={answerCall}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
            >
              <Phone className="w-8 h-8" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={endCall}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"
            >
              <PhoneOff className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FakeCall;