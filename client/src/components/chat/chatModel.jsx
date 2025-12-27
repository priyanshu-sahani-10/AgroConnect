import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MessageCircle } from 'lucide-react';
import ChatList from './chatList';
import ChatWindow from './chatWindow';
import { useGetAllConversationsQuery } from '@/features/api/chatApi';
import { getSocket } from '@/services/socket';

const ChatModal = ({ onClose, currentUserId, preSelectedConversation = null }) => {
  const [selectedConversation, setSelectedConversation] = useState(preSelectedConversation);
  const { data, isLoading, refetch } = useGetAllConversationsQuery();
  const conversations = data?.conversations || [];

  useEffect(() => {
    // Authenticate socket
    const socket = getSocket();
    socket.emit('authenticate', currentUserId);

    // Listen for new messages and refresh
    socket.on('new_message_notification', () => {
      refetch();
    });

    return () => {
      socket.off('new_message_notification');
    };
  }, [currentUserId, refetch]);

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[600px] flex overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side - Chat List */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            <ChatList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
              isLoading={isLoading}
              currentUserId={currentUserId}
            />
          </div>
        </div>

        {/* Right Side - Chat Window */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <ChatWindow
              conversation={selectedConversation}
              currentUserId={currentUserId}
              onBack={() => setSelectedConversation(null)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <MessageCircle className="w-16 h-16 text-gray-300" />
              </div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">Select a conversation</h3>
              <p className="text-sm text-gray-400">Choose a chat from the list to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ChatModal;