import React from 'react';

interface EarningsChartProps {
  timeFilter: string;
}

const EarningsChart = ({ timeFilter }: EarningsChartProps) => {
  // Mock data for different time periods
  const data = {
    week: [
      { day: 'Mon', earnings: 2500 },
      { day: 'Tue', earnings: 1800 },
      { day: 'Wed', earnings: 3200 },
      { day: 'Thu', earnings: 2100 },
      { day: 'Fri', earnings: 4500 },
      { day: 'Sat', earnings: 3800 },
      { day: 'Sun', earnings: 2900 },
    ],
    month: [
      { day: 'Week 1', earnings: 12000 },
      { day: 'Week 2', earnings: 15000 },
      { day: 'Week 3', earnings: 18500 },
      { day: 'Week 4', earnings: 16200 },
    ],
    year: [
      { day: 'Jan', earnings: 45000 },
      { day: 'Feb', earnings: 38000 },
      { day: 'Mar', earnings: 52000 },
      { day: 'Apr', earnings: 48000 },
      { day: 'May', earnings: 55000 },
      { day: 'Jun', earnings: 62000 },
    ],
  };

  const currentData = data[timeFilter] || data.month;
  const maxEarnings = Math.max(...currentData.map(d => d.earnings));

  return (
    <div className="h-80">
      <div className="flex items-end justify-between h-full space-x-2">
        {currentData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="relative w-full flex items-end">
              <div
                className="bg-gradient-to-t from-green-600 to-green-400 rounded-t-md w-full transition-all duration-500 hover:from-green-700 hover:to-green-500 cursor-pointer"
                style={{
                  height: `${(item.earnings / maxEarnings) * 250}px`,
                  minHeight: '20px',
                }}
                title={`₹${item.earnings.toLocaleString()}`}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                  ₹{item.earnings.toLocaleString()}
                </div>
              </div>
            </div>
            <span className="text-sm text-gray-600 mt-2 font-medium">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EarningsChart;