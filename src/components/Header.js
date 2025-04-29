import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
// ... other imports

const Header = ({ user, onLogout }) => {
  const { t } = useLanguage();
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
                {t('appName')}
              </Link>
            </div>
            {/* ... rest of header */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 