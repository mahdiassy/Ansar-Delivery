import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaTimes, FaCheckCircle, FaComments } from 'react-icons/fa';
import { showToast } from './ToastContainer';

// A very simple notification bell that works directly with localStorage
const SimpleNotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const prevUnreadCountRef = useRef(0);
  const bellRef = useRef(null);
  
  // Check for notifications on mount and periodically
  useEffect(() => {
    // Initial check
    checkNotifications();
    
    // Set up polling
    const interval = setInterval(() => {
      checkNotifications();
    }, 3000); // Check every 3 seconds
    
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Check for notifications directly in localStorage
  const checkNotifications = () => {
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
      
      // If we have more unread notifications than before
      if (unreadCount > prevUnreadCountRef.current) {
        // Play sound
        const audio = document.getElementById('notification-sound');
        if (audio) {
          audio.play().catch(e => console.log('Could not play sound', e));
        }
        
        // Show toast
        const newCount = unreadCount - prevUnreadCountRef.current;
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
      prevUnreadCountRef.current = unreadCount;
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };
  
  // Mark a notification as read
  const markAsRead = (notificationId) => {
    try {
      // Get data directly from localStorage
      const data = JSON.parse(localStorage.getItem('appData') || '{}');
      
      // Find and update the notification
      if (data.userNotifications) {
        const notification = data.userNotifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
          
          // Save back to localStorage
          localStorage.setItem('appData', JSON.stringify(data));
          
          // Update our local state
          setNotifications(prev => 
            prev.map(n => n.id === notificationId ? {...n, read: true} : n)
          );
          
          // Update unread count
          prevUnreadCountRef.current = data.userNotifications.filter(
            n => n.userId === userId && !n.read
          ).length;
        }
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
    
    // Handle different notification types
    if (notification.type === 'chat') {
      // Find the request
      try {
        const data = JSON.parse(localStorage.getItem('appData') || '{}');
        const request = data.requests.find(r => r.id === notification.requestId);
        
        if (request && request.status === 'Accepted') {
          // Dispatch a custom event to open the chat
          window.dispatchEvent(new CustomEvent('openChat', { 
            detail: { requestId: notification.requestId }
          }));
        }
      } catch (error) {
        console.error('Error handling notification click:', error);
      }
    } else if (notification.type === 'request_accepted') {
      // Highlight the request
      const element = document.getElementById(`request-${notification.requestId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.classList.add('highlight-card');
        setTimeout(() => {
          element.classList.remove('highlight-card');
        }, 2000);
      }
    }
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'chat':
        return <FaComments className="text-blue-500" />;
      case 'request_accepted':
        return <FaCheckCircle className="text-green-500" />;
      case 'request_completed':
        return <FaCheckCircle className="text-purple-500" />;
      default:
        return <FaBell className="text-yellow-500" />;
    }
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  
  return (
    <div className="relative" ref={bellRef}>
      <button
        id="notification-bell"
        onClick={toggleDropdown}
        className="relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <FaBell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {showDropdown && (
        <div className="dropdown-menu notification-dropdown right-0 mt-2 w-80 max-w-sm">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-sm font-semibold">Notifications</h3>
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
                  <div className="mr-3 mt-1">
                    {getNotificationIcon(notification.type)}
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

export default SimpleNotificationBell; 