import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRequest } from '../../utils/dataUtils';
import { showToast } from '../../components/ToastContainer';
import { FaTaxi, FaBox, FaMapMarkerAlt, FaStickyNote, FaArrowLeft } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const ChooseService = ({ user }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [serviceType, setServiceType] = useState('');
  const [destination, setDestination] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!serviceType) {
      showToast(t('selectServiceType'), 'error');
      return;
    }
    
    if (!destination.trim()) {
      showToast(t('enterDestination'), 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create request without distance field
      createRequest(user.id, serviceType, destination, 0, notes);
      
      showToast(t('requestCreatedSuccess', { service: t(serviceType === 'Traffic Jam' ? 'trafficJam' : 'delivery') }), 'success');
      navigate('/user/dashboard');
    } catch (error) {
      console.error('Error creating request:', error);
      showToast(t('requestCreateFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="page-container bg-gray-50 dark:bg-gray-900">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/user/dashboard')} 
              className="mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Go back"
            >
              <FaArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('createNewRequest')}</h1>
          </div>
          <LanguageSwitcher />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Service Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('whatServiceDoYouNeed')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setServiceType('Traffic Jam')}
                      className={`service-selection-card ${
                        serviceType === 'Traffic Jam'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400 shadow-sm'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className={`icon-circle ${
                        serviceType === 'Traffic Jam' 
                          ? 'bg-primary-100 dark:bg-primary-800' 
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <FaTaxi className={`icon ${
                          serviceType === 'Traffic Jam'
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`} />
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-sm text-gray-900 dark:text-white">{t('trafficJam')}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('taxiService')}</div>
                      </div>
                      {serviceType === 'Traffic Jam' && (
                        <div className="absolute top-2 right-2 h-2 w-2 bg-primary-500 rounded-full"></div>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setServiceType('Delivery')}
                      className={`service-selection-card ${
                        serviceType === 'Delivery'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400 shadow-sm'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className={`icon-circle ${
                        serviceType === 'Delivery' 
                          ? 'bg-primary-100 dark:bg-primary-800' 
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <FaBox className={`icon ${
                          serviceType === 'Delivery'
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`} />
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-sm text-gray-900 dark:text-white">{t('delivery')}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('packageDelivery')}</div>
                      </div>
                      {serviceType === 'Delivery' && (
                        <div className="absolute top-2 right-2 h-2 w-2 bg-primary-500 rounded-full"></div>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Location Details */}
                <div className="trip-details-section">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">{t('locationDetails')}</h3>
                  
                  <div className="form-group mb-0">
                    <label htmlFor="destination" className="form-label mb-1.5">{t('destination')}</label>
                    <div className="location-input-field">
                      <div className="location-icon-container">
                        <FaMapMarkerAlt className="location-icon" />
                      </div>
                      <input
                        type="text"
                        id="destination"
                        name="destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder={t('enterYourDestination')}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Notes */}
                <div className="form-group mb-0">
                  <label className="form-label mb-1.5">{t('additionalNotes')}</label>
                  <div className="notes-input-field">
                    <div className="notes-icon-container">
                      <FaStickyNote className="notes-icon" />
                    </div>
                    <textarea
                      id="notes"
                      name="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={t('anyAdditionalDetails')}
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/user/dashboard')}
                  className="btn-secondary order-2 sm:order-1"
                >
                  {t('cancel')}
                </button>
                
                <button
                  type="submit"
                  className="btn-primary order-1 sm:order-2 py-3"
                  disabled={loading}
                >
                  {loading ? t('creating') : t('createRequest')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseService; 