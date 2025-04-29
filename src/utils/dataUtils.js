// Import at the top of the file
import { createUserNotification } from './notificationUtils';

// Add this function at the top of the file
// eslint-disable-next-line no-unused-vars
const compressData = (data) => {
  // Create a copy without chat history if it's too large
  const compressedData = {...data};
  
  // If we have too many chat messages, only keep the most recent ones
  if (compressedData.chatMessages && compressedData.chatMessages.length > 100) {
    // Group messages by requestId
    const messagesByRequest = {};
    compressedData.chatMessages.forEach(msg => {
      if (!messagesByRequest[msg.requestId]) {
        messagesByRequest[msg.requestId] = [];
      }
      messagesByRequest[msg.requestId].push(msg);
    });
    
    // For each request, only keep the 10 most recent messages
    let newMessages = [];
    Object.values(messagesByRequest).forEach(messages => {
      if (messages.length > 10) {
        // Sort by timestamp (newest first) and take the 10 most recent
        const sortedMessages = messages.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        ).slice(0, 10);
        newMessages = [...newMessages, ...sortedMessages];
      } else {
        newMessages = [...newMessages, ...messages];
      }
    });
    
    compressedData.chatMessages = newMessages;
  }
  
  // If we still have too many requests, only keep the most recent ones
  if (compressedData.requests && compressedData.requests.length > 50) {
    // Sort by date (newest first)
    const sortedRequests = [...compressedData.requests].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    // Keep only the 50 most recent requests
    compressedData.requests = sortedRequests.slice(0, 50);
    
    // Make sure we only keep chat messages for these requests
    if (compressedData.chatMessages) {
      const keepRequestIds = new Set(compressedData.requests.map(req => req.id));
      compressedData.chatMessages = compressedData.chatMessages.filter(
        msg => keepRequestIds.has(msg.requestId)
      );
    }
  }
  
  return compressedData;
};

// Function to get data from localStorage or initialize from JSON file
export const getData = () => {
  const storedData = localStorage.getItem('appData');
  if (storedData) {
    try {
      const data = JSON.parse(storedData);
      
      // Automatically clean up old data (older than 2 days)
      const cleanedData = cleanupOldData(data);
      
      // If data was cleaned, save it back
      if (cleanedData.cleaned) {
        saveData(cleanedData.data);
        console.log('Auto-cleaned old data');
      }
      
      return cleanedData.data;
    } catch (error) {
      console.error('Error parsing stored data:', error);
      return initializeDefaultData();
    }
  }
  
  return initializeDefaultData();
};

// Automatically clean up old data
const cleanupOldData = (data) => {
  let cleaned = false;
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
  // Only keep requests that are either:
  // 1. Less than 2 days old, or
  // 2. Not completed (still pending or accepted)
  if (data.requests && data.requests.length > 0) {
    const oldRequestIds = data.requests
      .filter(req => {
        // Only consider completed requests
        if (req.status !== 'Completed') {
          return false;
        }
        
        // Check if the request is older than 2 days
        try {
          const requestDate = new Date(req.createdAt);
          return requestDate < twoDaysAgo;
        } catch (e) {
          console.error('Error parsing date:', e);
          return false; // If we can't parse the date, don't delete it
        }
      })
      .map(req => req.id);
    
    if (oldRequestIds.length > 0) {
      console.log(`Cleaning up ${oldRequestIds.length} old completed requests`);
      
      // Remove old requests
      data.requests = data.requests.filter(req => !oldRequestIds.includes(req.id));
      
      // Remove related chat messages
      if (data.chatMessages) {
        data.chatMessages = data.chatMessages.filter(
          msg => !oldRequestIds.includes(msg.requestId)
        );
      }
      
      cleaned = true;
    }
  }
  
  return { data, cleaned };
};

// Initialize default data
const initializeDefaultData = () => {
  const defaultData = {
    users: [],
    workers: [],
    requests: [],
    chatMessages: []
  };
  
  saveData(defaultData);
  return defaultData;
};

