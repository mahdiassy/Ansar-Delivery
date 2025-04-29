import React, { useState, useEffect } from 'react';
import { FaBell, FaCheckCircle, FaComments, FaTimes } from 'react-icons/fa';
import { getUserNotifications, markUserNotificationAsRead } from '../utils/dataUtils';
import { showToast } from './ToastContainer';

const UserNotifications = ({ userId, onNotificationClick }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);
  
  useEffect(() => {
    loadNotifications();
    
    // Set up polling for new notifications
    const interval = setInterval(() => {
      loadNotifications(true);
    }, 10000); // Poll every 10 seconds
    
    return () => clearInterval(interval);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const loadNotifications = (checkForNew = false) => {
    try {
      const userNotifications = getUserNotifications(userId);
      setNotifications(userNotifications);
      
      // Check for new notifications
      const unreadCount = userNotifications.filter(n => !n.read).length;
      
      // If this is a check for new notifications and we have more unread than before
      if (checkForNew && unreadCount > lastNotificationCount) {
        // Play notification sound
        const notificationSound = document.getElementById('notification-sound');
        if (notificationSound) {
          notificationSound.play().catch(e => console.log('Could not play notification sound', e));
        }
        
        // Show toast notification
        const newNotifications = unreadCount - lastNotificationCount;
        showToast(`You have ${newNotifications} new notification${newNotifications > 1 ? 's' : ''}`, 'info');
        
        // Make the bell icon shake
        const bellButton = document.getElementById('notification-bell');
        if (bellButton) {
          bellButton.classList.add('animate-shake');
          setTimeout(() => {
            bellButton.classList.remove('animate-shake');
          }, 1000);
        }
      }
      
      setLastNotificationCount(unreadCount);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };
  
  const handleNotificationClick = (notification) => {
    // Mark as read
    markUserNotificationAsRead(notification.id);
    
    // Close notification panel
    setShowNotifications(false);
    
    // Call parent handler if provided
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    
    // Refresh notifications
    loadNotifications();
  };
  
  const getNotificationIcon = (notification) => {
    if (notification.isChat) {
      return <FaComments className="text-blue-500" />;
    } else if (notification.type === 'request_accepted') {
      return <FaCheckCircle className="text-green-500" />;
    } else if (notification.type === 'request_completed') {
      return <FaCheckCircle className="text-purple-500" />;
    } else {
      return <FaBell className="text-yellow-500" />;
    }
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="relative">
      <button
        id="notification-bell"
        onClick={() => setShowNotifications(!showNotifications)}
        className="btn-icon relative"
        title="Notifications"
      >
        <FaBell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>
      
      {showNotifications && (
        <div className="dropdown-menu w-80 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium">Notifications</h3>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>
          
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No notifications
            </div>
          ) : (
            <div>
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-3 border-b border-gray-200 dark:border-gray-700 flex items-start cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="mr-3 mt-1">
                    {getNotificationIcon(notification)}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserNotifications; 