import React, { useState } from "react";
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
const SingleCrop = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "owner",
      text: "Hello! Thank you for your interest in my crops. How can I help you?",
      time: "10:30 AM",
    },
  ]);

  // Sample crop data - replace with actual data from props/route
  const crop = {
    _id: "1",
    name: "Premium Basmati Rice",
    description:
      "High-quality organic basmati rice, aged for 2 years to ensure perfect aroma and long grains. Grown using traditional farming methods without any chemical pesticides or fertilizers.",
    price: 85.5,
    available: 500,
    category: "Grains",
    productionYear: "2024",
    location: "Punjab, India",
    imageUrl:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800",
    reportedBy: {
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      email: "rajesh.kumar@farmconnect.com",
      rating: 4.8,
      totalSales: 250,
    },
    specifications: {
      "Grain Length": "8-9 mm",
      "Moisture Content": "12-13%",
      Purity: "99.5%",
      "Broken Grains": "< 1%",
      "Organic Certified": "Yes",
    },
    benefits: [
      "Aged for perfect aroma and taste",
      "Certified organic by India Organic",
      "Non-GMO verified",
      "Low glycemic index",
      "Rich in essential nutrients",
    ],
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          id: chatMessages.length + 1,
          sender: "buyer",
          text: message,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setMessage("");

      // Simulate owner response after 2 seconds
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "owner",
            text: "Thank you for your message! I will get back to you shortly.",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }, 2000);
    }
  };

  const handleAddToCart = () => {
    alert("Added to cart successfully!");
  };
  const handleBuyNow = () => {
    // alert("Proceeding to checkout...");
    setIsBuyNowOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
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
                      <span>{crop.reportedBy.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4 text-green-500" />
                      <span>{crop.reportedBy.email}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(true)}
                className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                Chat with Seller
              </button>
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

            {/* Specifications */}
            {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(crop.specifications).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{key}</div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{value}</div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Benefits */}
            {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Key Benefits</h3>
              <ul className="space-y-2">
                {crop.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400"></div>
                    </div>
                    <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl border-t-4 border-green-500">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
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
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "buyer" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      msg.sender === "buyer"
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "buyer"
                          ? "text-green-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {msg.time}
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
