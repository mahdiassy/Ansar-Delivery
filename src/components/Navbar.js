import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaTaxi, FaArrowLeft, FaMoon, FaSun } from 'react-icons/fa';
import UserProfileDropdown from './UserProfileDropdown';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = ({ userType, user, worker, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const { t } = useLanguage();
  
  useEffect(() => {
    // Check if we should show back button (not on home page)
    setShowBackButton(location.pathname !== '/' && location.pathname !== '/user/dashboard' && location.pathname !== '/worker/dashboard');
    
    // Check for dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [location.pathname]);
  
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {showBackButton && (
              <button 
                onClick={handleBack}
                className="mr-2 text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Go back"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
            )}
            <Link to="/" className="flex items-center">
              <div>
                <FaTaxi className="h-7 w-7 sm:h-8 sm:w-8 text-gray-800 dark:text-white" />
              </div>
              <span className="ml-2 text-lg font-bold text-gray-800 dark:text-white truncate max-w-[150px] sm:max-w-none">
                {t('appName')}
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <LanguageSwitcher />
            
            <button
              onClick={toggleDarkMode}
              className="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
            </button>
            
            {userType && (
              <UserProfileDropdown 
                user={userType === 'user' ? user : null}
                worker={userType === 'worker' ? worker : null}
                onLogout={onLogout}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 