import { getSocket } from "@/services/socket";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

const ChatIconNavbar = ({ currentUserId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    // Fetch initial unread count
    fetchUnreadCount();

    // Listen for new messages
    const socket = getSocket();
    socket.on('new_message_notification', () => {
      fetchUnreadCount();
    });

    return () => {
      socket.off('new_message_notification');
    };
  }, [currentUserId]);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/chat/list', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setTotalUnread(data.totalUnread);
      }
    } catch (error) {
      console.error('Error fetching unread:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
      >
        <MessageCircle className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <ChatContainer currentUserId={currentUserId} onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default ChatIconNavbar