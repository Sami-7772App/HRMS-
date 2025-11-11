/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { FaClock, FaCalendarAlt, FaChartLine, FaHourglassHalf, FaUserClock, FaRunning, FaTasks } from 'react-icons/fa';

const ProductivityCards = ({ data }) => {
  const [setRefresh] = useState(false);

  const productivityData = data || {
    today: { total: '8.36 / 9', change: '+5% This Week' },
    week: { total: '10 / 40', change: '+7% Last Week' },
    month: { total: '75 / 98', change: '-8% Last Month' },
    overtime: { total: '16 / 28', change: '-6% Last Month' },
    workingHours: { total: '12h 36m', productive: '08h 36m', break: '22m 15s', overtime: '02h 15m' }
  };

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  const isPositiveChange = (change) => {
    return change && typeof change === 'string' && change.includes('+');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full">
      <h2 className="text-lg font-bold mb-6 flex items-center text-gray-800">
        <FaChartLine className="mr-2" /> Productivity
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Today Card */}
        <div
          className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={handleRefresh}
        >
          <div className="flex items-center justify-between mb-3">
            <FaClock className="text-blue-500" />
            <span className="text-xs text-gray-500">Updated 4/01/19, 16 May 2023</span>
          </div>
          <h3 className="font-bold text-gray-700">Today</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{productivityData.today.total}</p>
          <div className="flex items-center mt-2">
            <span className="inline-block w-4 h-4 rounded-full mr-2 bg-green-500" />
            <p className="text-sm text-green-500">
              {productivityData.today.change}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">12th Floor Week</p>
        </div>

        <div
          className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={handleRefresh}
        >
          <div className="flex items-center justify-between mb-3">
            <FaCalendarAlt className="text-green-500" />
            <span className="text-xs text-gray-500">Updated 4/01/19, 16 May 2023</span>
          </div>
          <h3 className="font-bold text-gray-700">Week</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{productivityData.week.total}</p>
          <div className="flex items-center mt-2">
            <span className="inline-block w-4 h-4 rounded-full mr-2 bg-green-500" />
            <p className="text-sm text-green-500">
              {productivityData.week.change}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">17 ELLER WEEK</p>
        </div>

        <div
          className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={handleRefresh}
        >
          <div className="flex items-center justify-between mb-3">
            <FaChartLine className="text-purple-500" />
            <span className="text-xs text-gray-500">Updated 4/01/19, 16 May 2023</span>
          </div>
          <h3 className="font-bold text-gray-700">Month</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{productivityData.month.total}</p>
          <div className="flex items-center mt-2">
            <span className="inline-block w-4 h-4 rounded-full mr-2 bg-red-500" />
            <p className="text-sm text-red-500">
              {productivityData.month.change}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">9th Last Month</p>
        </div>

        <div
          className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={handleRefresh}
        >
          <div className="flex items-center justify-between mb-3">
            <FaHourglassHalf className="text-red-500" />
            <span className="text-xs text-gray-500">Updated 4/01/19, 16 May 2023</span>
          </div>
          <h3 className="font-bold text-gray-700">Overtime</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{productivityData.overtime.total}</p>
          <div className="flex items-center mt-2">
            <span className="inline-block w-4 h-4 rounded-full mr-2 bg-red-500" />
            <p className="text-sm text-red-500">
              {productivityData.overtime.change}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">9th Last Month</p>
        </div>

        <div
          className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={handleRefresh}
        >
          <div className="flex items-center justify-between mb-3">
            <FaUserClock className="text-orange-500" />
            <span className="text-xs text-gray-500">Updated 4/01/19, 16 May 2023</span>
          </div>
          <h3 className="font-bold text-gray-700">Working Hours</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{productivityData.workingHours.total}</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Productive:</span>
              <span className="font-medium">{productivityData.workingHours.productive}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Break:</span>
              <span className="font-medium">{productivityData.workingHours.break}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Overtime:</span>
              <span className="font-medium">{productivityData.workingHours.overtime}</span>
            </div>
          </div>
        </div>

        <div
          className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={handleRefresh}
        >
          <div className="flex items-center justify-between mb-3">
            <FaRunning className="text-teal-500" />
            <span className="text-xs text-gray-500">Updated 4/01/19, 16 May 2023</span>
          </div>
          <h3 className="font-bold text-gray-700">Performance</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-2">85%</p>
          <div className="flex items-center mt-2">
            <span className="inline-block w-4 h-4 rounded-full mr-2 bg-green-500" />
            <p className="text-sm text-green-500">
              +12% This Month
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">Better than last month</p>
        </div>

        <div
          className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={handleRefresh}
        >
          <div className="flex items-center justify-between mb-3">
            <FaTasks className="text-indigo-500" />
            <span className="text-xs text-gray-500">Updated 4/01/19, 16 May 2023</span>
          </div>
          <h3 className="font-bold text-gray-700">Tasks Completed</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-2">24/30</p>
          <div className="flex items-center mt-2">
            <span className="inline-block w-4 h-4 rounded-full mr-2 bg-green-500" />
            <p className="text-sm text-green-500">
              +80% Efficiency
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">On track for weekly goals</p>
        </div>
        <div
          className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={handleRefresh}
        >
          <div className="flex items-center justify-between mb-3">
            <FaTasks className="text-yellow-500" />
            <span className="text-xs text-gray-500">Updated 4/01/25, 16 May 2025</span>
          </div>
          <h3 className="font-bold text-gray-700">Work Efficiency</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-2">24/30</p>
          <div className="flex items-center mt-2">
            <span className="inline-block w-4 h-4 rounded-full mr-2 bg-green-500" />
            <p className="text-sm text-red-500">
              +70% Efficiency
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">On track for Everyday goals</p>
        </div>

<div
          className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={handleRefresh}
        >
          <div className="flex items-center justify-between mb-3">
            <FaTasks className="text-violet-700" />
            <span className="text-xs text-gray-500">Updated 4/01/25, 16 May 2025</span>
          </div>
          <h3 className="font-bold text-gray-700">Break Hours</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-2">26/30</p>
          <div className="flex items-center mt-2">
            <span className="inline-block w-4 h-4 rounded-full mr-2 bg-green-500" />
            <p className="text-sm text-green-500">
              +40% Increase 
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">Daily Basis Break Hours</p>
        </div>

      </div>
    </div>
  );
};

export default ProductivityCards;