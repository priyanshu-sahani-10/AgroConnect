import { getSocket } from "@/services/socket";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import ChatModal from "./chatModel"; // Import your ChatModal component

const ChatIconNavbar = ({ currentUserId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    // Fetch initial unread count
    fetchUnreadCount();

    // Listen for new messages and message read events
    const socket = getSocket();
    
    socket.on('new_message_notification', () => {
      fetchUnreadCount();
    });

    socket.on('message_read', () => {
      fetchUnreadCount();
    });

    socket.on('conversation_read', () => {
      fetchUnreadCount();
    });

    return () => {
      socket.off('new_message_notification');
      socket.off('message_read');
      socket.off('conversation_read');
    };
  }, [currentUserId]);

  // Refetch unread count when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      fetchUnreadCount();
    }
  }, [isOpen]);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/chat/list', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setTotalUnread(data.totalUnread || 0);
      }
    } catch (error) {
      console.error('Error fetching unread:', error);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Refetch unread count when closing modal
    fetchUnreadCount();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        aria-label="Open chat"
      >
        <MessageCircle className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Chat
        </span>
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {totalUnread > 99 ? '99+' : totalUnread}
          </span>
        )}
      </button>

      {isOpen && (
        <ChatModal 
          currentUserId={currentUserId} 
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default ChatIconNavbar;