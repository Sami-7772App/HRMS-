import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaBell, FaDownload, FaCog, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Header = ({ currentUser, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    onLogout();
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="p-4 flex justify-between items-center">
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search in HRMS..." 
              className="border border-gray-300 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
          
          <div className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 cursor-pointer transition-colors">
            <FaCog className="text-gray-600" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300">
            <FaDownload className="text-gray-600" />
            <span className="text-gray-700">Export</span>
            <span className="text-gray-500">▼</span>
          </button>
          
          <div className="relative">
            <div className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 cursor-pointer transition-colors">
              <FaBell className="text-gray-600" />
            </div>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </div>
          
   
          <div className="relative" ref={dropdownRef}>
            <div 
              className="flex items-center space-x-3 bg-gray-100 px-3 py-2 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                <span className="font-semibold">
                  {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-700 font-medium">
                  {currentUser ? currentUser.name : 'User'}
                </span>
                <span className="text-gray-500">▼</span>
              </div>
            </div>

       
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                  <p className="text-sm text-gray-500">{currentUser?.email}</p>
                </div>
                
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <FaUser className="mr-2" />
                  Profile
                </button>
                
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <FaCog className="mr-2" />
                  Settings
                </button>
                
                <div className="border-t border-gray-100"></div>
                
                <button 
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;