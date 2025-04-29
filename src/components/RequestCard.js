import React from 'react';
import { FaMapMarkerAlt, FaRulerHorizontal, FaClock, FaUser, FaPhone, FaStickyNote } from 'react-icons/fa';
import { getUnreadMessageCount } from '../utils/dataUtils';
import { useLanguage } from '../contexts/LanguageContext';

const RequestCard = ({ request, actions = [], currentUserId }) => {
  const { t } = useLanguage();

  // Get unread message count if we have a currentUserId
  const unreadCount = currentUserId ? 
    getUnreadMessageCount(currentUserId, request.id) : 0;

  console.log(`RequestCard for ${request.id}, currentUserId: ${currentUserId}, unreadCount: ${unreadCount}`);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Accepted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'Traffic Jam' ? 
      <span className="text-yellow-500">🚕</span> : 
      <span className="text-blue-500">📦</span>;
  };
  
  // Format date with Arabic translations
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    
    // Convert to seconds, minutes, hours, days
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return diffDays === 1 ? t('day ago') : `${diffDays} ${t('days ago')}`;
    }
    if (diffHours > 0) {
      return diffHours === 1 ? t('hour ago') : `${diffHours} ${t('hours ago')}`;
    }
    if (diffMins > 0) {
      return diffMins === 1 ? t('minute ago') : `${diffMins} ${t('minutes ago')}`;
    }
    return t('just now');
  };

  return (
    <div className="card hover:shadow-md transition-shadow" id={`request-${request.id}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          {getTypeIcon(request.type)}
          <h3 className="text-base sm:text-lg font-semibold mr-2">{t(request.type)}</h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(request.status)}`}>
          {t(request.status.toLowerCase())}
        </span>
      </div>
      
      <div className="space-y-2 mb-4 text-sm">
        <div className="list-item-with-icon">
          <FaMapMarkerAlt className="list-icon text-gray-400" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium">{t('destination')}</div>
            <div className="truncate">{request.destination}</div>
          </div>
        </div>
        
        <div className="flex items-start">
          <FaRulerHorizontal className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
          <div>
            <div className="text-xs font-medium">{t('distance')}</div>
            <div>
              {typeof request.distance === 'number' ? 
                `${request.distance} كم` : 
                request.distance} 
              {request.distanceCategory && ` (${request.distanceCategory})`}
            </div>
          </div>
        </div>
        
        {request.notes && (
          <div className="flex items-start">
            <FaStickyNote className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
            <div>
              <div className="text-xs font-medium">{t('notes')}</div>
              <div>{request.notes}</div>
            </div>
          </div>
        )}
        
        {request.userName && (
          <div className="flex items-start">
            <FaUser className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
            <div>
              <div className="text-xs font-medium">{t('user')}</div>
              <div>{request.userName}</div>
            </div>
          </div>
        )}
        
        {request.userPhone && (
          <div className="flex items-start">
            <FaPhone className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
            <div>
              <div className="text-xs font-medium">{t('phone')}</div>
              <div>{request.userPhone}</div>
            </div>
          </div>
        )}
        
        {request.workerName && (
          <div className="flex items-start">
            <FaUser className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
            <div>
              <div className="text-xs font-medium">{t('worker')}</div>
              <div>{request.workerName}</div>
            </div>
          </div>
        )}
        
        {request.workerPhone && (
          <div className="flex items-start">
            <FaPhone className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
            <div>
              <div className="text-xs font-medium">{t('Worker Phone')}</div>
              <div>{request.workerPhone}</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap items-center justify-between">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
          <FaClock className="inline ml-1" />
          {formatTimeAgo(request.createdAt)}
          
          {/* Show unread message count if any */}
          {unreadCount > 0 && (
            <span className="mr-2 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs font-bold animate-pulse">
              {unreadCount} {unreadCount > 1 ? t('new messages') : t('new message')}
            </span>
          )}
        </div>
        
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
            {actions.map((action, index) => (
              action.type === 'custom' ? (
                <React.Fragment key={index}>
                  {action.component}
                </React.Fragment>
              ) : (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`btn-sm text-xs ${action.className || 'btn-primary'}`}
                >
                  {action.icon && <span className="mr-1">{action.icon}</span>}
                  {t(action.label.toLowerCase())}
                </button>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCard; 