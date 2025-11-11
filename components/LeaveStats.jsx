import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaHome, FaUserClock, FaCalendarCheck } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const LeaveStats = () => {
  const leaveStats = {
     onTime: 1000,
    late: 22,
    wfh: 558,
    absent: 14,
    sickLeave: 48
  };


  const pieData = [
    { name: 'On Time', value: leaveStats.onTime, color: '#10B981' },
    { name: 'Late', value: leaveStats.late, color: '#F59E0B' },
    { name: 'WFH', value: leaveStats.wfh, color: '#3B82F6' },
    { name: 'Absent', value: leaveStats.absent, color: '#EF4444' },
    { name: 'Sick Leave', value: leaveStats.sickLeave, color: '#F97316' }
  ];

  const total = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full">
      <h2 className="text-lg font-bold mb-6 flex items-center text-gray-800">
        <FaCalendarCheck className="mr-2" /> Leave Details
      </h2>
      <hr className="border-t border-gray-200 my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    
        <div>
          
          <div className="space-y-3 mb-6">
            <p className="flex items-center">
              <FaCheckCircle className="mr-3 text-green-500" /> 
              <span className="font-bold mr-1">{leaveStats.onTime}</span> on time
            </p>
            <p className="flex items-center">
              <FaExclamationTriangle className="mr-3 text-yellow-500" /> 
              <span className="font-bold mr-1">{leaveStats.late}</span> Late Attendance
            </p>
            <p className="flex items-center">
              <FaHome className="mr-3 text-blue-500" /> 
              <span className="font-bold mr-1">{leaveStats.wfh}</span> Work From Home
            </p>
            <p className="flex items-center">
              <FaExclamationTriangle className="mr-3 text-red-500" /> 
              <span className="font-bold mr-1">{leaveStats.absent}</span> Absent
            </p>
            <p className="flex items-center">
              <FaUserClock className="mr-3 text-orange-500" /> 
              <span className="font-bold mr-1">{leaveStats.sickLeave}</span> Sick Leave
            </p>
          </div>

          
          <div className="flex items-center">
            <input type="checkbox" className="mr-2" defaultChecked />
            <span className="text-sm text-gray-500">Better than <strong>85%</strong> of Employees</span>
          </div>
        </div>

       
        <div className="flex flex-col items-center justify-center">
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} (${((value/total)*100).toFixed(1)}%)`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
      
          <div className="grid grid-cols-2 gap-2 mt-4 w-full">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center text-xs">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-bold text-lg">{total.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveStats;