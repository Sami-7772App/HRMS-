import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const Sidebar = () => {
  const [openSections, setOpenSections] = useState({
    dashboard: true,
    applications: false,
    superAdmin: false,
    layout: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSuperAdminDashboardClick = () => {
    window.location.href = '/super-admin-dashboard';
  };

  return (
    <div className="bg-white w-64 min-h-screen p-4 border-r border-gray-200 overflow-y-auto">
      <div className="mb-6 text-center">
        <img src="/src/assets/logo.png" alt="Logo" className="h-12 mx-auto" />
      </div>
      <h3 className="text-sm font-bold text-gray-300 mb-2 uppercase">Main Menu</h3>
      <div className="space-y-1">
        <div>
          <button
            onClick={() => toggleSection('dashboard')}
            className="flex items-center justify-between w-full p-2 text-left text-gray-800 hover:bg-gray-100 rounded"
          >
            <span className="flex items-center">
              <span className="mr-2 font-bold">🏠 Dashboard</span>
              <span className="bg-red-500 text-white text-xs px-1 rounded ml-1">Hot</span>
            </span>
            {openSections.dashboard ? <FaChevronDown className="text-xs" /> : <FaChevronRight className="text-xs" />}
          </button>
          {openSections.dashboard && (
            <div className="ml-6 space-y-1 text-gray-600">
              <p className="p-2 hover:bg-gray-100 rounded">Admin Dashboard</p>
              <p className="p-2 text-orange-500 hover:bg-gray-100 rounded">Employee Dashboard</p>
              <p className="p-2 hover:bg-gray-100 rounded">Deals Dashboard</p>
              <p className="p-2 hover:bg-gray-100 rounded">Leads Dashboard</p>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => toggleSection('superAdmin')}
            className="flex items-center justify-between w-full p-2 text-left text-gray-800 hover:bg-gray-100 rounded"
          >
            <span className="flex items-center">
              <span className="mr-2 font-bold">🛡️ Super Admin</span>
            </span>
            {openSections.superAdmin ? <FaChevronDown className="text-xs" /> : <FaChevronRight className="text-xs" />}
          </button>
          {openSections.superAdmin && (
            <div className="ml-6 space-y-1 text-gray-600">
              <p className="p-2 hover:bg-gray-100 rounded">Subscription</p>
              <button 
                onClick={handleSuperAdminDashboardClick}
                className="w-full text-left p-2 text-orange-500 hover:bg-gray-200 rounded"
              >
              </button>
              <p className="p-2 hover:bg-gray-100 rounded">Packages</p>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => toggleSection('layout')}
            className="flex items-center justify-between w-full p-2 text-left text-gray-800 hover:bg-gray-100 rounded"
          >
            <span className="flex items-center">
              <span className="mr-2 font-bold">🎨 Layout</span>
            </span>
            {openSections.layout ? <FaChevronDown className="text-xs" /> : <FaChevronRight className="text-xs" />}
          </button>
          {openSections.layout && (
            <div className="ml-6 space-y-1 text-gray-600">
              <p className="p-2 hover:bg-gray-100 rounded">Horizontal</p>
              <p className="p-2 hover:bg-gray-100 rounded">Detached</p>
              <p className="p-2 hover:bg-gray-100 rounded">Two Column</p>
            </div>
          )}
        </div>

        <div>
          <p className="p-2 hover:bg-gray-100 rounded">Projects</p>
        </div>

        <div>
          <p className="p-2 hover:bg-gray-100 rounded">Clients</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;