import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTaxi, FaUser, FaUserTie } from 'react-icons/fa';
import WorkerDirectory from '../components/WorkerDirectory';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="page-container flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12 animate-fade-in">
        <div className="animate-bounce-slow">
          <FaTaxi className="h-20 w-20 text-primary-500 mx-auto mb-4" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2">
          {t('appName')}
        </h1>
      </div>
      
      <div className="w-full max-w-md space-y-6 animate-slide-up">
        <button 
          onClick={() => navigate('/user/login')}
          className="card w-full flex items-center p-6 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-transform hover:scale-105 active:scale-95"
        >
          <FaUser className="h-10 w-10 text-primary-500 mr-4" />
          <div className="text-left">
            <h2 className="text-xl font-semibold">Continue as User</h2>
            <p className="text-gray-600 dark:text-gray-300">Request a ride or delivery</p>
          </div>
        </button>
        
        <button 
          onClick={() => navigate('/worker/login')}
          className="card w-full flex items-center p-6 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-transform hover:scale-105 active:scale-95"
        >
          <FaUserTie className="h-10 w-10 text-primary-500 mr-4" />
          <div className="text-left">
            <h2 className="text-xl font-semibold">Continue as Worker</h2>
            <p className="text-gray-600 dark:text-gray-300">Drive or deliver</p>
          </div>
        </button>
      </div>
      
      {/* Worker Directory */}
      <WorkerDirectory />
    </div>
  );
};

export default HomePage; 