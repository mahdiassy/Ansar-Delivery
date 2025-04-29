import React, { useState, useEffect } from 'react';
import Toast from './Toast';

// Create a global toast manager
let toastManager = {
  toasts: [],
  listeners: [],
  addToast: function(toast) {
    const id = Date.now();
    this.toasts = [...this.toasts, { ...toast, id }];
    this.notifyListeners();
    return id;
  },
  removeToast: function(id) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notifyListeners();
  },
  subscribe: function(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },
  notifyListeners: function() {
    this.listeners.forEach(listener => listener(this.toasts));
  }
};

// Export functions to show toasts
export const showToast = (message, type = 'success', duration = 3000) => {
  return toastManager.addToast({ message, type, duration });
};

export const removeToast = (id) => {
  toastManager.removeToast(id);
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  
  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return unsubscribe;
  }, []);
  
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer; 