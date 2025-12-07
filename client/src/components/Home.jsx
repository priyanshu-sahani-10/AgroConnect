import { Button } from "@/components/ui/button";
import React from "react";
import { Sprout, Users, ShoppingCart, TrendingUp, ArrowRight, Package, MessageCircle, Shield } from "lucide-react";

const Home = () => {
  const isAuthenticated = false; // Replace with Redux selector

  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/signup";
    }
  };

  const handleExplore = () => {
    if (isAuthenticated) {
      window.location.href = "/marketplace";
    } else {
      window.location.href = "/login";
    }
  };

  const features = [
    {
      icon: Sprout,
      title: "Direct from Farm",
      description: "Connect directly with local farmers for fresh produce"
    },
    {
      icon: ShoppingCart,
      title: "Easy Shopping",
      description: "Browse, order, and track your fresh farm products"
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Chat with farmers, negotiate prices, ask questions"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Safe and secure transactions with trusted payment gateways"
    }
  ];

  const stats = [
    { number: "500+", label: "Active Farmers" },
    { number: "2K+", label: "Happy Buyers" },
    { number: "10K+", label: "Fresh Products" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>Connecting Farms to Tables Since 2024</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-900">Farm Fresh,</span>
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Delivered Direct
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
              Welcome to{" "}
              <span className="font-bold text-green-600">
                AgroConnect
              </span>{" "}
              — bridging the gap between farmers and buyers. Get fresh produce
              directly from local farms, support farmers, and enjoy quality products
              at fair prices.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="group text-lg px-8 py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                onClick={handleGetStarted}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 border-green-600 text-green-600 hover:bg-green-50"
                onClick={handleExplore}
              >
                Explore Marketplace
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-green-600">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Feature Cards */}
          <div className="flex-1 relative">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl p-8 text-white shadow-xl">
                  <Sprout className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">For Farmers</h3>
                  <p className="text-green-100">
                    Sell your crops directly to buyers and earn better profits
                  </p>
                </div>
              </div>
              <div className="space-y-6 pt-12">
                <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-3xl p-8 text-white shadow-xl">
                  <ShoppingCart className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">For Buyers</h3>
                  <p className="text-green-100">
                    Get fresh produce at fair prices directly from farms
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose AgroConnect?
          </h2>
          <p className="text-xl text-gray-600">
            Revolutionizing farm-to-table connections
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Simple steps to connect farmers and buyers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-green-600">1</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Sign Up</h3>
            <p className="text-gray-600">
              Create your account as a farmer or buyer in minutes
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Connect</h3>
            <p className="text-gray-600">
              Browse products, chat with farmers, and negotiate deals
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-green-600">3</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Transact</h3>
            <p className="text-gray-600">
              Complete secure payments and track your orders in real-time
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of farmers and buyers creating a sustainable agricultural ecosystem
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 bg-white text-green-600 hover:bg-gray-100"
              onClick={handleGetStarted}
            >
              Join as Farmer
              <Sprout className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-green-700 hover:bg-green-800 text-white"
              onClick={handleGetStarted}
            >
              Join as Buyer
              <ShoppingCart className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;