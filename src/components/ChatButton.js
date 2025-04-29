import React from 'react';
import { FaComments } from 'react-icons/fa';
import { getUnreadMessageCount } from '../utils/dataUtils';

const ChatButton = ({ requestId, userId, onClick }) => {
  const unreadCount = getUnreadMessageCount(userId, requestId);
  
  console.log(`ChatButton for request ${requestId}, user ${userId}, unread: ${unreadCount}`);
  
  return (
    <button 
      onClick={onClick}
      className="btn-sm btn-primary flex items-center relative"
    >
      <FaComments className="mr-1" />
      <span>Chat</span>
      
      {/* Notification badge */}
      {unreadCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
          {unreadCount}
        </div>
      )}
    </button>
  );
};

export default ChatButton; 