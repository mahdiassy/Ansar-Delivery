import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {t('footerCopyright', { year: currentYear })}
        </p>
        <p className="mt-1 flex items-center justify-center">
          {t('madeWith')} <FaHeart className="text-red-500 mx-1" /> {t('inSaudiArabia')}
        </p>
      </div>
    </footer>
  );
};

export default Footer; 