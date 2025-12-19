// conversation.model.js
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    // Two participants: buyer & farmer
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // Last message preview for chat list
    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },

    // Unread count per user
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

// ✅ CRITICAL: Ensure ONE conversation per buyer-farmer pair
conversationSchema.index({ participants: 1 }, { unique: true });

// Helper method to get other participant
conversationSchema.methods.getOtherParticipant = function (userId) {
  return this.participants.find(
    (id) => id.toString() !== userId.toString()
  );
};

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;


