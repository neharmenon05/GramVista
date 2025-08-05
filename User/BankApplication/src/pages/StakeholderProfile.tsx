import React, { useState } from 'react';
import { User, MapPin, Phone, Mail, Star, Badge, Camera, Save } from 'lucide-react';
import { useStakeholder } from '../context/StakeholderContext';

const StakeholderProfile = () => {
  const { stakeholder, updateProfile } = useStakeholder();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: stakeholder.name,
    email: stakeholder.email,
    phone: stakeholder.phone,
    location: stakeholder.location,
    description: stakeholder.description,
    skills: stakeholder.skills.join(', '),
  });

  const handleSave = () => {
    updateProfile({
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim()),
    });
    setIsEditing(false);
  };

  const stakeholderTypes = [
    { type: 'homestayHost', label: 'Homestay Host', icon: '🏠' },
    { type: 'guide', label: 'Local Guide', icon: '🗺️' },
    { type: 'artisan', label: 'Artisan', icon: '🎨' },
    { type: 'performer', label: 'Cultural Performer', icon: '🎭' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-amber-600 px-6 py-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={stakeholder.avatar}
                alt={stakeholder.name}
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold">{stakeholder.name}</h1>
              <p className="text-green-100 text-lg">{stakeholderTypes.find(t => t.type === stakeholder.type)?.label}</p>
              <div className="flex items-center mt-2">
                <Star className="h-5 w-5 text-yellow-300 fill-current" />
                <span className="ml-1 text-lg font-medium">{stakeholder.rating.toFixed(1)}</span>
                <span className="ml-2 text-green-100">({stakeholder.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="bg-gradient-to-r from-green-600 to-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-amber-700 transition-colors flex items-center"
            >
              {isEditing ? <Save className="h-4 w-4 mr-2" /> : <User className="h-4 w-4 mr-2" />}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{stakeholder.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{stakeholder.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{stakeholder.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{stakeholder.location}</p>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{stakeholder.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills & Specializations
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    placeholder="Comma-separated skills"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2 py-2">
                    {stakeholder.skills.map((skill, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Badge className="h-4 w-4 inline mr-1" />
                  Verification Status
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-700">Identity Verified</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      ✓ Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-700">Address Verified</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      ✓ Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm text-gray-700">Bank Account</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Experience Bookings</h3>
              <p className="text-3xl font-bold text-green-900">{stakeholder.totalBookings}</p>
              <p className="text-green-600 text-sm">Total bookings completed</p>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Total Earnings</h3>
              <p className="text-3xl font-bold text-amber-900">₹{stakeholder.totalEarnings.toLocaleString()}</p>
              <p className="text-amber-600 text-sm">Lifetime earnings</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Community Impact</h3>
              <p className="text-3xl font-bold text-blue-900">{stakeholder.impactScore}</p>
              <p className="text-blue-600 text-sm">Impact score out of 100</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeholderProfile;