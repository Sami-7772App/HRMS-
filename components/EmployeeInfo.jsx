import React, { useState, useEffect } from 'react';

const EmployeeInfo = ({ employee }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(employee || {
    id: 1,
    name: 'Faizan Sami',
    position: 'Senior Product Designer',
    department: 'UI/UX Design',
    phone: '+923001234567',
    email: 'Sami124@example.com',
    report_to: 'Noman',
    joined_date: '15 Sep 2025',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData(employee || {
      id: 1,
      name: 'Faizan Sami',
      position: 'Senior Product Designer',
      department: 'UI/UX Design',
      phone: '+923001234567',
      email: 'Sami124@example.com',
      report_to: 'Noman',
      joined_date: '15 Sep 2025',
    });
  }, [employee]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/employee/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          position: formData.position,
          department: formData.department,
          phone: formData.phone,
          email: formData.email,
          report_to: formData.report_to,
          joined_date: formData.joined_date,
        }),
      });
      const updatedEmployee = await response.json();
      setFormData(updatedEmployee);
      setIsEditing(false);
    } catch (err) {
      setError('Updated Employee');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await fetch(`http://localhost:3001/api/employee/${formData.id}`, {
          method: 'DELETE',
        });
        setFormData({
          id: null,
          name: '',
          position: '',
          department: '',
          phone: '',
          email: '',
          report_to: '',
          joined_date: '',
        });
      } catch (err) {
        setError('Employee Deleted');
        console.error(err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full">
      
      <div className="bg-gray-800 p-4 -mx-6 -mt-6 mb-6 rounded-t-lg">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-600">FS</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{formData.name}</h2>
            <div>
              <p className="text-sm text-white">{formData.position}</p>
              <p className="text-sm text-white">{formData.department}</p>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

   
      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">PHONE NUMBER</p>
          <p className="text-sm font-medium">{formData.phone}</p>
        </div>
        
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">EMAIL ADDRESS</p>
          <p className="text-sm font-medium text-blue-600">{formData.email}</p>
        </div>
        
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">REPORT OFFICE</p>
          <p className="text-sm font-medium">{formData.report_to}</p>
        </div>
        
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">JOINED ON</p>
          <p className="text-sm font-medium">{formData.joined_date}</p>
        </div>

       
        <button
          onClick={() => setIsEditing(true)}
          className="bg-black text-white p-3 rounded w-full hover:bg-gray-800 transition-colors duration-200 font-medium mt-4"
        >
          Edit Profile
        </button>
      </div>

      
      {isEditing && (
        <div className="fixed inset-0 bg-transparent bg-opacity-1250 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Employee Profile</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Name"
              />
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Position"
              />
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Department"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Phone Number"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Email Address"
              />
              <input
                type="text"
                name="report_to"
                value={formData.report_to}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Report Office"
              />
              <input
                type="text"
                name="joined_date"
                value={formData.joined_date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Joined Date"
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                {formData.id && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeInfo;