import React, { useState, useEffect } from 'react';
import { getAllWorkers } from '../utils/dataUtils';
import { FaUser, FaPhone, FaTaxi, FaBox, FaSearch } from 'react-icons/fa';
import Spinner from './Spinner';
import { useLanguage } from '../contexts/LanguageContext';

const WorkerDirectory = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();
  
  useEffect(() => {
    loadWorkers();
  }, []);
  
  const loadWorkers = () => {
    setLoading(true);
    try {
      const allWorkers = getAllWorkers();
      setWorkers(allWorkers);
    } catch (error) {
      console.error("Error loading workers:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredWorkers = workers.filter(worker => 
    worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worker.phone.includes(searchQuery) ||
    worker.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('ourServiceProviders')}</h2>
      
      <div className="mb-4">
        <div className="input-with-icon">
          <FaSearch className="icon" />
          <input
            type="text"
            placeholder={t('searchWorkers')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <Spinner size="lg" />
        </div>
      ) : filteredWorkers.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>{t('noResults')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
          {filteredWorkers.map(worker => (
            <div 
              key={worker.id} 
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-3">
                {worker.profilePic ? (
                  <img 
                    src={worker.profilePic} 
                    alt={worker.name}
                    className="h-12 w-12 rounded-full object-cover mr-3"
                    onError={(e) => {
                      // If image fails to load, replace with default icon
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
                    <FaUser className="h-6 w-6 text-primary-500" />
                  </div>
                )}
                <div style={{display: 'none'}} className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
                  <FaUser className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{worker.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    {worker.role === 'Taxi Driver' ? (
                      <FaTaxi className="mr-1 text-primary-500" />
                    ) : (
                      <FaBox className="mr-1 text-primary-500" />
                    )}
                    <span>{t(worker.role)}</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                <FaPhone className="mr-2 text-gray-400" />
                <a href={`tel:${worker.phone}`} className="hover:underline">
                  {worker.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkerDirectory; 