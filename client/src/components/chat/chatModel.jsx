import React, { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
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

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl h-[700px] flex overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side - Chat List */}
        <div 
          className={`${
            selectedConversation ? 'hidden md:flex' : 'flex'
          } w-full md:w-96 border-r border-gray-200 dark:border-gray-700 flex-col`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-green-600 to-emerald-600">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Messages
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Chat List */}
          <ChatList
            conversations={conversations}
            loading={isLoading}
            onSelectConversation={setSelectedConversation}
            currentUserId={currentUserId}
          />
        </div>

        {/* Right Side - Chat Window */}
        <div className={`${selectedConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
          {selectedConversation ? (
            <ChatWindow
              conversation={selectedConversation}
              currentUserId={currentUserId}
              onBack={() => setSelectedConversation(null)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <MessageCircle className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose a chat from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatModal;