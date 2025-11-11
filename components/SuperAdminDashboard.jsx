/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

const SuperAdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showUpgradeForm, setShowUpgradeForm] = useState(false);
  const [showCompanyDetail, setShowCompanyDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('All Plans');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [sortBy, setSortBy] = useState('Last 7 Days');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '', 
    phone: '',
    address: '',
    website: '',
    plan: 'Enterprise',
    planType: 'Yearly',
    currency: 'USD',
    language: 'English',
    status: 'Active',
    admin: {
      name: '',
      email: '',
      phone: '',
      position: 'Administrator',
      department: 'Management'
    },
    profileImage: null
  });

  const [editFormData, setEditFormData] = useState({
    _id: '',
    name: '',
    email: '', 
    phone: '',
    address: '',
    industry: '',
    size: '1-10',
    website: '',
    status: 'active',
    plan: 'Basic',
    admin: {
      name: '',
      email: '',
      phone: '',
      position: 'Administrator',
      department: 'Management'
    }
  });

  const [upgradeFormData, setUpgradeFormData] = useState({
    companyId: '',
    companyName: '',
    currentPlan: '',
    currentPlanType: '',
    registerDate: '',
    expiringOn: '',
    planName: '',
    planType: '',
    paymentDate: '',
    newExpiringOn: ''
  });

  const SimpleLineChart = ({ color = '#3B82F6' }) => {
    return (
      <div className="w-16 h-8">
        <svg viewBox="0 0 60 30" className="w-full h-full">
          <path
            d="M0,20 C15,15 25,25 40,18 C50,12 55,15 60,20"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  };

  const mockCompanies = [
    {
      _id: '1',
      name: 'Tech Solutions Inc.',
      email: 'contact@techsolutions.com',
      phone: '+1-555-0101',
      website: 'https://techsolutions.com',
      plan: 'Enterprise (Yearly)',
      status: 'active',
      createdAt: '2024-01-15',
      address: 'New York, USA',
      industry: 'Technology',
      admin: {
        name: 'John Smith',
        email: 'john@techsolutions.com',
        phone: '+1-555-0102',
        position: 'CEO',
        department: 'Executive'
      }
    },
    {
      _id: '2',
      name: 'Global Marketing Ltd.',
      email: 'info@globalmarketing.com',
      phone: '+1-555-0202',
      website: 'https://globalmarketing.com',
      plan: 'Professional (Monthly)',
      status: 'active',
      createdAt: '2024-02-20',
      address: 'London, UK',
      industry: 'Marketing',
      admin: {
        name: 'Sarah Johnson',
        email: 'sarah@globalmarketing.com',
        phone: '+1-555-0203',
        position: 'Marketing Director',
        department: 'Marketing'
      }
    },
    {
      _id: '3',
      name: 'Innovate Startup Co.',
      email: 'hello@innovate.com',
      phone: '+1-555-0303',
      website: 'https://innovate.com',
      plan: 'Starter (Monthly)',
      status: 'pending',
      createdAt: '2024-03-10',
      address: 'San Francisco, USA',
      industry: 'Startup',
      admin: {
        name: 'Mike Chen',
        email: 'mike@innovate.com',
        phone: '+1-555-0304',
        position: 'Founder',
        department: 'Executive'
      }
    },
    {
      _id: '4',
      name: 'Data Analytics Pro',
      email: 'sales@dataanalytics.com',
      phone: '+1-555-0404',
      website: 'https://dataanalytics.com',
      plan: 'Professional (Yearly)',
      status: 'inactive',
      createdAt: '2024-01-05',
      address: 'Boston, USA',
      industry: 'Analytics',
      admin: {
        name: 'Emily Davis',
        email: 'emily@dataanalytics.com',
        phone: '+1-555-0405',
        position: 'Data Scientist',
        department: 'Analytics'
      }
    }
  ];

  const fetchCompanies = async () => {
    setFetchLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCompanies(mockCompanies);
      setFilteredCompanies(mockCompanies);
    } catch (error) {
      console.error('Error fetching companies:', error);
      alert('Error fetching companies from server');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    let filtered = companies;
    
    if (searchTerm) {
      filtered = filtered.filter(company => 
        company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.admin?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    
    if (selectedPlan !== 'All Plans') {
      filtered = filtered.filter(company => {
        const companyPlan = company.plan?.split(' ')[0]; 
        return companyPlan === selectedPlan;
      });
    }

    if (selectedStatus !== 'All Status') {
      filtered = filtered.filter(company => company.status === selectedStatus.toLowerCase());
    }

    if (sortBy === 'Last 7 Days') {
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'Alphabetical') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredCompanies(filtered);
    setCurrentPage(1);
  }, [companies, searchTerm, selectedPlan, selectedStatus, sortBy]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleViewCompany = (company) => {
    setSelectedCompany(company);
    setShowCompanyDetail(true);
  };

  const handleUpgradeCompany = (company) => {
    const currentPlan = company.plan || 'Basic';
    const currentPlanType = currentPlan.includes('Yearly') ? 'Yearly' : 'Monthly';
    const basePlan = currentPlan.replace(' (Yearly)', '').replace(' (Monthly)', '');
    
    const currentDate = new Date();
    const registerDate = new Date(company.createdAt).toLocaleDateString('en-GB');
    
    const expiringDate = new Date(currentDate);
    expiringDate.setDate(expiringDate.getDate() + (currentPlanType === 'Yearly' ? 365 : 30));
    
    setUpgradeFormData({
      companyId: company._id,
      companyName: company.name,
      currentPlan: basePlan,
      currentPlanType: currentPlanType,
      registerDate: registerDate,
      expiringOn: expiringDate.toLocaleDateString('en-GB'),
      planName: 'Enterprise',
      planType: 'Yearly',
      paymentDate: currentDate.toLocaleDateString('en-GB'),
      newExpiringOn: new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate()).toLocaleDateString('en-GB')
    });
    setShowUpgradeForm(true);
  };

  const handleUpgradeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Company plan upgraded successfully!');
      setShowUpgradeForm(false);
      setUpgradeFormData({
        companyId: '',
        companyName: '',
        currentPlan: '',
        currentPlanType: '',
        registerDate: '',
        expiringOn: '',
        planName: '',
        planType: '',
        paymentDate: '',
        newExpiringOn: ''
      });
      
      fetchCompanies();
    } catch (error) {
      console.error('Error upgrading company:', error);
      alert('Error upgrading company plan');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'planName' || name === 'planType') {
      const updatedData = {
        ...upgradeFormData,
        [name]: value
      };
      
      if (name === 'planType') {
        const currentDate = new Date();
        let newExpiringDate = new Date(currentDate);
        
        if (value === 'Yearly') {
          newExpiringDate.setFullYear(newExpiringDate.getFullYear() + 1);
        } else {
          newExpiringDate.setMonth(newExpiringDate.getMonth() + 1);
        }
        
        updatedData.newExpiringOn = newExpiringDate.toLocaleDateString('en-GB');
      }
      
      setUpgradeFormData(updatedData);
    } else {
      setUpgradeFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = [];
    
    if (!formData.name?.trim()) {
      validationErrors.push('Company name is required');
    }
    
    if (!formData.email?.trim()) {
      validationErrors.push('Valid company email is required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.push('Valid company email is required');
    }
    
    if (!formData.phone?.trim()) {
      validationErrors.push('Company phone is required');
    }
    
    if (!formData.admin.name?.trim()) {
      validationErrors.push('Admin name is required');
    }
    
    if (!formData.admin.email?.trim()) {
      validationErrors.push('Valid admin email is required');
    } else if (!/\S+@\S+\.\S+/.test(formData.admin.email)) {
      validationErrors.push('Valid admin email is required');
    }

    if (validationErrors.length > 0) {
      alert(`Validation errors:\n- ${validationErrors.join('\n- ')}`);
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newCompany = {
        _id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      
      alert(`Company created successfully!\n\nAdmin Credentials:\nEmail: ${formData.admin.email}\nPassword: auto-generated\n\nNote: Admin will receive login credentials via email.`);
      setShowCreateForm(false);
      resetForm();
      
      setCompanies(prev => [newCompany, ...prev]);
    } catch (error) {
      console.error('Error creating company:', error);
      alert('Error creating company');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCompany = (company) => {
    setEditFormData({
      _id: company._id,
      name: company.name || '',
      email: company.email || '',
      phone: company.phone || '',
      address: company.address || '',
      industry: company.industry || '',
      size: company.size || '1-10',
      website: company.website || '',
      status: company.status || 'active',
      plan: company.plan?.split(' ')[0] || 'Basic',
      admin: {
        name: company.admin?.name || '',
        email: company.admin?.email || '',
        phone: company.admin?.phone || '',
        position: company.admin?.position || 'Administrator',
        department: company.admin?.department || 'Management'
      }
    });
    setShowEditForm(true);
  };

  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Company updated successfully!');
      setShowEditForm(false);
      resetEditForm();
      
      fetchCompanies();
    } catch (error) {
      console.error('Error updating company:', error);
      alert('Error updating company');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company and all associated users?')) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        alert('Company deleted successfully!');
        
        setCompanies(prev => prev.filter(company => company._id !== companyId));
      } catch (error) {
        console.error('Error deleting company:', error);
        alert('Error deleting company');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one company to delete.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} selected companies?`)) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        alert(`${selectedRows.length} companies deleted successfully!`);
        
        const selectedIds = selectedRows.map(company => company._id);
        setCompanies(prev => prev.filter(company => !selectedIds.includes(company._id)));
        setSelectedRows([]);
        setToggleCleared(!toggleCleared);
      } catch (error) {
        console.error('Error deleting companies:', error);
        alert('Error deleting companies');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      plan: 'Enterprise',
      planType: 'Yearly',
      currency: 'USD',
      language: 'English',
      status: 'Active',
      admin: {
        name: '',
        email: '',
        phone: '',
        position: 'Administrator',
        department: 'Management'
      },
      profileImage: null
    });
  };

  const resetEditForm = () => {
    setEditFormData({
      _id: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      industry: '',
      size: '1-10',
      website: '',
      status: 'active',
      plan: 'Basic',
      admin: {
        name: '',
        email: '',
        phone: '',
        position: 'Administrator',
        department: 'Management'
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('admin.')) {
      const fieldName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        admin: {
          ...prev.admin,
          [fieldName]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('admin.')) {
      const fieldName = name.split('.')[1];
      setEditFormData(prev => ({
        ...prev,
        admin: {
          ...prev.admin,
          [fieldName]: value
        }
      }));
    } else {
      setEditFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRowSelected = React.useCallback(state => {
    setSelectedRows(state.selectedRows);
  }, []);

  const contextActions = React.useMemo(() => {
    const handleDelete = () => {
      handleBulkDelete();
    };

    return (
      <button
        key="delete"
        onClick={handleDelete}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
      >
        Delete Selected ({selectedRows.length})
      </button>
    );
  }, [selectedRows]);

  const columns = [
    {
      name: 'Company Name',
      selector: row => row.name,
      sortable: true,
      width: '180px',
      cell: row => (
        <div className="font-medium text-gray-900 truncate" title={row.name}>
          {row.name}
        </div>
      ),
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
      width: '200px',
      cell: row => (
        <div className="truncate" title={row.email}>
          {row.email}
        </div>
      ),
    },
    {
      name: 'Account URL',
      selector: row => row.website || 'N/A',
      sortable: true,
      width: '180px',
      cell: row => (
        <div className="truncate" title={row.website}>
          {row.website || 'N/A'}
        </div>
      ),
    },
    {
      name: 'Plan',
      selector: row => row.plan || 'Basic',
      sortable: true,
      width: '140px',
    },
    {
      name: 'Created Date',
      selector: row => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
      width: '120px',
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      width: '100px',
      cell: row => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : row.status === 'inactive' 
            ? 'bg-red-100 text-red-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {row.status?.charAt(0).toUpperCase() + row.status?.slice(1) || 'Active'}
        </span>
      ),
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex space-x-3">
          <button onClick={() => handleViewCompany(row)} title="View" className="text-gray-500 hover:text-orange-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button onClick={() => handleUpgradeCompany(row)} title="Upgrade" className="text-green-600 hover:text-green-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </button>
          <button onClick={() => handleEditCompany(row)} title="Edit" className="text-blue-600 hover:text-blue-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={() => handleDeleteCompany(row._id)} title="Delete" className="text-red-600 hover:text-red-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
      ignoreRowClick: true,
      width: '140px',
    }
  ];

  const customStyles = {
    table: { style: { width: '100%', minWidth: '1040px' } },
    headCells: {
      style: {
        backgroundColor: '#D3D3D3',
        fontWeight: 'bold',
        fontSize: '0.875rem',
        color: '#374151',
        padding: '0.75rem 1rem',
        whiteSpace: 'nowrap',
      },
    },
    cells: {
      style: {
        padding: '0.75rem 1rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
    rows: {
      style: {
        '&:not(:last-of-type)': { borderBottom: '1px solid #e5e7eb' },
        '&:hover': { backgroundColor: '#f9fafb' },
      },
    },
  };

  const totalCompanies = companies.length;
  const activeCompanies = companies.filter(c => c.status === 'active').length;
  const inactiveCompanies = companies.filter(c => c.status === 'inactive').length;
  const companyLocations = new Set(companies.map(c => c.address?.city || c.address)).size;

  return (
    <div className="p-4 bg-gray-50 min-h-screen relative">
      <div className={`${showCreateForm || showEditForm || showUpgradeForm || showCompanyDetail ? 'opacity-30 pointer-events-none' : ''}`}>
        <div className="mb-0.5">
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600">Application / Companies List</p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div></div> 
          <div className="flex gap-2">
            {selectedRows.length > 0 && contextActions}
            <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option>Export as</option>
                <option>Export as PDF</option>
                <option>Export as CSV</option>
              </select>
              <button onClick={() => setShowCreateForm(true)} className="px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-600 text-sm">
                Add Company
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Companies</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{totalCompanies}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <SimpleLineChart color="#3B82F6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Companies</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{activeCompanies}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <SimpleLineChart color="#10B981" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Companies</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{inactiveCompanies}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <SimpleLineChart color="#EF4444" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Company Location</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{companyLocations}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <SimpleLineChart color="#8B5CF6" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <h2 className="text-lg font-bold">Companies List</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">2025/10/09 - 2025/10/15</span>
              </div>
              <div className="relative">
                <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)} className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option>All Plans</option>
                  <option>Basic</option>
                  <option>Advanced</option>
                  <option>Enterprise</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Pending</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Sort By:</span>
                <div className="relative">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>Alphabetical</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">Row Per Page</span>
                <div className="relative">
                  <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="text-gray-600 text-sm">
                Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredCompanies.length)} of {filteredCompanies.length} entries
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-3 pr-10 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {fetchLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
                <p className="mt-2 text-gray-600">Loading companies...</p>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredCompanies}
                customStyles={customStyles}
                pagination
                paginationPerPage={rowsPerPage}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                selectableRows
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={toggleCleared}
                noDataComponent="No companies found. Click 'Add Company' to create one."
                persistTableHead
                fixedHeader
                fixedHeaderScrollHeight="400px"
                responsive
                onChangePage={page => setCurrentPage(page)}
              />
            )}
          </div>
        </div>
      </div>

      {showCreateForm && (
        <>
          <div className="fixed inset-0 bg-transparent bg-opacity-250 z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold">Add New Company</h2>
                <button onClick={() => { setShowCreateForm(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleCreateCompany} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Profile Image</label>
                  <p className="text-xs text-gray-500 mb-3">Image should be below 4 MB</p>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                      {formData.profileImage ? (
                        <img src={URL.createObjectURL(formData.profileImage)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && file.size > 4 * 1024 * 1024) {
                              alert('Image must be below 4 MB');
                              return;
                            }
                            setFormData(prev => ({ ...prev, profileImage: file }));
                          }}
                          className="hidden"
                        />
                        <span className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600">Upload</span>
                      </label>
                      {formData.profileImage && (
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, profileImage: null }))} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <hr />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name <span className="text-red-500">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Email <span className="text-red-500">*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input type="text" name="website" value={formData.website} onChange={handleInputChange} placeholder="https://" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name <span className="text-red-500">*</span></label>
                    <input type="text" name="admin.name" value={formData.admin.name} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email <span className="text-red-500">*</span></label>
                    <input type="email" name="admin.email" value={formData.admin.email} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name <span className="text-red-500">*</span></label>
                    <select name="plan" value={formData.plan} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>Basic</option>
                      <option>Advanced</option>
                      <option>Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type <span className="text-red-500">*</span></label>
                    <select name="planType" value={formData.planType} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>Monthly</option>
                      <option>Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency <span className="text-red-500">*</span></label>
                    <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language <span className="text-red-500">*</span></label>
                    <select name="language" value={formData.language} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Pending</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={() => { setShowCreateForm(false); resetForm(); }} className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="px-6 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 disabled:opacity-50">
                    {loading ? 'Creating...' : 'Add Company'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {showEditForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold">Edit Company</h2>
                <button onClick={() => { setShowEditForm(false); resetEditForm(); }} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleUpdateCompany} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name <span className="text-red-500">*</span></label>
                    <input type="text" name="name" value={editFormData.name} onChange={handleEditInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Email <span className="text-red-500">*</span></label>
                    <input type="email" name="email" value={editFormData.email} onChange={handleEditInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                    <input type="text" name="phone" value={editFormData.phone} onChange={handleEditInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input type="text" name="website" value={editFormData.website} onChange={handleEditInputChange} placeholder="https://" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name <span className="text-red-500">*</span></label>
                    <input type="text" name="admin.name" value={editFormData.admin.name} onChange={handleEditInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email <span className="text-red-500">*</span></label>
                    <input type="email" name="admin.email" value={editFormData.admin.email} onChange={handleEditInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" name="address" value={editFormData.address} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name <span className="text-red-500">*</span></label>
                    <select name="plan" value={editFormData.plan} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>Basic</option>
                      <option>Advanced</option>
                      <option>Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <input type="text" name="industry" value={editFormData.industry} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" value={editFormData.status} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>active</option>
                      <option>inactive</option>
                      <option>pending</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={() => { setShowEditForm(false); resetEditForm(); }} className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="px-6 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 disabled:opacity-50">
                    {loading ? 'Updating...' : 'Update Company'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {showUpgradeForm && (
        <>
          <div className="fixed inset-0 bg-transparent bg-opacity-150 z-40"></div>
          
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-6">Upgrade Package</h2>

              <form onSubmit={handleUpgradeSubmit}>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Current Plan Details</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Company Name</label>
                      <div className="p-2 bg-gray-50 rounded border">{upgradeFormData.companyName}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price</label>
                      <div className="p-2 bg-gray-50 rounded border">200</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Plan Name</label>
                      <div className="p-2 bg-gray-50 rounded border">{upgradeFormData.currentPlan}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Register Date</label>
                      <div className="p-2 bg-gray-50 rounded border">{upgradeFormData.registerDate}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Plan Type</label>
                      <div className="p-2 bg-gray-50 rounded border">{upgradeFormData.currentPlanType}</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Expiring On</label>
                    <div className="p-2 bg-gray-50 rounded border">{upgradeFormData.expiringOn}</div>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Change Plan</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Plan Name <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="planName"
                        value={upgradeFormData.planName}
                        onChange={handleUpgradeInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        required
                      >
                        <option value="Basic">Basic</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Enterprise">Enterprise</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Plan Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="planType"
                        value={upgradeFormData.planType}
                        onChange={handleUpgradeInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        required
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Payment Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="paymentDate"
                        value={upgradeFormData.paymentDate}
                        onChange={handleUpgradeInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        placeholder="DD-MM-YYYY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Expiring On <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="newExpiringOn"
                        value={upgradeFormData.newExpiringOn}
                        onChange={handleUpgradeInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        placeholder="DD-MM-YYYY"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between gap-2 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowUpgradeForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowUpgradeForm(false)}
                      className="px-6 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                    >
                      Cancel Upgrade
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-amber-700 text-white rounded text-sm hover:bg-amber-600 disabled:opacity-50"
                    >
                      {loading ? 'Upgrading...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* COMPANY DETAIL MODAL */}
      {showCompanyDetail && selectedCompany && (
        <>
          <div className="fixed inset-0 bg-transparent bg-opacity-150 z-40"></div>
          
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-6">Company Detail</h2>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{selectedCompany.name}</h3>
                <p className="text-gray-600">{selectedCompany.email}</p>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              <div className="mb-6">
                <h4 className="text-md font-medium mb-4">Basic Info</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Account URL</span>
                      <div className="mt-1">{selectedCompany.website || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="font-medium">Phone Number</span>
                      <div className="mt-1">{selectedCompany.phone || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="font-medium">Website</span>
                      <div className="mt-1">{selectedCompany.website || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Currency</span>
                      <div className="mt-1">United States Dollar (USD)</div>
                    </div>
                    <div>
                      <span className="font-medium">Language</span>
                      <div className="mt-1">English</div>
                    </div>
                    <div>
                      <span className="font-medium">Address</span>
                      <div className="mt-1">{selectedCompany.address || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              <div className="mb-6">
                <h4 className="text-md font-medium mb-4">Plan Details</h4>
                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <span className="font-medium">Plan Name</span>
                    <div className="mt-1">{selectedCompany.plan || 'Advanced'}</div>
                  </div>
                  <div>
                    <span className="font-medium">Plan Type</span>
                    <div className="mt-1">{selectedCompany.plan?.includes('Yearly') ? 'Yearly' : 'Monthly'}</div>
                  </div>
                  <div>
                    <span className="font-medium">Price</span>
                    <div className="mt-1">$200</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Register Date</span>
                    <div className="mt-1">{new Date(selectedCompany.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                  <div>
                    <span className="font-medium">Expiring On</span>
                    <div className="mt-1">
                      {(() => {
                        const expiringDate = new Date(selectedCompany.createdAt);
                        const planType = selectedCompany.plan?.includes('Yearly') ? 'Yearly' : 'Monthly';
                        if (planType === 'Yearly') {
                          expiringDate.setFullYear(expiringDate.getFullYear() + 1);
                        } else {
                          expiringDate.setMonth(expiringDate.getMonth() + 1);
                        }
                        return expiringDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowCompanyDetail(false)}
                  className="px-6 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SuperAdminDashboard;