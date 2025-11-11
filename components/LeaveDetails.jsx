import React, { useState } from 'react';
import { FaCalendarCheck } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext'; 

const LeaveDetails = ({ data }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    leaveType: 'casual' 
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  
  const { user } = useAuth();

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
    setSubmissionStatus('submitting');
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (start >= end) {
        setSubmissionStatus('error');
        alert('End date must be after start date');
        return;
      }

      const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

      if (totalDays <= 0) {
        setSubmissionStatus('error');
        alert('End date must be after start date');
        return;
      }

      if (!formData.reason.trim()) {
        setSubmissionStatus('error');
        alert('Please provide a reason for leave');
        return;
      }

      console.log('Submitting leave request with token:', token ? 'Token exists' : 'No token');

      const response = await fetch('http://localhost:5000/api/leaves/apply', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          leaveType: formData.leaveType,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
          totalDays: totalDays
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `Submission failed: ${response.status}`);
      }
      
      console.log('Leave Request Submitted:', result);
      setSubmissionStatus('success');
      setShowForm(false);
      setFormData({
        startDate: '',
        endDate: '',
        reason: '',
        leaveType: 'casual'
      });
      
      alert('Leave application submitted successfully!');
      
    } catch (err) {
      console.error('Submission error:', err);
      setSubmissionStatus('error');
      
      if (err.message.includes('token') || err.message.includes('authentication')) {
        alert(`Authentication error: ${err.message}. Please login again.`);
      } else {
        alert(`Error submitting leave: ${err.message}`);
      }
    }
  };

  const canApplyLeave = user && (user.role === 'employee' || user.role === 'admin');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full">
      <h2 className="text-lg font-bold mb-6 flex items-center text-gray-800">
        <FaCalendarCheck className="mr-2" /> Leave Details
      </h2>
      <hr className="border-t border-gray-200 my-6" />
      
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Leave Details</h3>
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

      {canApplyLeave ? (
        <button
          className="bg-black text-white p-3 rounded w-full hover:bg-gray-800 transition-colors duration-200 font-medium"
          onClick={() => setShowForm(true)}
        >
          Apply New Leave
        </button>
      ) : (
        <div className="text-center p-3 bg-yellow-100 text-yellow-800 rounded">
          Please login as an employee to apply for leave
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Apply for Leave</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                >
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="earned">Earned Leave</option>
                  <option value="maternity">Maternity Leave</option>
                  <option value="paternity">Paternity Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                  min={new Date().toISOString().split('T')[0]} 
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
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
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
                  placeholder="Please provide a detailed reason for your leave..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSubmissionStatus(null);
                  }}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded"
                  disabled={submissionStatus === 'submitting'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                  disabled={submissionStatus === 'submitting'}
                >
                  {submissionStatus === 'submitting' ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveDetails;