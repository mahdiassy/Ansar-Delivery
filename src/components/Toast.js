import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300); // Allow time for fade-out animation
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaExclamationCircle className="text-red-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };
  
  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900 dark:bg-opacity-20';
      case 'error':
        return 'bg-red-50 dark:bg-red-900 dark:bg-opacity-20';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20';
      default:
        return 'bg-gray-50 dark:bg-gray-800';
    }
  };
  
  return (
    <div 
      className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 max-w-md rounded-lg shadow-lg ${getBgColor()} p-4 flex items-center transition-all duration-300 z-50 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'}`}
    >
      <div className="flex-shrink-0 mr-3">
        {getIcon()}
      </div>
      <div className="flex-1 mr-2">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{message}</p>
      </div>
      <button 
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(), 300);
        }}
        className="flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default Toast; 