import React, { useState } from 'react';
import { FaCalendarCheck } from 'react-icons/fa';

const LeaveSummary = ({ data }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  const leaveData = data || {
    total: 16,
    taken: 10,
    absent: 2,
    workedDays: 240,
    request: 0,
    lop: 2,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: 1, ...formData }),
      });
      const result = await response.json();
      console.log('Leave Request Submitted:', result);
      setShowForm(false);
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full">
      <h2 className="text-lg font-bold mb-6 flex items-center text-gray-800">
        <FaCalendarCheck className="mr-2" /> Leave Details
      </h2>
      
<hr className="border-t border-gray-200 my-6" />
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3">
            <p className="text-sm text-gray-600 mb-1">Total Leaves</p>
            <p className="font-bold text-xl">{leaveData.total}</p>
          </div>
          <div className="text-center p-3">
            <p className="text-sm text-gray-600 mb-1">Taken</p>
            <p className="font-bold text-xl">{leaveData.taken}</p>
          </div>
          <div className="text-center p-3">
            <p className="text-sm text-gray-600 mb-1">Absent</p>
            <p className="font-bold text-xl">{leaveData.absent}</p>
          </div>
          <div className="text-center p-3">
            <p className="text-sm text-gray-600 mb-1">Request</p>
            <p className="font-bold text-xl">{leaveData.request}</p>
          </div>
          <div className="text-center p-3">
            <p className="text-sm text-gray-600 mb-1">Worked Days</p>
            <p className="font-bold text-xl">{leaveData.workedDays}</p>
          </div>
          <div className="text-center p-3">
            <p className="text-sm text-gray-600 mb-1">Loss of Pay</p>
            <p className="font-bold text-xl">{leaveData.lop}</p>
          </div>
        </div>
      </div>

    
      <button
        className="bg-black text-white p-3 rounded w-full hover:bg-gray-800 transition-colors duration-200 font-medium"
        onClick={() => setShowForm(true)}
      >
        Apply New Leave
      </button>

     
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Apply for Leave</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveSummary;