import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Package,
  Wheat,
  Calendar,
  MapPin,
  User,
  ShoppingCart,
  Zap,
  MessageCircle,
  X,
  Send,
  Phone,
  Mail,
  Star,
  Shield,
  TrendingUp,
} from "lucide-react";

import BuyNowModal from "./BuyNowModel";
import { useGetSingleCropQuery } from "@/features/api/cropApi";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAddToCartMutation } from "@/features/api/cartApi";

//chat imports
import {
  useStartConversationMutation,
  useGetMessagesQuery,
} from "@/features/api/chatApi";
import { getSocket } from "@/services/socket";
import { useSelector } from "react-redux";

const SingleCrop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);
  // console.log("User in SingleCrop.jsx : ", user?._id);

  //chat data
  const [conversation, setConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [startConversation] = useStartConversationMutation();
  const { data: messagesData, refetch } = useGetMessagesQuery(
    conversation ? { conversationId: conversation._id } : undefined,
    {
      skip: !conversation,
    }
  );

  const chatMessages = messagesData?.messages || [];

  useEffect(() => {
    if (!conversation) return;

    const socket = getSocket();

    const handleReceiveMessage = ({ conversationId }) => {
      if (conversationId === conversation._id) {
        refetch();
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [conversation, refetch]);

useEffect(() => {
  if (!conversation) return;

  const socket = getSocket();

  socket.emit("join_conversation", {
    conversationId: conversation._id,
  });

  return () => {
    socket.emit("leave_conversation", {
      conversationId: conversation._id,
    });
  };
}, [conversation]);


  // Sample crop data - replace with actual data from props/route
  const { cropId } = useParams();
  const { data, isError, isLoading } = useGetSingleCropQuery({ cropId });
  const crop = data?.data;
  // console.log("single crop data : ",crop);
  // console.log("single crop datauser : ", crop?.reportedBy?._id);

  //add cart items mututions
  const [
    addToCart,
    { isError: cartItemAddError, isLoading: cartItemAddSuccess },
  ] = useAddToCartMutation();

  const handleSendMessage = () => {
    if (!message.trim() || !conversation) return;

    const socket = getSocket();

    socket.emit("send_message", {
      conversationId: conversation._id,
      text: message,
      relatedCropId: crop._id,
    });

    setMessage("");
  };

  const handleChatWithSeller = async () => {
    try {
      const res = await startConversation({
        otherUserId: crop.reportedBy._id,
      }).unwrap();

      // 1️⃣ Save conversation in state
      setConversation(res.conversation);
      setIsChatOpen(true);

      // 2️⃣ Join socket room AFTER state update
      setTimeout(() => {
        const socket = getSocket();
        socket.emit("join_conversation", res.conversation._id);
      }, 0);
    } catch (err) {
      console.error("Chat start failed", err);
    }
  };

  const handleAddToCart = async () => {
    try {
      const res = await addToCart({ cropId }).unwrap();
      const message = res.message;
      alert(`${message}`);
    } catch (error) {
      console.log("error in additem to cart : ", error);
    }
  };
  const handleBuyNow = () => {
    setIsBuyNowOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Loading crop details...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Please wait
          </p>
        </div>
      </div>
    );
  }

  if (isError || !crop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Failed to load crop details. Please try again later.
          </p>
          <button
            onClick={() => navigate("/marketplace")}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold transition-all duration-200 shadow-md flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 mt-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            onClick={() => navigate("/marketplace")}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Marketplace</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <img
                src={crop.imageUrl}
                alt={crop.name}
                className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white backdrop-blur-sm border-2 border-white shadow-lg">
                <Package className="w-5 h-5" />
                <span className="text-sm font-bold">
                  {crop.available}kg Available
                </span>
              </div>
            </div>

            {/* Owner Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                Seller Information
              </h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {crop.reportedBy.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {crop.reportedBy.name}
                  </h4>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {crop.reportedBy.rating}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({crop.reportedBy.totalSales} sales)
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4 text-green-500" />
                      <span>+91 {crop.reportedBy.mobileNo}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4 text-green-500" />
                      <span>{crop.reportedBy.email}</span>
                    </div>
                  </div>
                </div>
              </div>
              {user?.role==="buyer" && (<button
                onClick={handleChatWithSeller}
                className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                Chat with Seller
              </button>)}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                {crop.name}
              </h1>

              <div className="flex items-end gap-3 mb-4">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                  ₹{crop.price.toFixed(2)}
                </div>
                <div className="text-lg text-gray-500 dark:text-gray-400 pb-1">
                  per kg
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Certified Organic
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    High Demand
                  </span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {crop.description}
              </p>
            </div>

            {/* Meta Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                Product Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Wheat className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Category</span>
                  </div>
                  <span className="text-gray-800 dark:text-gray-100 font-semibold">
                    {crop.category}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Production Year</span>
                  </div>
                  <span className="text-gray-800 dark:text-gray-100 font-semibold">
                    {crop.productionYear}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Location</span>
                  </div>
                  <span className="text-gray-800 dark:text-gray-100 font-semibold">
                    {crop.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl border-t-4 border-green-500">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={cartItemAddError}
                  className="px-6 py-3.5 bg-white dark:bg-gray-700 border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 rounded-lg font-bold text-base hover:bg-green-50 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="px-6 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
                >
                  <Zap className="w-5 h-5" />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[600px]">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                  {crop.reportedBy.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">
                    {crop.reportedBy.name}
                  </h3>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.senderId._id === user._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      msg.senderId._id === user._id
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full transition-all duration-200 shadow-md"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <BuyNowModal
        isOpen={isBuyNowOpen}
        onClose={() => setIsBuyNowOpen(false)}
        crop={crop}
      />
    </div>
  );
};

export default SingleCrop;
