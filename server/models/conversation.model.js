import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },

    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

// ✅ UNIQUE buyer-farmer pair
conversationSchema.index({ buyer: 1, farmer: 1 }, { unique: true });

export default mongoose.model("Conversation", conversationSchema);
