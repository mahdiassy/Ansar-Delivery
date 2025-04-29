import React from 'react';
import { FaTaxi } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import { useLanguage } from '../contexts/LanguageContext';

const SplashScreen = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-primary-500 dark:bg-primary-700 flex flex-col items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="animate-bounce-slow">
          <FaTaxi className="h-24 w-24 text-gray-800 dark:text-white mx-auto mb-6" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
          {t('appName')}
        </h1>
        
        <Spinner size="lg" />
      </div>
    </div>
  );
};

export default SplashScreen; 