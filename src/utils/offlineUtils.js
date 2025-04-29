// Create a utility for offline support

export const checkOnlineStatus = () => {
  return navigator.onLine;
};

export const setupOfflineListener = (onOffline, onOnline) => {
  window.addEventListener('online', () => {
    if (onOnline) onOnline();
  });
  
  window.addEventListener('offline', () => {
    if (onOffline) onOffline();
  });
  
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

export const queueOfflineAction = (action) => {
  const offlineQueue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
  offlineQueue.push({
    action,
    timestamp: Date.now()
  });
  localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
};

export const processOfflineQueue = () => {
  const offlineQueue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
  if (offlineQueue.length === 0) return;
  
  // Process each queued action
  // This is a placeholder - you would implement the actual processing logic
  console.log('Processing offline queue:', offlineQueue);
  
  // Clear the queue after processing
  localStorage.setItem('offlineQueue', '[]');
}; 