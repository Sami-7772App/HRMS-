import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children, currentUser, onLogout }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentUser={currentUser} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentUser={currentUser} onLogout={onLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-gray-50">
          <div className='grid grid-cols-1 gap-6'>
            <div className="flex justify-between items-center mb-6">
              <div className="card flex-fill border-primary leave-bg me-3 font-bold text-xl">
                {currentUser?.role === 'super_admin' ? 'Super Admin Dashboard' : 'Employee Dashboard'}
              </div>
              <span className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="mr-2">🏠</span>
                <span>/ Dashboard / {currentUser?.role === 'super_admin' ? 'Super Admin' : 'Employee'} Dashboard</span>
              </span>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;