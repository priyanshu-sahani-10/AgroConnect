import React from 'react';
import { MessageCircle, Circle } from 'lucide-react';

const ChatList = ({ conversations, loading, onSelectConversation, currentUserId }) => {
  const formatTime = (date) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diff = now - msgDate;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes < 1 ? 'Just now' : `${minutes}m ago`;
    } else if (hours < 24) {
      return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (hours < 48) {
      return 'Yesterday';
    } else {
      return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            No conversations yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Start chatting with farmers or buyers
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {conversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() => onSelectConversation(conv)}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                    {conv.otherUser?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <Circle className="absolute bottom-0 right-0 w-3 h-3 fill-green-500 text-green-500 bg-white dark:bg-gray-800 rounded-full" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                        {conv.otherUser?.name || 'Unknown User'}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {conv.otherUser?.role === 'farmer' ? '🌾 Farmer' : '🛒 Buyer'}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm truncate flex-1 ${
                      conv.unreadCount > 0
                        ? 'font-semibold text-gray-900 dark:text-gray-100'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;