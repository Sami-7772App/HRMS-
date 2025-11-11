import React from 'react';
import { FaChartBar, FaClock, FaCoffee, FaPlusCircle } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ProductiveHours = ({ data }) => {
  const workingHoursData = data || {
    totalWorking: '12h 36m',
    productive: '08h 36m',
    break: '22m 15s',
    overtime: '02h 15m'
  };

  const chartData = [
    { name: 'Total', hours: 12.6, color: '#3B82F6' },
    { name: 'Productive', hours: 8.6, color: '#10B981' },
    { name: 'Break', hours: 0.37, color: '#F59E0B' },
    { name: 'Overtime', hours: 2.25, color: '#EF4444' }
  ];

  const formatHours = (timeString) => {
    return timeString.replace('h', 'h ').replace('m', 'm');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full">
      <h2 className="text-lg font-bold mb-6 flex items-center text-gray-800">
        <FaChartBar className="mr-2" /> Working Hours Analysis
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <FaClock className="text-blue-500 text-sm" />
            <span className="text-xs text-blue-600 font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{formatHours(workingHoursData.totalWorking)}</p>
          <p className="text-xs text-blue-600 mt-1">Working Hours</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <FaChartBar className="text-green-500 text-sm" />
            <span className="text-xs text-green-600 font-medium">Productive</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{formatHours(workingHoursData.productive)}</p>
          <p className="text-xs text-green-600 mt-1">Productive Hours</p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <div className="flex items-center justify-between mb-2">
            <FaCoffee className="text-yellow-500 text-sm" />
            <span className="text-xs text-yellow-600 font-medium">Break</span>
          </div>
          <p className="text-2xl font-bold text-yellow-700">{formatHours(workingHoursData.break)}</p>
          <p className="text-xs text-yellow-600 mt-1">Break Time</p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <div className="flex items-center justify-between mb-2">
            <FaPlusCircle className="text-red-500 text-sm" />
            <span className="text-xs text-red-600 font-medium">Overtime</span>
          </div>
          <p className="text-2xl font-bold text-red-700">{formatHours(workingHoursData.overtime)}</p>
          <p className="text-xs text-red-600 mt-1">Overtime Hours</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Hours Distribution</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                label={{ 
                  value: 'Hours', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: -10,
                  style: { textAnchor: 'middle', fill: '#6B7280' }
                }}
              />
              <Tooltip 
                formatter={(value) => [`${value}h`, 'Duration']}
                labelFormatter={(label) => `${label} Hours`}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="hours" 
                radius={[4, 4, 0, 0]}
                barSize={30}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center text-xs">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-gray-600">{item.name}</span>
            <span className="ml-auto font-semibold text-gray-800">{item.hours}h</span>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          <span className="font-semibold text-green-600">68%</span> of your time was productive this week
        </p>
      </div>
    </div>
  );
};

export default ProductiveHours;