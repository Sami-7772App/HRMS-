import React from 'react';

const EmployeeDashboard = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard</h1>
        <p className="text-gray-600">Welcome back!</p>
      </div>
      
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-100 rounded-lg p-4">
            <h3 className="font-semibold">Leaves</h3>
            <p>Used: {data.leaves?.used || 0}</p>
            <p>Remaining: {data.leaves?.remaining || 0}</p>
          </div>
          
          <div className="bg-green-100 rounded-lg p-4">
            <h3 className="font-semibold">Attendance</h3>
            <p>Present: {data.attendance?.present || 0}</p>
            <p>Absent: {data.attendance?.absent || 0}</p>
          </div>
          
          <div className="bg-purple-100 rounded-lg p-4">
            <h3 className="font-semibold">Productivity</h3>
            <p>Score: {data.productivity?.score || 0}%</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;