import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, MessageCircle, ArrowLeft } from "lucide-react";
import ChatList from "./chatList";
import ChatWindow from "./chatWindow";
import { useGetAllConversationsQuery } from "@/features/api/chatApi";
import { getSocket } from "@/services/socket";

const ChatModal = ({
  onClose,
  currentUserId,
  preSelectedConversation = null,
}) => {
  const [selectedConversation, setSelectedConversation] = useState(
    preSelectedConversation
  );

  const { data, isLoading, refetch } = useGetAllConversationsQuery();
  const conversations = data?.conversations || [];

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("authenticate", currentUserId);
    socket.on("new_message_notification", refetch);

    return () => socket.off("new_message_notification");
  }, [currentUserId, refetch]);

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full h-full md:h-[600px] md:max-w-5xl
          bg-white dark:bg-gray-900
          flex flex-col md:flex-row
          overflow-hidden
          ${selectedConversation ? "md:rounded-lg" : ""}
        `}
      >
        {/* LEFT PANEL — Chat List */}
        <div
          className={`
            flex flex-col
            w-full md:w-80
            border-r border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-800
            ${selectedConversation ? "hidden md:flex" : "flex"}
          `}
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between
                          border-b border-gray-200 dark:border-gray-700
                          bg-white dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Messages
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600
                         dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            <ChatList
              conversations={conversations}
              loading={isLoading}
              onSelectConversation={setSelectedConversation}
              currentUserId={currentUserId}
              activeConversationId={selectedConversation?._id}
            />
          </div>
        </div>

        {/* RIGHT PANEL — Chat Window */}
        <div
          className={`
            flex-1 flex flex-col
            bg-white dark:bg-gray-900
            overflow-hidden
            ${!selectedConversation ? "hidden md:flex" : "flex"}
          `}
        >
          {selectedConversation ? (
            <>
              {/* Mobile Back Header */}
              <div className="md:hidden flex items-center gap-2 px-4 py-3
                              border-b border-gray-200 dark:border-gray-700
                              flex-shrink-0">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                </button>
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {selectedConversation.otherUser?.name || "Chat"}
                </span>
              </div>

              <div className="flex-1 overflow-hidden">
                <ChatWindow
                  conversation={selectedConversation}
                  currentUserId={currentUserId}
                  onBack={() => setSelectedConversation(null)}
                />
              </div>
            </>
          ) : (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center
                            text-gray-400 dark:text-gray-500">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
                <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
                Select a conversation
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Choose a chat from the list to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ChatModal;