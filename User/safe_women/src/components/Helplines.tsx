import React, { useState } from 'react';
import { Phone, Search, MapPin, Clock, ExternalLink } from 'lucide-react';

interface Helpline {
  id: string;
  name: string;
  number: string;
  category: string;
  description: string;
  availability: string;
  website?: string;
}

const Helplines: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helplines: Helpline[] = [
    {
      id: '1',
      name: 'National Domestic Violence Hotline',
      number: '1-800-799-7233',
      category: 'domestic-violence',
      description: '24/7 confidential support for domestic violence survivors',
      availability: '24/7',
      website: 'https://www.thehotline.org'
    },
    {
      id: '2',
      name: 'RAINN National Sexual Assault Hotline',
      number: '1-800-656-4673',
      category: 'sexual-assault',
      description: 'Free, confidential support for survivors of sexual assault',
      availability: '24/7',
      website: 'https://www.rainn.org'
    },
    {
      id: '3',
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      category: 'mental-health',
      description: 'Free and confidential emotional support',
      availability: '24/7',
      website: 'https://suicidepreventionlifeline.org'
    },
    {
      id: '4',
      name: 'Emergency Services',
      number: '911',
      category: 'emergency',
      description: 'Police, fire, and medical emergency services',
      availability: '24/7'
    },
    {
      id: '5',
      name: 'Crisis Text Line',
      number: '741741',
      category: 'mental-health',
      description: 'Text HOME to 741741 for crisis support',
      availability: '24/7',
      website: 'https://www.crisistextline.org'
    },
    {
      id: '6',
      name: 'National Child Abuse Hotline',
      number: '1-800-4-A-CHILD',
      category: 'child-abuse',
      description: 'Crisis counseling and professional help for child abuse',
      availability: '24/7',
      website: 'https://www.childhelp.org'
    },
    {
      id: '7',
      name: 'National Human Trafficking Hotline',
      number: '1-888-373-7888',
      category: 'trafficking',
      description: 'Report trafficking situations and get help',
      availability: '24/7',
      website: 'https://humantraffickinghotline.org'
    },
    {
      id: '8',
      name: 'National Teen Dating Abuse Helpline',
      number: '1-866-331-9474',
      category: 'teen-dating',
      description: 'Support for teens experiencing dating abuse',
      availability: '24/7',
      website: 'https://www.loveisrespect.org'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Categories', color: 'bg-gray-500' },
    { id: 'emergency', label: 'Emergency', color: 'bg-red-500' },
    { id: 'domestic-violence', label: 'Domestic Violence', color: 'bg-purple-500' },
    { id: 'sexual-assault', label: 'Sexual Assault', color: 'bg-pink-500' },
    { id: 'mental-health', label: 'Mental Health', color: 'bg-blue-500' },
    { id: 'child-abuse', label: 'Child Abuse', color: 'bg-orange-500' },
    { id: 'trafficking', label: 'Human Trafficking', color: 'bg-yellow-500' },
    { id: 'teen-dating', label: 'Teen Dating', color: 'bg-green-500' }
  ];

  const filteredHelplines = helplines.filter(helpline => {
    const matchesSearch = helpline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         helpline.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || helpline.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const callNumber = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const openWebsite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search helplines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex overflow-x-auto space-x-2 pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? `${category.color} text-white`
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Helplines List */}
      <div className="space-y-4">
        {filteredHelplines.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center">
            <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No helplines found</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Try adjusting your search terms or category filter
            </p>
          </div>
        ) : (
          filteredHelplines.map((helpline) => {
            const categoryInfo = getCategoryInfo(helpline.category);
            return (
              <div
                key={helpline.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${categoryInfo.color}`}>
                        {categoryInfo.label}
                      </span>
                      <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">{helpline.availability}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {helpline.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {helpline.description}
                    </p>
                    <div className="text-xl font-bold text-red-600 dark:text-red-400">
                      {helpline.number}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => callNumber(helpline.number)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call Now</span>
                  </button>
                  
                  {helpline.website && (
                    <button
                      onClick={() => openWebsite(helpline.website!)}
                      className="p-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Emergency Notice */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl">
        <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Emergency Situations</h4>
        <p className="text-sm text-red-700 dark:text-red-400">
          If you're in immediate danger, call 911 or your local emergency services right away.
        </p>
      </div>
    </div>
  );
};

export default Helplines;