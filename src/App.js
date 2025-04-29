import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserLogin from './pages/user/UserLogin';
import UserDashboard from './pages/user/UserDashboard';
import ChooseService from './pages/user/ChooseService';
import WorkerLogin from './pages/worker/WorkerLogin';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import WorkerProfile from './pages/worker/WorkerProfile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import { ThemeProvider } from './contexts/ThemeContext';
import { findUserById, findWorkerById } from './utils/dataUtils';
import AdminPanel from './pages/admin/AdminPanel';
import NotFound from './pages/NotFound';
import { initPerformanceMonitoring } from './utils/analytics';
import { setupOfflineListener, processOfflineQueue } from './utils/offlineUtils';
import { showToast } from './components/ToastContainer';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  const [user, setUser] = useState(null);
  const [worker, setWorker] = useState(null);
  
  // Check for saved login on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedWorker = localStorage.getItem('currentWorker');
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Verify the user still exists in our data
        const userData = findUserById(parsedUser.id);
        if (userData) {
          setUser(userData);
        } else {
          // User no longer exists, clear the saved data
          localStorage.removeItem('currentUser');
        }
      } catch (e) {
        console.error("Error parsing saved user:", e);
        localStorage.removeItem('currentUser');
      }
    }
    
    if (savedWorker) {
      try {
        const parsedWorker = JSON.parse(savedWorker);
        // Verify the worker still exists in our data
        const workerData = findWorkerById(parsedWorker.id);
        if (workerData) {
          setWorker(workerData);
        } else {
          // Worker no longer exists, clear the saved data
          localStorage.removeItem('currentWorker');
        }
      } catch (e) {
        console.error("Error parsing saved worker:", e);
        localStorage.removeItem('currentWorker');
      }
    }
  }, []);
  
  const handleUserLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };
  
  const handleWorkerLogin = (workerData) => {
    setWorker(workerData);
    localStorage.setItem('currentWorker', JSON.stringify(workerData));
  };
  
  const handleLogout = () => {
    setUser(null);
    setWorker(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentWorker');
  };
  
  const AdminRoute = ({ element }) => {
    // Check if the route is being accessed from a known IP (in production)
    // For now, we'll just add a basic check
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    
    if (!isLocalhost) {
      // Log suspicious access attempt
      console.warn('Admin panel access attempt from non-localhost');
      return <Navigate to="/" replace />;
    }
    
    return element;
  };
  
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring();
    
    // Setup offline/online listeners
    const cleanup = setupOfflineListener(
      () => {
        showToast('You are offline. Some features may be limited.', 'warning');
      },
      () => {
        showToast('You are back online!', 'success');
        processOfflineQueue();
      }
    );
    
    return () => {
      cleanup();
    };
  }, []);
  
  return (
    <LanguageProvider>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col safe-top safe-bottom">
          <Router>
            <Navbar 
              userType={user ? 'user' : (worker ? 'worker' : null)}
              user={user}
              worker={worker}
              onLogout={handleLogout}
            />
            
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                
                {/* User Routes */}
                <Route 
                  path="/user/login" 
                  element={
                    user ? (
                      <Navigate to="/user/dashboard" replace />
                    ) : (
                      <UserLogin onLogin={handleUserLogin} />
                    )
                  } 
                />
                <Route 
                  path="/user/dashboard" 
                  element={
                    user ? (
                      <UserDashboard user={user} />
                    ) : (
                      <Navigate to="/user/login" replace />
                    )
                  } 
                />
                <Route 
                  path="/user/choose-service" 
                  element={
                    user ? (
                      <ChooseService user={user} />
                    ) : (
                      <Navigate to="/user/login" replace />
                    )
                  } 
                />
                
                {/* Worker Routes */}
                <Route 
                  path="/worker/login" 
                  element={
                    worker ? (
                      <Navigate to="/worker/dashboard" replace />
                    ) : (
                      <WorkerLogin onLogin={handleWorkerLogin} />
                    )
                  } 
                />
                <Route 
                  path="/worker/dashboard" 
                  element={
                    worker ? (
                      <WorkerDashboard worker={worker} />
                    ) : (
                      <Navigate to="/worker/login" replace />
                    )
                  } 
                />
                <Route 
                  path="/worker/profile" 
                  element={
                    worker ? (
                      <WorkerProfile worker={worker} />
                    ) : (
                      <Navigate to="/worker/login" replace />
                    )
                  } 
                />
                
                {/* Admin Route */}
                <Route path="/admin" element={<AdminRoute element={<AdminPanel />} />} />
                
                {/* Fallback route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            <Footer />
            <ToastContainer />
          </Router>
        </div>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App; 