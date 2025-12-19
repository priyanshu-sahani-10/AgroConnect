// ================================================================
// chat.controller.js
// ================================================================

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// ✅ 1. START OR GET CONVERSATION
export const startConversation = async (req, res) => {
  try {
    const { userId } = req.auth; // Current user (from Clerk)
    const { otherUserId } = req.body; // User they want to chat with

    if (!otherUserId) {
      return res.status(400).json({
        success: false,
        message: "Other user ID is required",
      });
    }

    // Get current user from DB
    const currentUser = await User.findOne({ clerkId: userId });
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: "Other user not found",
      });
    }

    // Sort participant IDs to ensure consistent order
    const participants = [currentUser._id, otherUser._id].sort();

    // Find existing conversation OR create new one
    let conversation = await Conversation.findOne({
      participants: { $all: participants },
    }).populate("participants", "name email profileImage role");

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        participants,
        unreadCount: {
          [currentUser._id]: 0,
          [otherUser._id]: 0,
        },
      });

      // Populate after creation
      conversation = await Conversation.findById(conversation._id).populate(
        "participants",
        "name email profileImage role"
      );
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Start conversation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ✅ 2. GET ALL CONVERSATIONS (For Navbar Chat List)
export const getAllConversations = async (req, res) => {
  try {
    const { userId } = req.auth;

    const currentUser = await User.findOne({ clerkId: userId });
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find all conversations where user is participant
    const conversations = await Conversation.find({
      participants: currentUser._id,
    })
      .populate("participants", "name email profileImage role")
      .sort({ lastMessageAt: -1 }); // Most recent first

    // Format response with other participant info
    const formattedConversations = conversations.map((conv) => {
      const otherParticipant = conv.participants.find(
        (p) => p._id.toString() !== currentUser._id.toString()
      );

      return {
        _id: conv._id,
        otherUser: otherParticipant,
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt,
        unreadCount: conv.unreadCount.get(currentUser._id.toString()) || 0,
        createdAt: conv.createdAt,
      };
    });

    // Calculate total unread
    const totalUnread = formattedConversations.reduce(
      (sum, conv) => sum + conv.unreadCount,
      0
    );

    return res.status(200).json({
      success: true,
      conversations: formattedConversations,
      totalUnread,
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ✅ 3. GET MESSAGES IN A CONVERSATION
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const currentUser = await User.findOne({ clerkId: userId });
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify user is participant in this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === currentUser._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this conversation",
      });
    }

    // Get messages with pagination (newest first)
    const skip = (page - 1) * limit;
    const messages = await Message.find({ conversationId })
      .populate("senderId", "name profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalMessages = await Message.countDocuments({ conversationId });

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        senderId: { $ne: currentUser._id },
        isRead: false,
      },
      { isRead: true }
    );

    // Reset unread count for current user
    conversation.unreadCount.set(currentUser._id.toString(), 0);
    await conversation.save();

    return res.status(200).json({
      success: true,
      messages: messages.reverse(), // Return oldest first for UI
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalMessages / limit),
        totalMessages,
        hasMore: skip + messages.length < totalMessages,
      },
    });
  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ✅ 4. SEND MESSAGE
export const sendMessage = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { conversationId } = req.params;
    const { text, relatedOrderId, relatedCropId } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message text is required",
      });
    }

    const currentUser = await User.findOne({ clerkId: userId });
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === currentUser._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to send messages in this conversation",
      });
    }

    // Create message
    const message = await Message.create({
      conversationId,
      senderId: currentUser._id,
      text: text.trim(),
      relatedOrderId: relatedOrderId || null,
      relatedCropId: relatedCropId || null,
    });

    // Populate sender info
    await message.populate("senderId", "name profileImage");

    // Update conversation
    conversation.lastMessage = text.trim().substring(0, 100); // Preview
    conversation.lastMessageAt = new Date();

    // Increment unread count for other participant
    const otherParticipantId = conversation.participants.find(
      (p) => p.toString() !== currentUser._id.toString()
    );

    const currentUnread =
      conversation.unreadCount.get(otherParticipantId.toString()) || 0;
    conversation.unreadCount.set(
      otherParticipantId.toString(),
      currentUnread + 1
    );

    await conversation.save();

    return res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ✅ 5. DELETE CONVERSATION (Optional)
export const deleteConversation = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { conversationId } = req.params;

    const currentUser = await User.findOne({ clerkId: userId });
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === currentUser._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Delete all messages in conversation
    await Message.deleteMany({ conversationId });

    // Delete conversation
    await Conversation.findByIdAndDelete(conversationId);

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Delete conversation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



