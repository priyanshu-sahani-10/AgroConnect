import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, ArrowLeft, Circle, Check, CheckCheck } from 'lucide-react';
import { io } from 'socket.io-client';
import ChatIconNavbar from '../chat/chatIconNavbar';

// ================================================================
// 1️⃣ SOCKET.IO CLIENT SETUP
// ================================================================

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      transports: ['websocket'],
      reconnection: true,
    });
  }
  return socket;
};


export const ChatContainer = ({ currentUserId, onClose }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();

    // Authenticate socket
    const socket = getSocket();
    socket.emit('authenticate', currentUserId);

    // Listen for new messages
    socket.on('new_message_notification', (data) => {
      fetchConversations(); // Refresh list
    });

    return () => {
      socket.off('new_message_notification');
    };
  }, [currentUserId]);

const fetchConversations = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/chat/list', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-4 top-16 w-full max-w-4xl h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex overflow-hidden">
      {/* Chat List */}
      <div className={`${selectedConversation ? 'hidden md:block' : 'block'} w-full md:w-80 border-r border-gray-200 dark:border-gray-700`}>
        <ChatList
          conversations={conversations}
          loading={loading}
          onSelectConversation={setSelectedConversation}
          onClose={onClose}
        />
      </div>

      {/* Chat Window */}
      <div className={`${selectedConversation ? 'block' : 'hidden md:block'} flex-1`}>
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            currentUserId={currentUserId}
            onBack={() => setSelectedConversation(null)}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ================================================================
// 4️⃣ CHAT LIST COMPONENT (WhatsApp-style Inbox)
// ================================================================



// ================================================================
// 5️⃣ CHAT WINDOW COMPONENT (Messages View)
// ================================================================



// ================================================================
// 6️⃣ DEMO - Replace with your actual user ID
// ================================================================

export default function ChatDemo() {
  // Replace with actual user ID from your auth
  const currentUserId = "YOUR_USER_ID_HERE";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">AgroConnect</h1>
          <ChatIconNavbar currentUserId={currentUserId} />
        </div>
      </div>
    </div>
  );
}