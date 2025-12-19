// message.model.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true, // Fast message queries
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional: Link message to order or crop
    relatedOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    relatedCropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      default: null,
    },

    // Message status
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for fast pagination
messageSchema.index({ conversationId: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;