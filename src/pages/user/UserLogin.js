import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findUserByPhone, createUser } from '../../utils/dataUtils';
import { showToast } from '../../components/ToastContainer';
import { FaUser, FaPhone, FaMapMarkerAlt, FaLock } from 'react-icons/fa';

const UserLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      showToast('Please enter your phone number', 'error');
      return;
    }
    
    setLoading(true);
    
    if (!isNewUser) {
      // Existing user login
      try {
        const user = findUserByPhone(phone);
        
        if (!user) {
          showToast('No account found with this phone number.', 'error');
          setLoading(false);
          return;
        }
        
        if (user.password && user.password !== password) {
          showToast('Incorrect password. Please try again.', 'error');
          setLoading(false);
          return;
        }
        
        if (typeof onLogin === 'function') {
          onLogin(user);
          navigate('/user/dashboard');
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
      // New user registration
      if (!name.trim()) {
        showToast('Please enter your name', 'error');
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
      
      if (!address.trim()) {
        showToast('Please enter your address', 'error');
        setLoading(false);
        return;
      }
      
      try {
        const existingUser = findUserByPhone(phone);
        
        if (existingUser) {
          showToast('An account with this phone number already exists. Please log in.', 'error');
          setIsNewUser(false);
          setLoading(false);
          return;
        }
        
        const newUser = createUser(name, phone, password, address);
        
        if (typeof onLogin === 'function') {
          onLogin(newUser);
          showToast('Account created successfully!', 'success');
          navigate('/user/dashboard');
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
  
  const toggleMode = () => {
    setIsNewUser(!isNewUser);
    setName('');
    setPassword('');
    setConfirmPassword('');
    setAddress('');
  };
  
  return (
    <div className="page-container flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="card p-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isNewUser ? 'Create an Account' : 'Welcome Back'}
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {isNewUser && (
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
                    required={isNewUser}
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="phone" className="label">Phone Number</label>
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
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-with-icon">
                <FaLock className="icon" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="form-input"
                  required
                />
              </div>
            </div>
            
            {isNewUser && (
              <>
                <div className="form-group">
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
                
                <div className="form-group">
                  <label htmlFor="address" className="form-label">Address</label>
                  <div className="input-with-icon">
                    <FaMapMarkerAlt className="icon" />
                    <input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Your address"
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              </>
            )}
            
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isNewUser ? 'Create Account' : 'Log In')}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              {isNewUser ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin; 