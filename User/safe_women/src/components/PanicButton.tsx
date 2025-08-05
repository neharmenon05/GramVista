import React, { useState } from 'react';
import { AlertTriangle, MapPin, MessageSquare, Phone } from 'lucide-react';

const PanicButton: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingLocation(false);
          alert('Unable to get location. Please check permissions.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setIsGettingLocation(false);
    }
  };

  const handlePanicPress = () => {
    setIsPressed(true);
    getCurrentLocation();
    setTimeout(() => {
      setShowOptions(true);
    }, 1000);
  };

  const shareLocationViaSMS = () => {
    if (!location) return;
    
    const { latitude, longitude } = location.coords;
    const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
    const message = `🚨 EMERGENCY: I need help! My location: ${locationUrl}`;
    
    // For SMS sharing
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    window.open(smsUrl, '_blank');
  };

  const shareLocationViaWhatsApp = () => {
    if (!location) return;
    
    const { latitude, longitude } = location.coords;
    const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
    const message = `🚨 EMERGENCY: I need help! My location: ${locationUrl}`;
    
    // For WhatsApp sharing
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const callEmergency = () => {
    window.open('tel:100', '_self');
  };

  const resetPanic = () => {
    setIsPressed(false);
    setShowOptions(false);
    setLocation(null);
  };

  if (showOptions) {
    return (
      <div className="fixed inset-0 bg-red-600 bg-opacity-95 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-6">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Emergency Mode Active</h2>
            <p className="text-gray-600">Choose how to get help:</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={callEmergency}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>Call 100</span>
            </button>

            <button
              onClick={shareLocationViaSMS}
              disabled={!location}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-4 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Send SMS Alert</span>
            </button>

            <button
              onClick={shareLocationViaWhatsApp}
              disabled={!location}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-4 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Share via WhatsApp</span>
            </button>
          </div>

          {isGettingLocation && (
            <div className="text-center mt-4">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4 animate-pulse" />
                <span className="text-sm">Getting your location...</span>
              </div>
            </div>
          )}

          {location && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 text-green-700">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Location obtained</span>
              </div>
            </div>
          )}

          <button
            onClick={resetPanic}
            className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 z-40">
      <button
        onClick={handlePanicPress}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform ${
          isPressed
            ? 'bg-red-700 scale-110 animate-pulse'
            : 'bg-red-500 hover:bg-red-600 hover:scale-105 active:scale-95'
        }`}
      >
        <AlertTriangle className="w-8 h-8 text-white" />
      </button>
      
      {/* Ripple effect */}
      {isPressed && (
        <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
      )}
    </div>
  );
};

export default PanicButton;