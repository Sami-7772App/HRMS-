/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import LeaveDetails from './components/LeaveDetails';
import Attendance from './components/Attendance';
import LeaveStats from './components/LeaveStats';
import DashboardLayout from './components/DashboardLayout';
import EmployeeDashboard from './components/EmployeeDashboard';
import Projects from './components/Projects';
import EmployeeList from './components/EmployeeList'; 
import SuperAdminDashboard from './components/SuperAdminDashboard';
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import EmployeeInfo from './components/EmployeeInfo';
import ProductivityCards from './components/ProductivityCards';
import ProductiveHours from './components/ProductiveHours';
import LeaveSummary from './components/LeaveSummary';

const API_BASE_URL = 'http://localhost:5000/api';

function AppContent() {
  const { user, loading: authLoading, error: authError, logout } = useAuth();
  const [employeeData, setEmployeeData] = useState({});
  const [employees, setEmployees] = useState([]); 
  const [projects, setProjects] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  const demoEmployeeData = () => ({
    id: 1,
    name: 'Faizan Sami',
    position: 'Senior Product Designer',
    department: 'UI|UX Design',
    phone: '+92306777265',
    email: 'Sami124@example.com',
    report_to: 'Noman',
    joined_date: '20 Nov 2025'
  });

  const demoLeavesData = () => ({
    stats: {
      onTime: 1254,
      late: 32,
      wfh: 658,
      absent: 14,
      sickLeave: 68
    },
    summary: {
      total: 16,
      taken: 10,
      absent: 2,
      workedDays: 240,
      request: 0,
      lop: 2,
    }
  });

  const demoProductivityData = () => ({
    today: { total: '8.36 / 9', change: '+5% This Week' },
    week: { total: '10 / 40', change: '+7% Last Week' },
    month: { total: '75 / 98', change: '-8% Last Month' },
    overtime: { total: '16 / 28', change: '-6% Last Month' },
    workingHours: {
      total: '12h 36m',
      productive: '08h 36m',
      break: '22m 15s',
      overtime: '02h 15m'
    }
  });

  const demoProjectsData = () => [
    { 
      id: 1, 
      name: 'Website Redesign', 
      progress: 75, 
      deadline: '2024-03-15', 
      status: 'In Progress',
      completed: 15,
      total: 20
    },
    { 
      id: 2, 
      name: 'Mobile App Development', 
      progress: 45, 
      deadline: '2024-04-20', 
      status: 'In Progress',
      completed: 9,
      total: 20
    },
    { 
      id: 3, 
      name: 'HR System Update', 
      progress: 90, 
      deadline: '2024-02-28', 
      status: 'Almost Done',
      completed: 18,
      total: 20
    }
  ];

  const setDemoData = () => {
    setEmployeeData({
      ...demoEmployeeData(),
      leaves: demoLeavesData(),
      productivity: demoProductivityData(),
    });
    setProjects(demoProjectsData());
  };

  const apiFetch = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem('authToken');
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...defaultOptions,
        ...options,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          logout();
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${url}:`, error);
      
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('net::ERR_CONNECTION_REFUSED') ||
          error.message.includes('Network request failed')) {
        throw new Error('BACKEND_NOT_RUNNING');
      }
      throw error;
    }
  }, [logout]);

  const fetchData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setApiError(null);
    try {
      if (user.role === 'super_admin') {
        const companiesData = await apiFetch('/companies');
        setCompanies(companiesData.companies || []);
      } else {
        const [empData, leavesData, prodData, projData] = await Promise.allSettled([
          apiFetch('/employees/1'),
          apiFetch('/leaves/1'),
          apiFetch('/productivity/1'),
          apiFetch('/projects'),
        ]);

        const hasConnectionError = [empData, leavesData, prodData, projData].some(
          result => result.status === 'rejected' && result.reason?.message === 'BACKEND_NOT_RUNNING'
        );

        if (hasConnectionError) {
          throw new Error('BACKEND_NOT_RUNNING');
        }

        setEmployeeData({
          ...(empData.status === 'fulfilled' ? (empData.value.employee || empData.value.data || empData.value) : demoEmployeeData()),
          leaves: leavesData.status === 'fulfilled' ? (leavesData.value.leaves || leavesData.value.data || leavesData.value) : demoLeavesData(),
          productivity: prodData.status === 'fulfilled' ? (prodData.value.productivity || prodData.value.data || prodData.value) : demoProductivityData(),
        });
        
        setProjects(
          projData.status === 'fulfilled' ? (projData.value.projects || projData.value.data || projData.value) : demoProjectsData()
        );
      }
    } catch (err) {
      console.error('Fetch error:', err);
      if (err.message === 'BACKEND_NOT_RUNNING') {
        setUsingDemoData(true);
        setApiError('Backend server not running. Using demo data.');
        setDemoData();
      } else {
        setApiError('Failed to fetch data from server: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [user, apiFetch]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const handleCreateCompany = async (companyData) => {
    try {
      const response = await apiFetch('/companies', {
        method: 'POST',
        body: companyData,
      });
      
      if (response.success) {
        const companiesData = await apiFetch('/companies');
        setCompanies(companiesData.companies || []);
        return { success: true, data: response };
      }
      return { success: false, error: response.message };
    } catch (err) {
      console.error('Create company error:', err);
      return { success: false, error: err.message };
    }
  };

  const handleUpdateCompany = async (id, companyData) => {
    try {
      const response = await apiFetch(`/companies/${id}`, {
        method: 'PUT',
        body: companyData,
      });
      
      if (response.success) {
        const companiesData = await apiFetch('/companies');
        setCompanies(companiesData.companies || []);
        return { success: true, data: response };
      }
      return { success: false, error: response.message };
    } catch (err) {
      console.error('Update company error:', err);
      return { success: false, error: err.message };
    }
  };

  const handleDeleteCompany = async (id) => {
    try {
      const response = await apiFetch(`/companies/${id}`, {
        method: 'DELETE',
      });
      
      if (response.success) {
        const companiesData = await apiFetch('/companies');
        setCompanies(companiesData.companies || []);
        return { success: true, data: response };
      }
      return { success: false, error: response.message };
    } catch (err) {
      console.error('Delete company error:', err);
      return { success: false, error: err.message };
    }
  };

  const handleLogout = () => {
    logout();
    setEmployeeData({});
    setEmployees([]);
    setProjects([]);
    setCompanies([]);
    setApiError(null);
    setUsingDemoData(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return showLogin ? 
      <Login 
        onSwitchToSignup={() => setShowLogin(false)} 
        loading={loading} 
        error={authError || apiError}
      /> :
      <Signup 
        onSwitchToLogin={() => setShowLogin(true)} 
        loading={loading} 
        error={authError || apiError}
      />;
  }

  return (
    <DashboardLayout currentUser={user} onLogout={handleLogout}>
      {apiError && (
        <div className={`border-l-4 p-4 mb-4 ${usingDemoData ? 'bg-yellow-100 border-yellow-500 text-yellow-700' : 'bg-red-100 border-red-500 text-red-700'}`}>
          <div className="flex">
            <div className="shrink-0">
              <svg className="h-5 w-5 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold">{usingDemoData ? 'Demo Mode' : 'Error'}</p>
              <p className="text-sm">{apiError}</p>
              {usingDemoData && (
                <p className="text-xs mt-1">
                  To use real data, start your backend server: <code>cd backend && npm run dev</code>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3">Loading...</span>
        </div>
      )}

      {!loading && (
        <>
          {user?.role === 'super_admin' ? (
            <SuperAdminDashboard
              companies={companies}
              onCreateCompany={handleCreateCompany}
              onUpdateCompany={handleUpdateCompany}
              onDeleteCompany={handleDeleteCompany}
              currentUser={user}
            />
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <EmployeeInfo employee={employeeData} />
                </div>
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <LeaveStats data={employeeData.leaves} />
                    </div>
                    <div>
                      <LeaveDetails data={employeeData.leaves} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Attendance />
                </div>
                <div className="lg:col-span-2">
                  <ProductivityCards data={employeeData.productivity} />
                </div>
              </div>

              <div className="grid grid-cols-1">
                <Projects projects={projects} />
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;