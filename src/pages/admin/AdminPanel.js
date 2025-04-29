import React, { useState } from 'react';
import { resetAllData } from '../../utils/dataUtils';
import { showToast } from '../../components/ToastContainer';
import { FaShieldAlt, FaTrash, FaLock, FaExclamationTriangle } from 'react-icons/fa';
import { checkRateLimit } from '../../utils/securityUtils';

const AdminPanel = () => {
  const [password, setPassword] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  
  const handleAuthenticate = () => {
    // Check rate limit
    if (!checkRateLimit()) {
      showToast('Too many login attempts. Try again later.', 'error');
      return;
    }
    
    // In production, use environment variable or secure backend authentication
    const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || 'admin123secure';
    
    if (password === adminPassword) {
      setAuthenticated(true);
      window.isAdminAuthenticated = true;
      showToast('Authentication successful', 'success');
    } else {
      showToast('Invalid admin password', 'error');
      // Log failed attempt (in production, you'd log this to your server)
      console.warn('Failed admin authentication attempt');
    }
  };
  
  const handleReset = () => {
    if (authenticated) {
      const success = resetAllData();
      if (success) {
        showToast('All data has been reset successfully', 'success');
        setConfirmed(false);
      } else {
        showToast('Error resetting data', 'error');
      }
    } else {
      showToast('You must authenticate first', 'error');
    }
  };
  
  const handleLogout = () => {
    setAuthenticated(false);
    setConfirmed(false);
    setPassword('');
    window.isAdminAuthenticated = false;
    showToast('Logged out of admin panel', 'info');
  };
  
  const handleBackupData = () => {
    if (authenticated) {
      try {
        const data = JSON.parse(localStorage.getItem('appData') || '{}');
        
        // Create a downloadable file
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
        
        const exportFileDefaultName = `10min_backup_${new Date().toISOString().slice(0, 10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showToast('Data backup created successfully', 'success');
      } catch (error) {
        console.error('Error creating backup:', error);
        showToast('Error creating backup', 'error');
      }
    } else {
      showToast('You must authenticate first', 'error');
    }
  };
  
  const handleRestoreData = (event) => {
    if (authenticated) {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          // Validate the data structure
          if (!data.users || !data.workers || !data.requests) {
            showToast('Invalid backup file format', 'error');
            return;
          }
          
          // Restore the data
          localStorage.setItem('appData', JSON.stringify(data));
          showToast('Data restored successfully', 'success');
        } catch (error) {
          console.error('Error restoring data:', error);
          showToast('Error restoring data', 'error');
        }
      };
      reader.readAsText(file);
    } else {
      showToast('You must authenticate first', 'error');
    }
  };
  
  return (
    <div className="page-container">
      <div className="max-w-md mx-auto">
        <h1 className="page-title mb-6 flex items-center">
          <FaShieldAlt className="mr-2" />
          Admin Panel
        </h1>
        
        <div className="card p-6">
          {!authenticated ? (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  This area is restricted to administrators only. Please authenticate to continue.
                </p>
              </div>
              
              <div className="form-group">
                <label className="form-label">Admin Password</label>
                <div className="input-with-icon">
                  <span className="icon">
                    <FaLock className="h-5 w-5" />
                  </span>
                  <input
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                  />
                </div>
              </div>
              
              <button
                className="btn-primary w-full"
                onClick={handleAuthenticate}
              >
                Authenticate
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                <p className="text-green-800 dark:text-green-300 text-sm">
                  You are authenticated as an administrator. Be careful with these actions.
                </p>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h2 className="text-lg font-semibold mb-2 flex items-center">
                  <FaTrash className="mr-2 text-red-500" />
                  Data Management
                </h2>
                
                {!confirmed ? (
                  <button
                    className="btn-danger w-full"
                    onClick={() => setConfirmed(true)}
                  >
                    Reset All Data
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <div className="flex items-start">
                        <FaExclamationTriangle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-red-600 dark:text-red-400 text-sm">
                          <strong>WARNING:</strong> This will delete all users, workers, requests, and messages.
                          This action cannot be undone and will log out all users.
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="btn-secondary flex-1"
                        onClick={() => setConfirmed(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-danger flex-1"
                        onClick={handleReset}
                      >
                        Confirm Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  className="btn-secondary w-full"
                  onClick={handleLogout}
                >
                  Logout from Admin Panel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 