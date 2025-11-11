import React from 'react';
import { FaClock } from 'react-icons/fa';

const Attendance = () => {
  return (

    <div className=" border border-orange-600">
   
    <div className="bg-orange-50 p-6 rounded-lg mt-0.5 shadow-md border border-orange-100" style={{ width: '100%', height: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
    
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-orange-800 flex items-center justify-center">
          <FaClock className="mr-3" />
          Attendance
        </h1>
      </div>

    
      <div className="text-center mb-6">
        <p className="text-gray-600 text-sm">09:35 AM, 26 Sep 2025</p>
      </div>

      <div className="relative w-40 h-40 mb-6">
        <svg className="w-full h-full transform -rotate-360" viewBox="0 0 180 160">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="gray"
            strokeWidth="1"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="green"
            strokeWidth="5"
            strokeDasharray="439.8"
            strokeDashoffset="0"
            strokeLinecap="round"
          />
          <text
            x="80"
            y="75"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-2xl font-bold text-orange-700"
          >
            10:30:15
          </text>
          <text
            x="80"
            y="100"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm text-gray-600"
          >
            Total Hours
          </text>
        </svg>
      </div>
    
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-gray-600">
          Production : <span className="text-gray-600">21 hrs</span>
        </h2>
    </div>

   
      <div className="text-center mb-6">
        <p className="text-gray-600 text-sm">Punch In at 09.00 AM</p>
      </div>

     
      <button className="bg-orange-600 hover:bg-red-600 text-white font-bold py-4 px-16 rounded-lg text-xl shadow-lg transition duration-200 w-full max-w-full">
        Punch Out
      </button>
    </div>
    </div>
    
  );
};

export default Attendance;