// Function to save data to localStorage with improved storage management
export const saveData = (data) => {
  try {
    // Try to save the data
    localStorage.setItem('appData', JSON.stringify(data));
  } catch (error) {
    // If we hit quota error, try to compress data
    if (error.name === 'QuotaExceededError' || error.code === 22 || error.code === 1014) {
      console.warn('Storage quota exceeded, applying emergency cleanup...');
      
      // Emergency cleanup - keep only essential data
      const emergencyData = {
        users: data.users,
        workers: data.workers,
        requests: data.requests
          // Keep only non-completed requests
          .filter(req => req.status !== 'Completed')
          // And the 10 most recent completed requests
          .concat(
            data.requests
              .filter(req => req.status === 'Completed')
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 10)
          ),
        // Keep only messages for remaining requests
        chatMessages: []
      };
      
      // Add back only the most recent messages for each request
      if (data.chatMessages && data.chatMessages.length > 0) {
        const keepRequestIds = new Set(emergencyData.requests.map(req => req.id));
        
        // Group messages by request
        const messagesByRequest = {};
        data.chatMessages.forEach(msg => {
          if (keepRequestIds.has(msg.requestId)) {
            if (!messagesByRequest[msg.requestId]) {
              messagesByRequest[msg.requestId] = [];
            }
            messagesByRequest[msg.requestId].push(msg);
          }
        });
        
        // For each request, keep only the 5 most recent messages
        Object.values(messagesByRequest).forEach(messages => {
          if (messages.length > 5) {
            messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            emergencyData.chatMessages.push(...messages.slice(0, 5));
          } else {
            emergencyData.chatMessages.push(...messages);
          }
        });
      }
      
      try {
        localStorage.setItem('appData', JSON.stringify(emergencyData));
        console.log('Saved emergency data successfully');
      } catch (emergencyError) {
        console.error('Still cannot save after emergency cleanup:', emergencyError);
        
        // Last resort: keep only user and worker data
        const lastResortData = {
          users: data.users,
          workers: data.workers,
          requests: [],
          chatMessages: []
        };
        
        try {
          localStorage.setItem('appData', JSON.stringify(lastResortData));
          console.log('Saved minimal data (users and workers only)');
        } catch (finalError) {
          console.error('Cannot save even minimal data:', finalError);
        }
      }
    } else {
      console.error('Error saving data:', error);
    }
  }
};

// Function to clear all user and worker data (for testing)
export const clearUserAndWorkerData = () => {
  const data = getData();
  data.users = [];
  data.workers = [];
  saveData(data);
  return true;
};

// User functions
export const findUserByPhone = (phone) => {
  const data = getData();
  return data.users.find(user => user.phone === phone);
};

export const findUserById = (userId) => {
  const data = getData();
  return data.users.find(user => user.id === userId);
};

export const createUser = (name, phone, password, address) => {
  const data = getData();
  const newUser = {
    id: `user_${Date.now()}`,
    name,
    phone,
    password,
    address,
    createdAt: new Date().toISOString()
  };
  
  data.users.push(newUser);
  saveData(data);
  return newUser;
};

// Worker functions
export const findWorkerByPhone = (phone) => {
  const data = getData();
  return data.workers.find(worker => worker.phone === phone);
};

export const findWorkerById = (workerId) => {
  const data = getData();
  return data.workers.find(worker => worker.id === workerId);
};

export const createWorker = (name, phone, role, profilePic = null, password = null) => {
  const data = getData();
  const newWorker = {
    id: `worker_${Date.now()}`,
    name,
    phone,
    password,
    role,
    profilePic,
    createdAt: new Date().toISOString()
  };
  
  data.workers.push(newWorker);
  saveData(data);
  return newWorker;
};

export const updateWorker = (workerId, updates) => {
  const data = getData();
  const worker = data.workers.find(w => w.id === workerId);
  
  if (worker) {
    Object.assign(worker, updates);
    saveData(data);
    return worker;
  }
  
  return null;
};

