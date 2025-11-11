import React, { useState } from 'react';

const EmployeeList = ({ employees, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setEditForm(employee);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (id) => {
    onUpdate(id, editForm);
    setEditingId(null);
  };

  if (!employees || employees.length === 0) {
    return <div className="p-6 text-center text-gray-500">.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Employee List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee) => (
          <div key={employee.id} className="border p-4 rounded-lg hover:shadow-lg transition-shadow">
            {editingId === employee.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  name="name"
                  value={editForm.name || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  name="position"
                  value={editForm.position || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-"
                />
                <button
                  onClick={() => handleSave(employee.id)}
                  className="bg-green-500 text-black p-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 ml-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold">{employee.name}</h3>
                <p className="text-sm text-gray-600">{employee.position}</p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(employee.id)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;