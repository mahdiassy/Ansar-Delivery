import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserRequests, cancelRequest } from '../../utils/dataUtils';
import { showToast } from '../../components/ToastContainer';
import { useLanguage } from '../../contexts/LanguageContext';
import RequestCard from '../../components/RequestCard';
import Chat from '../../components/Chat';
import EmptyState from '../../components/EmptyState';
import { FaPlus, FaTimes, FaListAlt, FaCheckCircle, FaSyncAlt } from 'react-icons/fa';
import ChatButton from '../../components/ChatButton';
import SimpleNotificationBell from '../../components/SimpleNotificationBell';

const UserDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadRequests();
    
    // Set up polling for request updates
    const interval = setInterval(() => {
      loadRequests(false);
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    const handleOpenChat = (event) => {
      const requestId = event.detail.requestId;
      const request = requests.find(req => req.id === requestId);
      if (request) {
        handleChatToggle(request);
      }
    };
    
    window.addEventListener('openChat', handleOpenChat);
    
    return () => {
      window.removeEventListener('openChat', handleOpenChat);
    };
  }, [requests]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const loadRequests = (showLoadingState = true) => {
    if (showLoadingState) setLoading(true);
    
    try {
      const userRequests = getUserRequests(user.id);
      setRequests(userRequests);
    } catch (error) {
      console.error('Error loading requests:', error);
      showToast('Failed to load requests', 'error');
    } finally {
      if (showLoadingState) setLoading(false);
    }
  };
  
  const handleManualRefresh = () => {
    loadRequests();
    showToast('Requests refreshed', 'success');
  };
  
  const handleCancelRequest = (requestId) => {
    try {
      const success = cancelRequest(requestId);
      
      if (success) {
        showToast('Request cancelled successfully!', 'success');
        loadRequests();
      } else {
        showToast('Failed to cancel request', 'error');
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      showToast('Failed to cancel request', 'error');
    }
  };
  
  const handleChatToggle = (request) => {
    if (!request.workerId) {
      showToast('No worker has accepted this request yet', 'info');
      return;
    }
    
    setSelectedRequest(request);
    setShowChat(true);
  };
  
  const handleCloseChat = () => {
    setShowChat(false);
  };
  
  const pendingRequests = requests.filter(req => req.status === 'Pending');
  const activeRequests = requests.filter(req => req.status === 'Accepted');
  const completedRequests = requests.filter(req => req.status === 'Completed');
  
  return (
    <div className="page-container mobile-container">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
          <h1 className="page-title">{t('myRequests')}</h1>
          <div className="flex space-x-2">
            <SimpleNotificationBell userId={user.id} />
            <button
              onClick={() => navigate('/user/choose-service')}
              className="btn-primary flex-grow sm:flex-grow-0"
            >
              <FaPlus className="mr-2" />
              {t('newRequest')}
            </button>
            <button
              onClick={handleManualRefresh}
              className="btn-icon"
              title={t('refreshRequests')}
            >
              <FaSyncAlt className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="card p-8 text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p>{t('loadingRequests')}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {pendingRequests.length > 0 && (
              <div className="mb-6">
                <h2 className="section-title flex items-center text-base sm:text-lg">
                  <FaListAlt className="ml-2" />
                  {t('pendingRequests')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {pendingRequests.map(request => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      currentUserId={user.id}
                      actions={[
                        {
                          label: 'Cancel',
                          icon: <FaTimes />,
                          onClick: () => handleCancelRequest(request.id),
                          className: 'btn-danger'
                        }
                      ]}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {activeRequests.length > 0 && (
              <div>
                <h2 className="section-title flex items-center">
                  <FaListAlt className="ml-2" />
                  {t('activeRequests')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeRequests.map(request => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      currentUserId={user.id}
                      actions={[
                        {
                          component: <ChatButton 
                            requestId={request.id} 
                            userId={user.id} 
                            onClick={() => handleChatToggle(request)} 
                          />,
                          type: 'custom'
                        }
                      ]}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {completedRequests.length > 0 && (
              <div>
                <h2 className="section-title flex items-center">
                  <FaCheckCircle className="ml-2" />
                  {t('completedRequests')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedRequests.slice(0, 4).map(request => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      actions={[]}
                    />
                  ))}
                </div>
                {completedRequests.length > 4 && (
                  <div className="text-center mt-4">
                    <button className="btn-text">
                      {t('viewAllCompleted')}
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {requests.length === 0 && (
              <EmptyState
                icon={<FaListAlt className="h-16 w-16" />}
                title={t('noRequestsYet')}
                description={t('noRequestsDesc')}
                action={{
                  label: t('createRequest'),
                  onClick: () => navigate('/user/choose-service')
                }}
              />
            )}
          </div>
        )}
      </div>
      
      {showChat && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-base sm:text-lg font-semibold truncate">
                {t('chatWith', { name: selectedRequest.workerName || t('worker') })}
              </h2>
              <button
                onClick={handleCloseChat}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-grow overflow-hidden">
              <Chat
                requestId={selectedRequest.id}
                senderId={user.id}
                senderName={user.name || 'You'}
                recipientId={selectedRequest.workerId}
                recipientName={selectedRequest.workerName || 'Worker'}
                onClose={handleCloseChat}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard; 