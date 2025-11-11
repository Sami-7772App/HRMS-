import React from 'react';

const MySkills = () => {
  return (
    <header className="bg-white p-4 flex justify-between items-center border-b">
      
      <div className="text-xl font-semibold">Software Developer</div>
      <div className="flex items-left">
        <input type="text" placeholder="Search in HRMS..." className="border p-2 rounded mr-4" />
        <button className="mr-4">Export ▼</button>
        <div className="bg-gray-200 rounded-full p-2">🔔</div>
        <div className="ml-4 bg-gray-200 rounded-full p-2">👤</div>
      </div>
    </header>
  );
};

export default MySkills;