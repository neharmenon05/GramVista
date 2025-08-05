import React from 'react';

const RevenueDistribution = () => {
  const sources = [
    { name: 'Homestay Bookings', percentage: 65, color: 'bg-green-500', amount: 78000 },
    { name: 'Guided Tours', percentage: 20, color: 'bg-blue-500', amount: 24000 },
    { name: 'Cooking Classes', percentage: 10, color: 'bg-yellow-500', amount: 12000 },
    { name: 'Cultural Shows', percentage: 5, color: 'bg-purple-500', amount: 6000 },
  ];

  const totalAmount = sources.reduce((sum, source) => sum + source.amount, 0);

  return (
    <div className="space-y-4">
      {sources.map((source, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">{source.name}</span>
            <div className="text-right">
              <span className="text-sm font-semibold text-gray-900">
                ₹{source.amount.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 ml-1">({source.percentage}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`${source.color} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${source.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
      
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-900">Total Revenue</span>
          <span className="font-bold text-lg text-gray-900">
            ₹{totalAmount.toLocaleString()}
          </span>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-50 to-amber-50 p-3 rounded-lg mt-4">
        <p className="text-xs text-gray-600 text-center">
          All earnings are automatically distributed through blockchain smart contracts
        </p>
      </div>
    </div>
  );
};

export default RevenueDistribution;