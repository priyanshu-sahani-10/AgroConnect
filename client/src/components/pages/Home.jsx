import { Button } from "@/components/ui/button";
import React from "react";
import { Sprout, Users, ShoppingCart, TrendingUp, ArrowRight, Package, MessageCircle, Shield } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = () => {
  const user = useSelector((state)=>(state.auth.user)); // Replace with Redux selector

  const handleGetStarted = () => {
    if (!user) {
      window.location.href = "/sign-up";
    } else {
      if(user.role==="farmer"){
        window.location.href = "/register-crop";
      }else{
        window.location.href = "/my-orders";
      }
    }
  };

  const handleExplore = () => {
    if (user) {
      window.location.href = "/marketplace";
    } else {
      window.location.href = "/sign-in";
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="w-full px-6 lg:px-12 xl:px-20 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>Connecting Farms to Tables Since 2024</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-900 dark:text-white">Farm Fresh,</span>
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Delivered Direct
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
              Welcome to{" "}
              <span className="font-bold text-green-600 dark:text-green-400">
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
                className="group text-lg px-8 py-6 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-600 dark:hover:to-emerald-600 shadow-lg dark:shadow-green-900/50 text-white"
                onClick={handleGetStarted}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/50 bg-white dark:bg-gray-800"
                onClick={handleExplore}
              >
                Explore Marketplace
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Feature Cards */}
          <div className="flex-1 relative">
            <div className="grid grid-cols-2 gap-6">
              <Link to="/farmer">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 rounded-3xl p-8 text-white shadow-xl dark:shadow-green-900/50">
                  <Sprout className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">For Farmers</h3>
                  <p className="text-green-50">
                    Sell your crops directly to buyers and earn better profits
                  </p>
                </div>
              </div>
              </Link>
              <Link to="/buyer">
                <div className="space-y-6">
                <div className="bg-gradient-to-br from-emerald-500 to-green-500 dark:from-emerald-600 dark:to-green-600 rounded-3xl p-8 text-white shadow-xl dark:shadow-emerald-900/50">
                  <ShoppingCart className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">For Buyers</h3>
                  <p className="text-green-50">
                    Get fresh produce at fair prices directly from farms
                  </p>
                </div>
              </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full px-6 lg:px-12 xl:px-20 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose AgroConnect?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Revolutionizing farm-to-table connections
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-gray-950/50 hover:shadow-2xl dark:hover:shadow-gray-950/70 transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md dark:shadow-green-900/50">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full px-6 lg:px-12 xl:px-20 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Simple steps to connect farmers and buyers
          </p>
        </div>

        <div className="relative">
  {/* Connection Line - Desktop Only */}
  <div className="hidden md:block absolute top-24 left-0 right-0 h-1">
    <div className="max-w-4xl mx-auto h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 dark:from-green-600 dark:via-emerald-600 dark:to-teal-600 opacity-30"></div>
  </div>

  <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
    {/* Step 1 */}
    <div className="group relative">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-700 hover:shadow-2xl dark:hover:shadow-gray-950/70 transition-all duration-300 hover:-translate-y-2">
        {/* Step Number Badge */}
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg dark:shadow-green-900/50 group-hover:scale-110 transition-transform">
          01
        </div>

        {/* Icon Circle */}
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 dark:opacity-90 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg dark:shadow-green-900/50">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="19" y1="8" x2="19" y2="14"></line>
            <line x1="22" y1="11" x2="16" y2="11"></line>
          </svg>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white text-center">
          Sign Up
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
          Create your account as a farmer or buyer in minutes
        </p>

        {/* Hover Arrow - Desktop */}
        <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 dark:text-green-400">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>

      {/* Mobile Arrow */}
      <div className="md:hidden flex justify-center my-4">
        <div className="w-0.5 h-12 bg-gradient-to-b from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600"></div>
      </div>
    </div>

    {/* Step 2 */}
    <div className="group relative">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-700 hover:shadow-2xl dark:hover:shadow-gray-950/70 transition-all duration-300 hover:-translate-y-2">
        {/* Step Number Badge */}
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg dark:shadow-green-900/50 group-hover:scale-110 transition-transform">
          02
        </div>

        {/* Icon Circle */}
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 dark:opacity-90 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg dark:shadow-green-900/50">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white text-center">
          Connect
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
          Browse products, chat with farmers, and negotiate deals
        </p>

        {/* Hover Arrow - Desktop */}
        <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 dark:text-green-400">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>

      {/* Mobile Arrow */}
      <div className="md:hidden flex justify-center my-4">
        <div className="w-0.5 h-12 bg-gradient-to-b from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600"></div>
      </div>
    </div>

    {/* Step 3 */}
    <div className="group relative">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-700 hover:shadow-2xl dark:hover:shadow-gray-950/70 transition-all duration-300 hover:-translate-y-2">
        {/* Step Number Badge */}
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg dark:shadow-green-900/50 group-hover:scale-110 transition-transform">
          03
        </div>

        {/* Icon Circle */}
        <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-green-600 dark:opacity-90 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg dark:shadow-green-900/50">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white text-center">
          Transact
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
          Complete secure payments and track your orders
        </p>
      </div>
    </div>
  </div>
</div>
      </div>

      {/* CTA Section */}
      <div className="w-full px-6 lg:px-12 xl:px-20 py-20">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 rounded-3xl p-12 text-center text-white shadow-2xl dark:shadow-green-900/50">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-green-50">
            Join thousands of farmers and buyers creating a sustainable agricultural ecosystem
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 bg-white dark:bg-gray-100 text-green-600 dark:text-green-700 hover:bg-gray-100 dark:hover:bg-gray-200"
            >
              Join as Farmer
              <Sprout className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-green-700 dark:bg-green-800 hover:bg-green-800 dark:hover:bg-green-900 text-white"
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