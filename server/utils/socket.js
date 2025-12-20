// ================================================================
// socket.js - Socket.io Configuration & Event Handlers (FINAL)
// ================================================================

import { Server } from "socket.io";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

// Store online users: Map<userId, socketId>
const onlineUsers = new Map();

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

    // ================================================================
    // 1️⃣ AUTHENTICATE USER
    // ================================================================
    socket.on("authenticate", async (userId) => {
      try {
        socket.userId = userId;
        onlineUsers.set(userId.toString(), socket.id);

        socket.join(`user-${userId}`);
        socket.emit("authenticated", { userId });

        console.log(`✅ User authenticated: ${userId}`);

        // Notify chat partners that user is online
        const conversations = await Conversation.find({
          $or: [{ buyer: userId }, { farmer: userId }],
        });

        conversations.forEach((conv) => {
          const otherUserId =
            conv.buyer.toString() === userId ? conv.farmer : conv.buyer;

          if (onlineUsers.has(otherUserId.toString())) {
            io.to(`user-${otherUserId}`).emit("user_online", {
              userId,
            });
          }
        });
      } catch (err) {
        console.error("Authentication error:", err);
      }
    });

    // ================================================================
    // 2️⃣ JOIN CONVERSATION ROOM
    // ================================================================
    socket.on("join_conversation", ({ conversationId }) => {
      socket.join(`conversation-${conversationId}`);
      console.log(`✅ Joined conversation-${conversationId}`);
    });

    // ================================================================
    // 3️⃣ SEND MESSAGE (REAL-TIME)
    // ================================================================
    socket.on("send_message", async (data) => {
      try {
        const { conversationId, text, relatedOrderId, relatedCropId } = data;
        const senderId = socket.userId;

        if (!senderId || !text?.trim()) return;

        // Save message
        const message = await Message.create({
          conversationId,
          senderId,
          text: text.trim(),
          relatedOrderId: relatedOrderId || null,
          relatedCropId: relatedCropId || null,
        });

        await message.populate("senderId", "name profileImage");

        // Update conversation metadata
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

        // Emit message to chat room
        io.to(`conversation-${conversationId}`).emit("receive_message", {
          message,
          conversationId,
        });

        // Navbar unread notification
        if (onlineUsers.has(otherUserId.toString())) {
          io.to(`user-${otherUserId}`).emit("new_message_notification", {
            conversationId,
            lastMessage: message.text,
            lastMessageAt: conversation.lastMessageAt,
          });
        }

        console.log("📨 Message sent");
      } catch (err) {
        console.error("Send message error:", err);
      }
    });

    // ================================================================
    // 4️⃣ TYPING INDICATOR
    // ================================================================
    socket.on("typing", ({ conversationId, isTyping }) => {
      socket.to(`conversation-${conversationId}`).emit("user_typing", {
        userId: socket.userId,
        isTyping,
      });
    });

    // ================================================================
    // 5️⃣ MARK AS READ (FIXED)
    // ================================================================
    socket.on("mark_as_read", async ({ conversationId }) => {
      try {
        const userId = socket.userId;
        if (!userId) return;

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

        conversation.unreadCount.set(userId.toString(), 0);
        await conversation.save();

        const otherUserId =
          conversation.buyer.toString() === userId
            ? conversation.farmer
            : conversation.buyer;

        if (onlineUsers.has(otherUserId.toString())) {
          io.to(`user-${otherUserId}`).emit("messages_read", {
            conversationId,
            readBy: userId,
          });
        }
      } catch (err) {
        console.error("Mark read error:", err);
      }
    });

    // ================================================================
    // 6️⃣ LEAVE CONVERSATION
    // ================================================================
    socket.on("leave_conversation", ({ conversationId }) => {
      socket.leave(`conversation-${conversationId}`);
    });

    // ================================================================
    // 7️⃣ DISCONNECT
    // ================================================================
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

  console.log("✅ Socket.io initialized (FINAL)");
  return io;
};
