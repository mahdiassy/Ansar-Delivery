import React, { useState, useEffect } from 'react';
import { 
  getWorkerRequests, 
  updateRequestStatus, 
  logRequestsStatus,
  getWorkerNotifications,
  markNotificationAsRead,
  debugUnreadMessages
} from '../../utils/dataUtils';
import { showToast } from '../../components/ToastContainer';
import RequestCard from '../../components/RequestCard';
import Chat from '../../components/Chat';
import EmptyState from '../../components/EmptyState';
import { 
  FaListAlt, 
  FaCheck, 
  FaTimes, 
  FaCheckCircle, 
  FaSyncAlt,
  FaBell
} from 'react-icons/fa';
import ChatButton from '../../components/ChatButton';

const WorkerDashboard = ({ worker }) => {
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadRequests();
    loadNotifications();
    
    // Set up polling for new requests and notifications
    const interval = setInterval(() => {
      loadRequests(false);
      loadNotifications();
      checkForNewNotifications();
    }, 15000); // Poll every 15 seconds
    
    return () => clearInterval(interval);
  }, [worker]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const loadNotifications = () => {
    try {
      const workerNotifications = getWorkerNotifications(worker.id);
      setNotifications(workerNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };
  
  const handleNotificationClick = (notification) => {
    // Mark as read
    markNotificationAsRead(notification.id);
    
    // Find the request
    const request = requests.find(req => req.id === notification.requestId);
    if (request) {
      // Scroll to the request or highlight it
      const element = document.getElementById(`request-${request.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.classList.add('highlight-card');
        setTimeout(() => {
          element.classList.remove('highlight-card');
        }, 2000);
      }
    }
    
    // Refresh notifications
    loadNotifications();
    setShowNotifications(false);
  };
  
  const loadRequests = (showLoadingState = true) => {
    if (showLoadingState) setLoading(true);
    
    try {
      debugUnreadMessages(); // Debug unread messages
      const workerRequests = getWorkerRequests(worker.id, worker.role);
      setRequests(workerRequests);
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
  
  const handleAcceptRequest = (requestId) => {
    try {
      const success = updateRequestStatus(requestId, 'Accepted', worker.id);
      
      if (success) {
        showToast('Request accepted successfully!', 'success');
        loadRequests();
      } else {
        showToast('Failed to accept request', 'error');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      showToast('Failed to accept request', 'error');
    }
  };
  
  const handleCompleteRequest = (requestId) => {
    try {
      console.log('Before completing request:');
      logRequestsStatus();
      
      const success = updateRequestStatus(requestId, 'Completed', worker.id);
      
      if (success) {
        showToast('Request marked as completed!', 'success');
        
        console.log('After completing request:');
        logRequestsStatus();
        
        loadRequests();
        
        if (selectedRequest && selectedRequest.id === requestId) {
          setSelectedRequest(null);
          setShowChat(false);
        }
      } else {
        showToast('Failed to complete request', 'error');
      }
    } catch (error) {
      console.error('Error completing request:', error);
      showToast('Failed to complete request', 'error');
    }
  };
  
  const handleChatToggle = (request) => {
    setSelectedRequest(request);
    setShowChat(true);
  };
  
  const handleCloseChat = () => {
    setShowChat(false);
  };
  
  const pendingRequests = requests.filter(req => req.status === 'Pending');
  const activeRequests = requests.filter(req => req.status === 'Accepted');
  const completedRequests = requests.filter(req => req.status === 'Completed');
  
  const checkForNewNotifications = () => {
    const unreadCount = notifications.filter(n => !n.read).length;
    
    // If there are new notifications, show a toast
    if (unreadCount > 0 && !showNotifications) {
      // Play notification sound if available
      const notificationSound = document.getElementById('notification-sound');
      if (notificationSound) {
        notificationSound.play().catch(e => console.log('Could not play notification sound', e));
      }
      
      showToast(`You have ${unreadCount} new notification${unreadCount > 1 ? 's' : ''}`, 'info');
    }
  };
  
  return (
    <div className="page-container mobile-container">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
          <h1 className="page-title">Worker Dashboard</h1>
          <div className="flex items-center space-x-2">
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="btn-icon relative"
                title="Notifications"
              >
                <FaBell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              
              {/* Notification dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 max-h-96 overflow-y-auto">
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700 font-medium">
                    Notifications
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No notifications
                    </div>
                  ) : (
                    <div>
                      {notifications.map(notification => (
                        <div 
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' : ''
                          }`}
                        >
                          <div className="text-sm font-medium">{notification.message}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button
              onClick={handleManualRefresh}
              className="btn-icon"
              title="Refresh requests"
            >
              <FaSyncAlt className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="card p-8 text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p>Loading requests...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {pendingRequests.length > 0 && (
              <div>
                <h2 className="section-title flex items-center">
                  <FaListAlt className="mr-2" />
                  Available Requests
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingRequests.map(request => (
                    <RequestCard
                      key={request.id}
                      id={`request-${request.id}`}
                      request={request}
                      currentUserId={worker.id}
                      actions={[
                        {
                          label: 'Accept',
                          icon: <FaCheck />,
                          onClick: () => handleAcceptRequest(request.id),
                          className: 'btn-success'
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
                  <FaCheck className="mr-2" />
                  Active Requests
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeRequests.map(request => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      currentUserId={worker.id}
                      actions={[
                        {
                          component: <ChatButton 
                            requestId={request.id} 
                            userId={worker.id} 
                            onClick={() => handleChatToggle(request)} 
                          />,
                          type: 'custom'
                        },
                        {
                          label: 'Complete',
                          icon: <FaCheckCircle />,
                          onClick: () => handleCompleteRequest(request.id),
                          className: 'btn-success'
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
                  <FaCheckCircle className="mr-2" />
                  Completed Requests
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
                      View All Completed Requests
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {requests.length === 0 && (
              <EmptyState
                icon={<FaListAlt className="h-16 w-16" />}
                title="No Requests Yet"
                description={`No ${worker.role === 'Taxi Driver' ? 'taxi' : 'delivery'} requests are available at the moment. Check back later.`}
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
                Chat with {selectedRequest.userName || 'User'}
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
                senderId={worker.id}
                senderName={worker.name}
                recipientId={selectedRequest.userId}
                recipientName={selectedRequest.userName || 'User'}
                onClose={handleCloseChat}
              />
            </div>
          </div>
        </div>
      )}
      
      <audio id="notification-sound" src="/notification.mp3" preload="auto"></audio>
    </div>
  );
};

export default WorkerDashboard; 