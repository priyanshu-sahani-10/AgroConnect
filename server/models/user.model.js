import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["farmer", "buyer", "admin"],
      default: "buyer", // you can change default
    },
    mobileNo:{
      type:Number,
    },
    totalEarning:{
      type:Number,
      default:0
    },
    totalSpent:{
      type:Number,
      default:0
    },
    totalOrder:{
      type:Number,
      default:0
    },
    imageUrl: {
      type: String,
      default: "",
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
