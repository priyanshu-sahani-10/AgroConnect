import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Circle, Check, CheckCheck, Smile } from 'lucide-react';
import { getSocket } from '@/services/socket';
import { useGetMessagesQuery } from '@/features/api/chatApi';

const ChatWindow = ({ conversation, currentUserId, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch initial messages
  const { data: messagesData, isLoading } = useGetMessagesQuery({
    conversationId: conversation._id,
    page: 1,
    limit: 50,
  });

  useEffect(() => {
    if (messagesData?.success) {
      setMessages(messagesData.messages);
      scrollToBottom();
    }
  }, [messagesData]);

  useEffect(() => {
    const socket = getSocket();

    // Join conversation room
    socket.emit('join_conversation', {
      conversationId: conversation._id,
      userId: currentUserId,
    });

    // Mark messages as read
    socket.emit('mark_as_read', {
      conversationId: conversation._id,
      userId: currentUserId,
    });

    // Listen for new messages
    socket.on('receive_message', (data) => {
      if (data.conversationId === conversation._id) {
        setMessages((prev) => [...prev, data.message]);
        scrollToBottom();

        // Mark as read immediately
        socket.emit('mark_as_read', {
          conversationId: conversation._id,
          userId: currentUserId,
        });
      }
    });

    // Listen for typing indicator
    socket.on('user_typing', ({ isTyping: typing }) => {
      setIsTyping(typing);
      if (typing) {
        scrollToBottom();
      }
    });

    // Listen for read receipts
    socket.on('messages_read', ({ conversationId, readBy }) => {
      if (conversationId === conversation._id && readBy !== currentUserId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId._id === currentUserId ? { ...msg, isRead: true } : msg
          )
        );
      }
    });

    return () => {
      socket.emit('leave_conversation', {
        conversationId: conversation._id,
        userId: currentUserId,
      });
      socket.off('receive_message');
      socket.off('user_typing');
      socket.off('messages_read');
    };
  }, [conversation._id, currentUserId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const socket = getSocket();
    socket.emit('send_message', {
      conversationId: conversation._id,
      senderId: currentUserId,
      text: newMessage.trim(),
    });

    setNewMessage('');

    // Stop typing indicator
    socket.emit('typing', {
      conversationId: conversation._id,
      userId: currentUserId,
      isTyping: false,
    });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    const socket = getSocket();
    socket.emit('typing', {
      conversationId: conversation._id,
      userId: currentUserId,
      isTyping: true,
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', {
        conversationId: conversation._id,
        userId: currentUserId,
        isTyping: false,
      });
    }, 2000);
  };

  const formatMessageTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date) => {
    const msgDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (msgDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return msgDate.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: msgDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {conversation.otherUser?.name?.charAt(0)?.toUpperCase() || '?'}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">
            {conversation.otherUser?.name || 'Unknown User'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Circle className="w-2 h-2 fill-green-500 text-green-500" />
            Online
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading messages...</p>
            </div>
          </div>
        ) : (
          <>
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date Separator */}
                <div className="flex items-center justify-center mb-4">
                  <span className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                    {date}
                  </span>
                </div>

                {/* Messages */}
                <div className="space-y-2">
                  {dateMessages.map((msg) => {
                    const isSentByMe = msg.senderId._id === currentUserId;
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl shadow-sm ${
                            isSentByMe
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-br-none'
                              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm break-words whitespace-pre-wrap">{msg.text}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span
                              className={`text-xs ${
                                isSentByMe ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'
                              }`}
                            >
                              {formatMessageTime(msg.createdAt)}
                            </span>
                            {isSentByMe && (
                              <span>
                                {msg.isRead ? (
                                  <CheckCheck className="w-4 h-4 text-blue-300" />
                                ) : (
                                  <Check className="w-4 h-4 text-green-100" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
            <textarea
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              rows="1"
              className="w-full bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border-none focus:outline-none resize-none max-h-32"
              style={{
                minHeight: '24px',
                maxHeight: '128px',
              }}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-600 disabled:hover:to-emerald-600"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;