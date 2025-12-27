import { Server } from "socket.io";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

// Store online users: Map<userId, socketId>
const onlineUsers = new Map();

/**
 * 🔢 Calculate total unread messages for a user
 */
const getTotalUnread = async (userId) => {
  const conversations = await Conversation.find({
    $or: [{ buyer: userId }, { farmer: userId }],
  });

  let totalUnread = 0;

  conversations.forEach((conv) => {
    totalUnread += conv.unreadCount.get(userId.toString()) || 0;
  });

  return totalUnread;
};

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    /**
     * 1️⃣ AUTHENTICATE USER
     */
    socket.on("authenticate", async (userId) => {
  socket.userId = userId;
  onlineUsers.set(userId.toString(), socket.id);
  socket.join(`user-${userId}`);
  socket.emit("authenticated", { userId });

  // 🔔 SEND INITIAL UNREAD COUNT
  const totalUnread = await getTotalUnread(userId);
  // console.log("📨 EMITTING initial unread:", totalUnread);
  io.to(`user-${userId}`).emit("user_unread_update", {
    totalUnread,
  });
});


    /**
     * 2️⃣ JOIN CONVERSATION ROOM
     */
    socket.on("join_conversation", ({ conversationId }) => {
      socket.join(`conversation-${conversationId}`);
    });

    /**
     * 3️⃣ SEND MESSAGE
     */
    socket.on("send_message", async ({ conversationId, text }) => {
      try {
        const senderId = socket.userId;
        if (!senderId || !text?.trim()) return;

        // Save message
        const message = await Message.create({
          conversationId,
          senderId,
          text: text.trim(),
        });

        await message.populate("senderId", "name imageUrl");

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        conversation.lastMessage = text.trim().slice(0, 100);
        conversation.lastMessageAt = new Date();

        const otherUserId =
          conversation.buyer.toString() === senderId
            ? conversation.farmer
            : conversation.buyer;

        const unread =
          conversation.unreadCount.get(otherUserId.toString()) || 0;

        conversation.unreadCount.set(otherUserId.toString(), unread + 1);
        await conversation.save();

        // Send message to chat room
        io.to(`conversation-${conversationId}`).emit("receive_message", {
          message,
          conversationId,
        });

        // 🔔 Push unread count to receiver
        if (onlineUsers.has(otherUserId.toString())) {
          const totalUnread = await getTotalUnread(otherUserId);
          io.to(`user-${otherUserId}`).emit("user_unread_update", {
            totalUnread,
          });
        }

      } catch (err) {
        console.error("Send message error:", err);
      }
    });

    /**
     * 4️⃣ TYPING INDICATOR
     */
    socket.on("typing", ({ conversationId, isTyping }) => {
      socket.to(`conversation-${conversationId}`).emit("user_typing", {
        userId: socket.userId,
        isTyping,
      });
    });

    /**
     * 5️⃣ MARK AS READ (✅ FIXED & CORRECT)
     */
    socket.on("mark_as_read", async ({ conversationId }) => {
      try {
        const userId = socket.userId;
        if (!userId) return;

        // Mark messages as read
        await Message.updateMany(
          {
            conversationId,
            senderId: { $ne: userId },
            isRead: false,
          },
          { isRead: true }
        );

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        // Reset unread for current user
        conversation.unreadCount.set(userId.toString(), 0);
        await conversation.save();

        const otherUserId =
          conversation.buyer.toString() === userId
            ? conversation.farmer
            : conversation.buyer;

        // 🔔 Push unread count for CURRENT user
        const myTotalUnread = await getTotalUnread(userId);
        io.to(`user-${userId}`).emit("user_unread_update", {
          totalUnread: myTotalUnread,
        });

        // 🔔 Push unread count for OTHER user (optional but correct)
        if (onlineUsers.has(otherUserId.toString())) {
          const otherTotalUnread = await getTotalUnread(otherUserId);
          io.to(`user-${otherUserId}`).emit("user_unread_update", {
            totalUnread: otherTotalUnread,
          });
        }

        // Read receipt events
        if (onlineUsers.has(otherUserId.toString())) {
          io.to(`user-${otherUserId}`).emit("messages_read", {
            conversationId,
            readBy: userId,
          });
        }

        io.to(`user-${userId}`).emit("messages_read", {
          conversationId,
          readBy: userId,
        });

      } catch (err) {
        console.error("Mark read error:", err);
      }
    });

    /**
     * 6️⃣ LEAVE CONVERSATION
     */
    socket.on("leave_conversation", ({ conversationId }) => {
      socket.leave(`conversation-${conversationId}`);
    });

    /**
     * 7️⃣ DISCONNECT
     */
    socket.on("disconnect", async () => {
      console.log("🔴 Socket disconnected:", socket.id);

      let disconnectedUserId = null;

      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          onlineUsers.delete(userId);
          break;
        }
      }

      if (!disconnectedUserId) return;

      const conversations = await Conversation.find({
        $or: [{ buyer: disconnectedUserId }, { farmer: disconnectedUserId }],
      });

      conversations.forEach((conv) => {
        const otherUserId =
          conv.buyer.toString() === disconnectedUserId
            ? conv.farmer
            : conv.buyer;

        if (onlineUsers.has(otherUserId.toString())) {
          io.to(`user-${otherUserId}`).emit("user_offline", {
            userId: disconnectedUserId,
          });
        }
      });
    });
  });

  console.log("✅ Socket.io (Server) initialized");
  return io;
};
