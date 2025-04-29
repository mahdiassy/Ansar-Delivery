import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaPhone, FaTaxi, FaBox } from 'react-icons/fa';
import Spinner from '../../components/Spinner';

const WorkerProfile = ({ worker, setCurrentWorker }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setLoading(true);
      setTimeout(() => {
        localStorage.removeItem('currentWorker');
        setCurrentWorker(null);
        navigate('/');
      }, 500);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto card">
        <h1 className="text-2xl font-bold text-center mb-6">Worker Profile</h1>
        
        <div className="flex flex-col items-center mb-6">
          {worker.profilePic ? (
            <img 
              src={worker.profilePic} 
              alt={worker.name} 
              className="w-32 h-32 rounded-full object-cover border-4 border-primary"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-primary">
              <FaUser className="h-16 w-16 text-gray-400" />
            </div>
          )}
          <h2 className="text-xl font-semibold mt-4">{worker.name}</h2>
          <div className="flex items-center mt-1 text-gray-600">
            <FaPhone className="mr-1" />
            <span>{worker.phone}</span>
          </div>
          <div className="mt-2 flex items-center">
            {worker.role === 'Taxi Driver' ? (
              <>
                <FaTaxi className="mr-2 text-primary" />
                <span>Taxi Driver</span>
              </>
            ) : (
              <>
                <FaBox className="mr-2 text-primary" />
                <span>Delivery Worker</span>
              </>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-semibold mb-2">Account Information</h3>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Member since:</span> {new Date(worker.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Worker ID:</span> #{worker.id.split('_')[1]}
          </p>
        </div>
        
        <div className="mt-8">
          <button 
            onClick={() => navigate('/worker/dashboard')}
            className="btn-secondary w-full mb-3"
          >
            Back to Dashboard
          </button>
          <button 
            onClick={handleLogout}
            className="btn-danger w-full flex justify-center"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : 'Logout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile; 