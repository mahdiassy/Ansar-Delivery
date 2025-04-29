// Simple utility for creating user notifications directly in localStorage
export const createUserNotification = (userId, message, requestId, type = 'general') => {
  try {
    // Get data directly from localStorage
    const data = JSON.parse(localStorage.getItem('appData') || '{}');
    
    // Initialize userNotifications if needed
    if (!data.userNotifications) {
      data.userNotifications = [];
    }
    
    // Create notification
    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId,
      requestId,
      message,
      type,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    // Add to notifications
    data.userNotifications.push(notification);
    
    // Save back to localStorage
    localStorage.setItem('appData', JSON.stringify(data));
    
    console.log(`Created notification for user ${userId}: ${message}`);
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}; 