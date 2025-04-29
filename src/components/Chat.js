import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { getChatMessages, addChatMessage, clearUnreadMessages } from '../utils/dataUtils';
import Spinner from './Spinner';
import { showToast } from '../components/ToastContainer';

const Chat = ({ requestId, senderId, senderName, recipientId, recipientName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const messagesEndRef = useRef(null);
  const notificationSound = useRef(null);

  const loadMessages = () => {
    try {
      const chatMessages = getChatMessages(requestId);
      
      // Check if we have new messages
      if (chatMessages.length > lastMessageCount && lastMessageCount > 0) {
        // Find messages not from the current user
        const newMessages = chatMessages.slice(lastMessageCount).filter(
          msg => msg.senderId !== senderId
        );
        
        if (newMessages.length > 0) {
          // Play notification sound
          if (notificationSound.current) {
            notificationSound.current.play().catch(e => 
              console.log('Could not play notification sound', e)
            );
          }
          
          // Show toast notification
          showToast(`${recipientName} sent ${newMessages.length} new message${newMessages.length > 1 ? 's' : ''}`, 'info');
        }
      }
      
      setLastMessageCount(chatMessages.length);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadMessages();
    
    // Clear unread messages when chat is opened
    clearUnreadMessages(senderId, requestId);
    console.log(`Clearing unread messages for ${senderId} in request ${requestId}`);
    
    // Set up polling for new messages
    const interval = setInterval(() => {
      loadMessages();
      // Also clear unread messages on each poll when the chat is open
      clearUnreadMessages(senderId, requestId);
    }, 5000); // Poll every 5 seconds
    
    return () => clearInterval(interval);
  }, [requestId, senderId]); // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const message = {
      id: `msg_${Date.now()}`,
      requestId,
      senderId,
      senderName,
      recipientId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString()
    };
    
    addChatMessage(message);
    setNewMessage('');
    loadMessages();
  };
  
  // Format timestamp to a readable format
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      {/* Audio element for notification sound */}
      <audio ref={notificationSound} src="/message.mp3" preload="auto"></audio>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-4">
            <p className="mb-2">No messages yet</p>
            <p className="text-sm">Start the conversation by sending a message below</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === senderId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 ${
                  message.senderId === senderId
                    ? 'bg-primary-500 text-white rounded-tr-none'
                    : 'bg-gray-200 dark:bg-gray-700 rounded-tl-none'
                }`}
              >
                <div className="text-xs opacity-75 mb-1">
                  {message.senderId === senderId ? 'You' : recipientName}
                </div>
                <p className="text-sm sm:text-base break-words">{message.content}</p>
                <div className="text-xs opacity-75 text-right mt-1">
                  {formatMessageTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="flex items-center p-3 border-t border-gray-200 dark:border-gray-700">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={`Message ${recipientName}...`}
          className="form-input flex-1 mr-2 text-sm sm:text-base"
        />
        <button 
          type="submit"
          className="btn-icon bg-primary-500 hover:bg-primary-600 text-white"
          disabled={!newMessage.trim()}
          aria-label="Send message"
        >
          <FaPaperPlane className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default Chat; 