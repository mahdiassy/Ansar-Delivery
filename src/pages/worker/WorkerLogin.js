import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { findWorkerByPhone, createWorker } from '../../utils/dataUtils';
import { showToast } from '../../components/ToastContainer';
import { FaUser, FaPhone, FaTaxi, FaBox, FaImage, FaCamera, FaLock } from 'react-icons/fa';

const WorkerLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [isNewWorker, setIsNewWorker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const fileInputRef = useRef(null);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      showToast('Please enter your phone number', 'error');
      return;
    }
    
    setLoading(true);
    
    if (!isNewWorker) {
      // Existing worker login
      try {
        const worker = findWorkerByPhone(phone);
        
        if (!worker) {
          showToast('No account found with this phone number.', 'error');
          setLoading(false);
          return; // Don't switch to signup mode, just show error
        }
        
        if (worker.password && worker.password !== password) {
          showToast('Incorrect password. Please try again.', 'error');
          setLoading(false);
          return;
        }
        
        if (typeof onLogin === 'function') {
          onLogin(worker);
          navigate('/worker/dashboard');
        } else {
          console.error('onLogin is not a function');
          showToast('Login error. Please try again.', 'error');
          setLoading(false);
        }
      } catch (error) {
        console.error('Login error:', error);
        showToast('Failed to log in. Please try again.', 'error');
        setLoading(false);
      }
    } else {
      // New worker registration
      if (!name.trim()) {
        showToast('Please enter your name', 'error');
        setLoading(false);
        return;
      }
      
      if (!role) {
        showToast('Please select your role', 'error');
        setLoading(false);
        return;
      }
      
      if (!password.trim()) {
        showToast('Please enter a password', 'error');
        setLoading(false);
        return;
      }
      
      if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        setLoading(false);
        return;
      }
      
      try {
        const existingWorker = findWorkerByPhone(phone);
        
        if (existingWorker) {
          showToast('An account with this phone number already exists. Please log in.', 'error');
          setIsNewWorker(false);
          setLoading(false);
          return;
        }
        
        const newWorker = createWorker(name, phone, role, profilePic, password);
        if (typeof onLogin === 'function') {
          onLogin(newWorker);
          showToast('Account created successfully!', 'success');
          navigate('/worker/dashboard');
        } else {
          console.error('onLogin is not a function');
          showToast('Account creation error. Please try again.', 'error');
          setLoading(false);
        }
      } catch (error) {
        console.error('Registration error:', error);
        showToast('Failed to create account. Please try again.', 'error');
        setLoading(false);
      }
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const toggleMode = () => {
    setIsNewWorker(!isNewWorker);
    setName('');
    setRole('');
    setProfilePic(null);
    setPreviewUrl('');
    setPassword('');
    setConfirmPassword('');
  };
  
  return (
    <div className="page-container flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="card p-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isNewWorker ? 'Join as a Service Provider' : 'Welcome Back'}
          </h1>
          
          <form onSubmit={handleLogin} className="login-form space-y-4">
            {isNewWorker && (
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <FaUser className="icon" />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="form-input"
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <div className="input-with-icon">
                <FaPhone className="icon" />
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="form-input"
                  required
                />
              </div>
            </div>
            
            {isNewWorker && (
              <>
                <div>
                  <label className="form-label">Select Your Role</label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <button
                      type="button"
                      onClick={() => setRole('Taxi Driver')}
                      className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all ${
                        role === 'Taxi Driver'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 dark:bg-opacity-20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <FaTaxi className={`h-8 w-8 mb-2 ${role === 'Taxi Driver' ? 'text-primary-500' : 'text-gray-400'}`} />
                      <span className="font-medium">Taxi Driver</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setRole('Delivery')}
                      className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all ${
                        role === 'Delivery'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 dark:bg-opacity-20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <FaBox className={`h-8 w-8 mb-2 ${role === 'Delivery' ? 'text-primary-500' : 'text-gray-400'}`} />
                      <span className="font-medium">Delivery</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Profile Picture</label>
                  <div className="flex items-center space-x-4">
                    <div 
                      onClick={triggerFileInput}
                      className={`w-24 h-24 rounded-full flex items-center justify-center cursor-pointer border-2 border-dashed ${
                        previewUrl ? 'border-transparent' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {previewUrl ? (
                        <img 
                          src={previewUrl} 
                          alt="Profile preview" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <FaCamera className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="btn-secondary text-sm w-full"
                      >
                        <FaImage className="mr-2" />
                        {previewUrl ? 'Change Photo' : 'Upload Photo'}
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        Optional. Max size: 5MB
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </>
            )}
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-with-icon">
                <FaLock className="icon" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="form-input"
                  required
                />
              </div>
            </div>
            
            {isNewWorker && (
              <div>
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <div className="input-with-icon">
                  <FaLock className="icon" />
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="form-input"
                    required
                  />
                </div>
              </div>
            )}
            
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isNewWorker ? 'Create Account' : 'Log In')}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              {isNewWorker ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerLogin; 