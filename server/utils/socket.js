// ================================================================
// socket.js - Socket.io Configuration & Event Handlers (FIXED)
// ================================================================

import { Server } from "socket.io";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

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
        socket.userId = userId; // 🔐 TRUSTED SOURCE
        onlineUsers.set(userId, socket.id);
        socket.join(`user-${userId}`);

        console.log(`✅ User authenticated: ${userId}`);

        socket.emit("authenticated", { userId });

        // Notify other users this user is online
        const conversations = await Conversation.find({
          participants: userId,
        });

        conversations.forEach((conv) => {
          const otherUserId = conv.participants.find(
            (p) => p.toString() !== userId
          );
          if (otherUserId && onlineUsers.has(otherUserId.toString())) {
            io.to(`user-${otherUserId}`).emit("user_online", { userId });
          }
        });
      } catch (err) {
        console.error("Authentication error:", err);
      }
    });

    // ================================================================
    // 2️⃣ JOIN CONVERSATION ROOM (NO DB CHECK ❗)
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

        if (!text || !text.trim()) return;
        if (!socket.userId) return;

        const senderId = socket.userId;

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
        if (conversation) {
          conversation.lastMessage = text.trim().slice(0, 100);
          conversation.lastMessageAt = new Date();

          const otherUserId = conversation.participants.find(
            (p) => p.toString() !== senderId
          );

          if (otherUserId) {
            const currentUnread =
              conversation.unreadCount.get(otherUserId.toString()) || 0;
            conversation.unreadCount.set(
              otherUserId.toString(),
              currentUnread + 1
            );
          }

          await conversation.save();

          // Navbar notification
          if (otherUserId && onlineUsers.has(otherUserId.toString())) {
            io.to(`user-${otherUserId}`).emit("new_message_notification", {
              conversationId,
              unreadCount:
                conversation.unreadCount.get(otherUserId.toString()) || 0,
            });
          }
        }

        // Emit message to chat room
        io.to(`conversation-${conversationId}`).emit("receive_message", {
          message,
          conversationId,
        });

        console.log("📨 Message sent");
      } catch (err) {
        console.error("Send message error:", err);
      }
    });

    // ================================================================
    // 4️⃣ TYPING INDICATOR
    // ================================================================
    socket.on("typing", ({ conversationId, isTyping }) => {
      socket
        .to(`conversation-${conversationId}`)
        .emit("user_typing", {
          userId: socket.userId,
          isTyping,
        });
    });

    // ================================================================
    // 5️⃣ MARK AS READ
    // ================================================================
    socket.on("mark_as_read", async ({ conversationId }) => {
      try {
        const userId = socket.userId;

        await Message.updateMany(
          {
            conversationId,
            senderId: { $ne: userId },
            isRead: false,
          },
          { isRead: true }
        );

        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
          conversation.unreadCount.set(userId, 0);
          await conversation.save();

          const otherUserId = conversation.participants.find(
            (p) => p.toString() !== userId
          );

          if (otherUserId && onlineUsers.has(otherUserId.toString())) {
            io.to(`user-${otherUserId}`).emit("messages_read", {
              conversationId,
              readBy: userId,
            });
          }
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

      if (disconnectedUserId) {
        const conversations = await Conversation.find({
          participants: disconnectedUserId,
        });

        conversations.forEach((conv) => {
          const otherUserId = conv.participants.find(
            (p) => p.toString() !== disconnectedUserId
          );

          if (otherUserId && onlineUsers.has(otherUserId.toString())) {
            io.to(`user-${otherUserId}`).emit("user_offline", {
              userId: disconnectedUserId,
            });
          }
        });
      }
    });
  });

  console.log("✅ Socket.io initialized (FIXED)");
  return io;
};
