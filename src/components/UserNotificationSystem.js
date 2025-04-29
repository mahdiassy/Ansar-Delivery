import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import { showToast } from './ToastContainer';

// Simple notification system that works directly with localStorage
const UserNotificationSystem = ({ userId, onNotificationClick }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const prevNotificationCountRef = useRef(0);
  const bellRef = useRef(null);
  
  // Load notifications on component mount and periodically
  useEffect(() => {
    // Initial load
    loadNotifications();
    
    // Set up polling
    const interval = setInterval(() => {
      loadNotifications(true);
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Load notifications directly from localStorage
  const loadNotifications = (checkForNew = false) => {
    try {
      // Get data directly from localStorage
      const data = JSON.parse(localStorage.getItem('appData') || '{}');
      
      // Get user notifications
      const userNotifications = data.userNotifications || [];
      
      // Filter for this user and sort by date (newest first)
      const myNotifications = userNotifications
        .filter(n => n.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setNotifications(myNotifications);
      
      // Count unread notifications
      const unreadCount = myNotifications.filter(n => !n.read).length;
      
      // If checking for new notifications and we have more than before
      if (checkForNew && unreadCount > prevNotificationCountRef.current) {
        // Play sound
        const audio = document.getElementById('notification-sound');
        if (audio) {
          audio.play().catch(e => console.log('Could not play sound', e));
        }
        
        // Show toast
        const newCount = unreadCount - prevNotificationCountRef.current;
        showToast(`You have ${newCount} new notification${newCount !== 1 ? 's' : ''}`, 'info');
        
        // Shake bell icon
        if (bellRef.current) {
          bellRef.current.classList.add('animate-shake');
          setTimeout(() => {
            bellRef.current.classList.remove('animate-shake');
          }, 1000);
        }
      }
      
      // Update previous count
      prevNotificationCountRef.current = unreadCount;
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };
  
  // Mark a notification as read directly in localStorage
  const markAsRead = (notificationId) => {
    try {
      // Get data directly from localStorage
      const data = JSON.parse(localStorage.getItem('appData') || '{}');
      
      // Get user notifications
      if (!data.userNotifications) return;
      
      // Find and update the notification
      const notification = data.userNotifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        
        // Save back to localStorage
        localStorage.setItem('appData', JSON.stringify(data));
        
        // Reload notifications
        loadNotifications();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Handle notification click
  const handleNotificationClick = (notification) => {
    // Mark as read
    markAsRead(notification.id);
    
    // Close dropdown
    setShowDropdown(false);
    
    // Call parent handler
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="relative">
      {/* Bell icon with badge */}
      <button
        ref={bellRef}
        onClick={() => setShowDropdown(!showDropdown)}
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
      
      {/* Dropdown menu */}
      {showDropdown && (
        <div className="dropdown-menu w-80 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium">Notifications</h3>
            <button
              onClick={() => setShowDropdown(false)}
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

export default UserNotificationSystem; 