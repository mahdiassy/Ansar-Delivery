import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaSignOutAlt, FaUserCircle, FaPhone, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';

const UserProfileDropdown = ({ user, worker, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };
  
  const currentUser = user || worker;
  const userType = user ? 'User' : 'Worker';
  
  if (!currentUser) return null;
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        {currentUser.profilePic ? (
          <img 
            src={currentUser.profilePic} 
            alt={currentUser.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="h-8 w-8" />
        )}
        <span className="hidden md:inline-block">{currentUser.name}</span>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {currentUser.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {userType}
            </p>
          </div>
          
          <div className="py-2">
            <div className="dropdown-item">
              <FaIdCard className="mr-3 h-5 w-5 text-gray-400" />
              <span className="truncate">{currentUser.id}</span>
            </div>
            
            <div className="dropdown-item">
              <FaPhone className="mr-3 h-5 w-5 text-gray-400" />
              <span>{currentUser.phone}</span>
            </div>
            
            {user && (
              <div className="dropdown-item">
                <FaMapMarkerAlt className="mr-3 h-5 w-5 text-gray-400" />
                <span className="truncate">{currentUser.address}</span>
              </div>
            )}
            
            {worker && (
              <div className="dropdown-item">
                <FaUser className="mr-3 h-5 w-5 text-gray-400" />
                <span>{currentUser.role}</span>
              </div>
            )}
          </div>
          
          <div className="py-1 border-t border-gray-100 dark:border-gray-700">
            <button 
              onClick={handleLogout}
              className="dropdown-item text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <FaSignOutAlt className="mr-3 h-5 w-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown; 