// Request functions
export const createRequest = (userId, type, destination, distance, notes = '') => {
  const data = getData();
  
  // Find user details
  const user = data.users.find(u => u.id === userId);
  let userName = null;
  let userPhone = null;
  
  if (user) {
    userName = user.name || `User #${userId.split('_')[1]}`;
    userPhone = user.phone || 'No phone provided';
  }
  
  const newRequest = {
    id: `req_${Date.now()}`,
    userId,
    userName,
    userPhone,
    type,
    destination,
    distance,
    notes,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  
  data.requests.push(newRequest);
  
  // Create notifications for relevant workers
  if (!data.notifications) {
    data.notifications = [];
  }
  
  // Find workers who match the request type
  const relevantWorkers = data.workers.filter(worker => {
    if (type === 'Traffic Jam' && worker.role === 'Taxi Driver') return true;
    if (type === 'Delivery' && worker.role === 'Delivery Driver') return true;
    return false;
  });
  
  console.log(`Creating notifications for ${relevantWorkers.length} workers`);
  
  // Create notifications for each relevant worker
  relevantWorkers.forEach(worker => {
    const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    data.notifications.push({
      id: notificationId,
      workerId: worker.id,
      requestId: newRequest.id,
      message: `New ${type} request to ${destination}`,
      createdAt: new Date().toISOString(),
      read: false
    });
    console.log(`Created notification ${notificationId} for worker ${worker.id}`);
  });
  
  saveData(data);
  return newRequest;
};

export const getUserRequests = (userId) => {
  const data = getData();
  return data.requests
    .filter(req => req.userId === userId)
    .sort((a, b) => {
      const statusOrder = { 'Accepted': 0, 'Pending': 1, 'Completed': 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
};

export const getWorkerRequests = (workerId, role) => {
  const data = getData();
  
  if (!data.requests) {
    return [];
  }
  
  return data.requests.filter(req => {
    // Show requests assigned to this worker
    if (req.workerId === workerId) {
      return true;
    }
    
    // Show pending requests that match the worker's role
    if (req.status === 'Pending') {
      if (role === 'Taxi Driver' && req.type === 'Traffic Jam') {
        return true;
      }
      if (role === 'Delivery Driver' && req.type === 'Delivery') {
        return true;
      }
    }
    
    return false;
  });
};

// Update the updateRequestStatus function
export const updateRequestStatus = (requestId, status, workerId = null) => {
  const data = getData();
  
  const request = data.requests.find(req => req.id === requestId);
  
  if (!request) {
    console.error(`Request with ID ${requestId} not found`);
    return false;
  }
  
  console.log(`Updating request ${requestId} status to ${status}`);
  
  // Update the request status
  request.status = status;
  
  // If accepting, assign the worker
  if (status === 'Accepted' && workerId) {
    request.workerId = workerId;
    
    // Find worker details to add to the request
    const worker = data.workers.find(w => w.id === workerId);
    if (worker) {
      request.workerName = worker.name || `Worker #${workerId.split('_')[1]}`;
      request.workerPhone = worker.phone || 'No phone provided';
      
      console.log(`Creating notification for user ${request.userId} about accepted request`);
      
      // Create notification for the user using our new function
      createUserNotification(
        request.userId,
        `Your ${request.type} request has been accepted by ${worker.name || 'a worker'}`,
        requestId,
        'request_accepted'
      );
    }
  }
  
  // If completing, add completion timestamp
  if (status === 'Completed') {
    request.completedAt = new Date().toISOString();
    
    console.log(`Creating notification for user ${request.userId} about completed request`);
    
    // Create notification for the user using our new function
    createUserNotification(
      request.userId,
      `Your ${request.type} request has been completed`,
      requestId,
      'request_completed'
    );
  }
  
  // Save the updated data
  saveData(data);
  return true;
};

export const cancelRequest = (requestId) => {
  const data = getData();
  const index = data.requests.findIndex(req => req.id === requestId);
  
  if (index !== -1) {
    data.requests.splice(index, 1);
    saveData(data);
    return true;
  }
  return false;
};

// Chat functions
export const getChatMessages = (requestId) => {
  const data = getData();
  
  if (!data.chatMessages) {
    data.chatMessages = [];
    saveData(data);
    return [];
  }
  
  return data.chatMessages
    .filter(msg => msg.requestId === requestId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

export const addChatMessage = (message) => {
  const data = getData();
  
  if (!data.chatMessages) {
    data.chatMessages = [];
  }
  
  // Add the message
  data.chatMessages.push(message);
  
  console.log(`Added chat message from ${message.senderId} to ${message.recipientId} for request ${message.requestId}`);
  
  // Increment unread count for recipient
  incrementUnreadMessages(message.recipientId, message.requestId);
  
  // Create notification for worker (using existing system)
  if (data.workers.some(w => w.id === message.recipientId)) {
    console.log(`Creating worker notification for ${message.recipientId}`);
    
    if (!data.notifications) {
      data.notifications = [];
    }
    
    data.notifications.push({
      id: `notif_chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      workerId: message.recipientId,
      requestId: message.requestId,
      message: `New message from ${message.senderName}: "${message.content.substring(0, 30)}${message.content.length > 30 ? '...' : ''}"`,
      createdAt: new Date().toISOString(),
      read: false,
      isChat: true
    });
  }
  
  // Create notification for user (using our new function)
  if (data.users.some(u => u.id === message.recipientId)) {
    console.log(`Creating user notification for ${message.recipientId}`);
    
    createUserNotification(
      message.recipientId,
      `New message from ${message.senderName}: "${message.content.substring(0, 30)}${message.content.length > 30 ? '...' : ''}"`,
      message.requestId,
      'chat'
    );
  }
  
  saveData(data);
  return message;
};

// Add this function to get all workers
export const getAllWorkers = () => {
  const data = getData();
  return data.workers.sort((a, b) => a.name.localeCompare(b.name));
};

// Function to clear old completed requests
export const clearOldCompletedRequests = () => {
  const data = getData();
  
  if (!data.requests || data.requests.length === 0) {
    return false;
  }
  
  // Find completed requests older than 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const oldRequestIds = data.requests
    .filter(req => 
      req.status === 'Completed' && 
      new Date(req.createdAt) < sevenDaysAgo
    )
    .map(req => req.id);
  
  if (oldRequestIds.length === 0) {
    return false;
  }
  
  // Remove old requests
  data.requests = data.requests.filter(req => !oldRequestIds.includes(req.id));
  
  // Remove related chat messages
  if (data.chatMessages) {
    data.chatMessages = data.chatMessages.filter(
      msg => !oldRequestIds.includes(msg.requestId)
    );
  }
  
  // Save the cleaned data
  try {
    localStorage.setItem('appData', JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving after cleanup:', error);
    return false;
  }
};

// Debug function to log request status
export const logRequestsStatus = () => {
  const data = getData();
  
  if (!data.requests) {
    console.log('No requests found');
    return;
  }
  
  const pending = data.requests.filter(req => req.status === 'Pending').length;
  const accepted = data.requests.filter(req => req.status === 'Accepted').length;
  const completed = data.requests.filter(req => req.status === 'Completed').length;
  
  console.log(`Requests status: ${pending} pending, ${accepted} accepted, ${completed} completed`);
  
  // Log the 5 most recent requests
  const recentRequests = [...data.requests]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  
  console.log('Recent requests:');
  recentRequests.forEach(req => {
    console.log(`ID: ${req.id}, Status: ${req.status}, Created: ${req.createdAt}`);
  });
};

// Store unread message counts
export const getUnreadMessageCount = (userId, requestId) => {
  const data = getData();
  
  if (!data.unreadMessages) {
    data.unreadMessages = {};
    saveData(data);
    return 0;
  }
  
  const key = `${userId}_${requestId}`;
  return data.unreadMessages[key] || 0;
};

export const incrementUnreadMessages = (recipientId, requestId) => {
  const data = getData();
  
  if (!data.unreadMessages) {
    data.unreadMessages = {};
  }
  
  const key = `${recipientId}_${requestId}`;
  data.unreadMessages[key] = (data.unreadMessages[key] || 0) + 1;
  
  saveData(data);
};

export const clearUnreadMessages = (userId, requestId) => {
  const data = getData();
  
  if (!data.unreadMessages) {
    data.unreadMessages = {};
    saveData(data);
    return;
  }
  
  const key = `${userId}_${requestId}`;
  if (data.unreadMessages[key]) {
    console.log(`Clearing ${data.unreadMessages[key]} unread messages for ${userId} in request ${requestId}`);
    data.unreadMessages[key] = 0;
    saveData(data);
  }
  
  // Also mark related chat notifications as read
  if (data.notifications) {
    let updated = false;
    data.notifications.forEach(notif => {
      if (notif.requestId === requestId && notif.isChat && !notif.read) {
        if (
          (data.users.some(u => u.id === userId) && notif.userId === userId) ||
          (data.workers.some(w => w.id === userId) && notif.workerId === userId)
        ) {
          notif.read = true;
          updated = true;
        }
      }
    });
    
    if (updated) {
      saveData(data);
    }
  }
};

// Get notifications for a worker
export const getWorkerNotifications = (workerId) => {
  const data = getData();
  
  if (!data.notifications) {
    return [];
  }
  
  return data.notifications
    .filter(notif => notif.workerId === workerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Mark notification as read
export const markNotificationAsRead = (notificationId) => {
  const data = getData();
  
  if (!data.notifications) {
    return;
  }
  
  const notification = data.notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    saveData(data);
  }
};

// Add this function to dataUtils.js
export const debugUnreadMessages = () => {
  const data = getData();
  
  if (!data.unreadMessages) {
    console.log("No unread messages data found");
    return;
  }
  
  console.log("All unread message counts:", data.unreadMessages);
  
  // Count total unread messages
  let totalUnread = 0;
  Object.values(data.unreadMessages).forEach(count => {
    totalUnread += count;
  });
  
  console.log(`Total unread messages across all conversations: ${totalUnread}`);
};

// Get notifications for a user
export const getUserNotifications = (userId) => {
  const data = getData();
  
  if (!data.userNotifications) {
    data.userNotifications = [];
    saveData(data);
    return [];
  }
  
  return data.userNotifications
    .filter(notif => notif.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Mark user notification as read
export const markUserNotificationAsRead = (notificationId) => {
  const data = getData();
  
  if (!data.userNotifications) {
    return;
  }
  
  const notification = data.userNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    saveData(data);
  }
};

// Add this function to clear all users and workers
export const resetAllData = () => {
  // Only allow reset if called from admin panel with proper authentication
  if (!window.isAdminAuthenticated) {
    console.error('Unauthorized data reset attempt');
    return false;
  }
  
  const data = getData();
  
  // Clear data but keep structure
  data.users = [];
  data.workers = [];
  data.requests = [];
  data.chatMessages = [];
  data.notifications = [];
  data.userNotifications = [];
  data.unreadMessages = {};
  
  // Save the cleared data
  localStorage.setItem('appData', JSON.stringify(data));
  
  console.log('All users and workers data has been cleared');
  return true;
}; 