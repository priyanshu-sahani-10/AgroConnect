import { useEffect, useState } from "react";
import { MessageCircle, Circle } from "lucide-react";
import { getSocket } from "@/services/socket";

const ChatList = ({
  conversations = [],
  loading,
  onSelectConversation,
  currentUserId,
  activeConversationId,
}) => {
  const [localConversations, setLocalConversations] = useState([]);

  // 🔹 Sync props → local state
  useEffect(() => {
    setLocalConversations(conversations);
  }, [conversations]);

  // 🔹 Socket listener for read updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onMessagesRead = ({ conversationId }) => {
      setLocalConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId ? { ...c, unreadCount: 0 } : c
        )
      );
    };

    socket.on("messages_read", onMessagesRead);

    return () => {
      socket.off("messages_read", onMessagesRead);
    };
  }, []);

  const formatTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const msgDate = new Date(date);
    const diff = now - msgDate;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes < 1 ? "Just now" : `${minutes}m ago`;
    } else if (hours < 24) {
      return msgDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (hours < 48) {
      return "Yesterday";
    } else {
      return msgDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading chats...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
      {localConversations.length === 0 ? (
        <div className="p-8 text-center">
          <MessageCircle className="w-10 h-10 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            No conversations yet
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {localConversations.map((conv) => {
            const isActive = conv._id === activeConversationId;

            return (
              <div
                key={conv._id}
                onClick={() => {
                  const socket = getSocket();

                  onSelectConversation(conv);

                  socket?.emit("mark_as_read", {
                    conversationId: conv._id,
                  });

                  // Optimistic UI update
                  setLocalConversations((prev) =>
                    prev.map((c) =>
                      c._id === conv._id
                        ? { ...c, unreadCount: 0 }
                        : c
                    )
                  );
                }}
                className={`p-4 cursor-pointer transition ${
                  isActive
                    ? "bg-green-100 dark:bg-green-900/30"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-green-500 dark:bg-green-700 text-white flex items-center justify-center font-bold">
                      {conv.otherUser?.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <Circle className="absolute bottom-0 right-0 w-3 h-3 fill-green-500 text-green-500 bg-gray-100 dark:bg-gray-900 rounded-full" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold truncate text-gray-900 dark:text-gray-100">
                        {conv.otherUser?.name || "Unknown"}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(conv.lastMessageAt)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                      <p
                        className={`text-sm truncate ${
                          conv.unreadCount > 0
                            ? "font-semibold text-gray-900 dark:text-gray-100"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {conv.lastMessage || "Tap to open chat"}
                      </p>

                      {conv.unreadCount > 0 && (
                        <span className="min-w-[20px] h-5 px-2 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                          {conv.unreadCount > 99
                            ? "99+"
                            : conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatList;
