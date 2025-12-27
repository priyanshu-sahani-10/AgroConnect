import { getSocket } from "@/services/socket";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import ChatModal from "./chatModel";
import { useGetAllConversationsQuery } from "@/features/api/chatApi";

const ChatIconNavbar = ({ currentUserId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);

  const { data, refetch } = useGetAllConversationsQuery();

  // 🔁 Update unread when API data changes
  useEffect(() => {
    console.log("Unread data updated:", data);
    if (data?.success) {
      setTotalUnread(data.totalUnread || 0);
    }
  }, [data]);

  // 🔌 Socket listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const refreshUnread = () => {
      refetch(); // ✅ correct
    };

    socket.on("new_message_notification", refreshUnread);
    socket.on("messages_read", refreshUnread);

    return () => {
      socket.off("new_message_notification", refreshUnread);
      socket.off("messages_read", refreshUnread);
    };
  }, [currentUserId, refetch]);

  // 🪟 When modal closes, refresh unread
  useEffect(() => {
    if (!isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Chat</span>

        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {totalUnread > 99 ? "99+" : totalUnread}
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
