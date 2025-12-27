import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";


export const startConversation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { otherUserId } = req.body;

    const currentUser = await User.findOne({ clerkId: userId });
    const otherUser = await User.findById(otherUserId);

    if (!currentUser || !otherUser) {
      return res.status(404).json({ success: false });
    }

    let buyer, farmer;

    if (currentUser.role === "buyer") {
      buyer = currentUser._id;
      farmer = otherUser._id;
    } else {
      farmer = currentUser._id;
      buyer = otherUser._id;
    }

    let conversation = await Conversation.findOne({ buyer, farmer })
      .populate("buyer", "name profileImage role")
      .populate("farmer", "name profileImage role");

    if (!conversation) {
      conversation = await Conversation.create({
        buyer,
        farmer,
        unreadCount: {
          [buyer]: 0,
          [farmer]: 0,
        },
      });

      conversation = await Conversation.findById(conversation._id)
        .populate("buyer", "name imageUrl role")
        .populate("farmer", "name imageUrl role");
    }

    // console.log("start conversation data : ",conversation);
    
    res.status(200).json({ success: true, conversation });
  } catch (err) {
    console.error("startConversation error:", err);
    res.status(500).json({ success: false });
  }
};





export const getAllConversations = async (req, res) => {
  try {
    const { userId } = req.auth();

    const currentUser = await User.findOne({ clerkId: userId });
    if (!currentUser) {
      return res.status(404).json({ success: false });
    }

    const conversations = await Conversation.find({
      $or: [{ buyer: currentUser._id }, { farmer: currentUser._id }],
    })
      .populate("buyer", "name profileImage role")
      .populate("farmer", "name profileImage role")
      .sort({ lastMessageAt: -1 });

    const formattedConversations = conversations.map((conv) => {
      const otherUser =
        conv.buyer._id.toString() === currentUser._id.toString()
          ? conv.farmer
          : conv.buyer;

      return {
        _id: conv._id,
        otherUser,
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt,
        unreadCount:
          conv.unreadCount.get(currentUser._id.toString()) || 0,
        createdAt: conv.createdAt,
      };
    });

    const totalUnread = formattedConversations.reduce(
      (sum, c) => sum + c.unreadCount,
      0
    );

    res.status(200).json({
      success: true,
      conversations: formattedConversations,
      totalUnread,
    });
  } catch (err) {
    console.error("getAllConversations error:", err);
    res.status(500).json({ success: false });
  }
};

/* ================================================================
   3️⃣ GET MESSAGES
================================================================ */
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const currentUser = await User.findOne({ clerkId: userId });
    if (!currentUser) {
      return res.status(404).json({ success: false });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false });
    }

    const isParticipant =
      conversation.buyer.toString() === currentUser._id.toString() ||
      conversation.farmer.toString() === currentUser._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ success: false });
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversationId })
      .populate("senderId", "name profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalMessages = await Message.countDocuments({ conversationId });

    await Message.updateMany(
      {
        conversationId,
        senderId: { $ne: currentUser._id },
        isRead: false,
      },
      { isRead: true }
    );

    conversation.unreadCount.set(currentUser._id.toString(), 0);
    await conversation.save();

    res.status(200).json({
      success: true,
      messages: messages.reverse(),
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalMessages / limit),
        totalMessages,
        hasMore: skip + messages.length < totalMessages,
      },
    });
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ success: false });
  }
};

/* ================================================================
   4️⃣ SEND MESSAGE
================================================================ */
export const sendMessage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { conversationId } = req.params;
    const { text, relatedOrderId, relatedCropId } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ success: false });
    }

    const currentUser = await User.findOne({ clerkId: userId });
    const conversation = await Conversation.findById(conversationId);

    if (!currentUser || !conversation) {
      return res.status(404).json({ success: false });
    }

    const isParticipant =
      conversation.buyer.toString() === currentUser._id.toString() ||
      conversation.farmer.toString() === currentUser._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ success: false });
    }

    const message = await Message.create({
      conversationId,
      senderId: currentUser._id,
      text: text.trim(),
      relatedOrderId: relatedOrderId || null,
      relatedCropId: relatedCropId || null,
    });

    await message.populate("senderId", "name profileImage");

    conversation.lastMessage = text.trim().slice(0, 100);
    conversation.lastMessageAt = new Date();

    const otherParticipantId =
      conversation.buyer.toString() === currentUser._id.toString()
        ? conversation.farmer
        : conversation.buyer;

    const unread =
      conversation.unreadCount.get(otherParticipantId.toString()) || 0;

    conversation.unreadCount.set(
      otherParticipantId.toString(),
      unread + 1
    );

    await conversation.save();

    res.status(201).json({ success: true, message });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ success: false });
  }
};

/* ================================================================
   5️⃣ DELETE CONVERSATION
================================================================ */
export const deleteConversation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { conversationId } = req.params;

    const currentUser = await User.findOne({ clerkId: userId });
    const conversation = await Conversation.findById(conversationId);

    if (!currentUser || !conversation) {
      return res.status(404).json({ success: false });
    }

    const isParticipant =
      conversation.buyer.toString() === currentUser._id.toString() ||
      conversation.farmer.toString() === currentUser._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ success: false });
    }

    await Message.deleteMany({ conversationId });
    await Conversation.findByIdAndDelete(conversationId);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("deleteConversation error:", err);
    res.status(500).json({ success: false });
  }
};
