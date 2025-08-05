import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, TrendingUp, Globe, Heart, Star } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Shield,
      title: 'Transparent Payments',
      description: 'Blockchain-inspired technology ensures every rupee is tracked and distributed fairly among stakeholders.',
    },
    {
      icon: Users,
      title: 'Community Empowerment',
      description: 'Direct revenue sharing with homestay hosts, local guides, artisans, and cultural performers.',
    },
    {
      icon: TrendingUp,
      title: 'Fair Revenue Distribution',
      description: 'Smart algorithms automatically distribute earnings based on contribution and community impact.',
    },
    {
      icon: Globe,
      title: 'Sustainable Tourism',
      description: 'Promoting responsible travel that benefits local communities and preserves cultural heritage.',
    },
  ];

  const stakeholders = [
    { name: 'Homestay Hosts', percentage: '40%', color: 'bg-green-500' },
    { name: 'Local Guides', percentage: '25%', color: 'bg-amber-500' },
    { name: 'Artisans', percentage: '20%', color: 'bg-blue-500' },
    { name: 'Performers', percentage: '15%', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-green-700 to-amber-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Empowering Rural Tourism Through
              <span className="block text-amber-200">Fair Revenue Distribution</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-green-100">
              VillageChain connects travelers with authentic rural experiences while ensuring 
              transparent and equitable earnings for local communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/booking"
                className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors flex items-center justify-center"
              >
                Book Experience
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/dashboard"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-700 transition-colors"
              >
                Join as Stakeholder
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Transparency & Trust
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform leverages blockchain principles to ensure every stakeholder 
              receives their fair share of tourism revenue.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-amber-50 hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-green-600 to-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Distribution */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fair Revenue Distribution Model
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every booking automatically distributes earnings among community stakeholders 
              based on their contribution to the tourist experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {stakeholders.map((stakeholder, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{stakeholder.name}</h3>
                    <span className="text-lg font-bold text-gray-700">{stakeholder.percentage}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`${stakeholder.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: stakeholder.percentage }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-center">
                <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Impact</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Revenue Distributed</span>
                    <span className="font-semibold">₹2,45,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Stakeholders</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Villages Benefited</span>
                    <span className="font-semibold">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tourist Satisfaction</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold ml-1">4.8/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Join VillageChain today and be part of the movement towards 
            ethical and transparent rural tourism.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors"
            >
              Book Your First Experience
            </Link>
            <Link
              to="/profile"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-700 transition-colors"
            >
              Become a Stakeholder
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;