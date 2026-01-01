import React from "react";
import {
  ShoppingCart,
  TrendingDown,
  MessageSquare,
  Shield,
  Clock,
  CreditCard,
  Package,
  ArrowRight,
  CheckCircle,
  Star,
  Truck,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import Home from "./Home";

const BuyerOnboardingPage = () => {
  const features = [
    {
      icon: TrendingDown,
      title: "Best Prices",
      description: "Get fresh produce directly from farmers at wholesale prices without middlemen markup",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "All farmers are verified and products are quality checked before listing",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: MessageSquare,
      title: "Direct Communication",
      description: "Chat directly with farmers to discuss quality, quantity, and delivery details",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Multiple payment options with 100% secure transaction processing",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      icon: Truck,
      title: "Reliable Delivery",
      description: "Track your orders in real-time with timely delivery guarantees",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    {
      icon: Search,
      title: "Wide Selection",
      description: "Browse thousands of fresh crops from different regions across India",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    },
  ];

  const benefits = [
    "Save up to 30% on wholesale prices",
    "Farm-fresh produce guarantee",
    "Flexible quantity ordering",
    "Real-time order tracking",
    "Easy returns and refunds",
    "24/7 customer support",
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Browse Products",
      description: "Search and filter from thousands of fresh crops available",
    },
    {
      step: "2",
      title: "Connect with Farmers",
      description: "Chat with farmers to verify quality and negotiate if needed",
    },
    {
      step: "3",
      title: "Place Your Order",
      description: "Add to cart and checkout with secure payment options",
    },
    {
      step: "4",
      title: "Receive Fresh Produce",
      description: "Track delivery and receive farm-fresh products at your doorstep",
    },
  ];

  const testimonials = [
    {
      name: "Rajesh Sharma",
      location: "Delhi",
      feedback: "Best platform for bulk buying! I saved 25% on my restaurant's vegetable costs. Fresh quality every time!",
      rating: 5,
    },
    {
      name: "Priya Desai",
      location: "Mumbai",
      feedback: "Direct connection with farmers gives me confidence in quality. The chat feature is really helpful!",
      rating: 5,
    },
    {
      name: "Anil Kumar",
      location: "Bangalore",
      feedback: "Fast delivery and great prices. I've been using AgroConnect for 6 months now. Highly recommended!",
      rating: 5,
    },
  ];

  const productCategories = [
    { name: "Vegetables", count: "2000+" },
    { name: "Fruits", count: "1500+" },
    { name: "Grains", count: "800+" },
    { name: "Pulses", count: "600+" },
    { name: "Spices", count: "400+" },
    { name: "Organic", count: "1200+" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-600 dark:bg-green-500 p-4 rounded-full">
                <ShoppingCart className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Shop Fresh from <span className="text-green-600 dark:text-green-400">Farmers</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
              Get Farm-Fresh Produce at Wholesale Prices
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              Connect directly with verified farmers, enjoy better prices, and get fresh produce 
              delivered to your doorstep. No middlemen, no compromise on quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to ="/" className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 shadow-lg transition-all">
                Start Shopping Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to ="/"className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-green-600 dark:text-green-400 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-green-600 dark:border-green-500 transition-all">
                Home 
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-green-600 dark:bg-green-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">5,000+</div>
              <div className="text-green-100 dark:text-green-200">Verified Farmers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-green-100 dark:text-green-200">Fresh Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50,000+</div>
              <div className="text-green-100 dark:text-green-200">Happy Buyers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">4.8/5</div>
              <div className="text-green-100 dark:text-green-200">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore our wide range of fresh produce
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {productCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400"
            >
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                {category.count}
              </div>
              <div className="text-gray-700 dark:text-gray-300 font-medium">
                {category.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 dark:bg-gray-800/50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Buy on AgroConnect?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience the best way to shop for fresh produce online
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700"
                >
                  <div className={`${feature.bgColor} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Exclusive Buyer Benefits
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            More than just a marketplace
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {benefit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-b from-green-50 to-white dark:from-gray-800 dark:to-gray-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Start buying fresh produce in 4 easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-600 dark:bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Buyers Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Join thousands of satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                "{testimonial.feedback}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-50 dark:bg-gray-800/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 text-green-600 dark:text-green-400 mb-2" />
              <div className="font-semibold text-gray-900 dark:text-white">100% Secure</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Payments</div>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mb-2" />
              <div className="font-semibold text-gray-900 dark:text-white">Quality</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Guaranteed</div>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="w-12 h-12 text-orange-600 dark:text-orange-400 mb-2" />
              <div className="font-semibold text-gray-900 dark:text-white">Fast</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Delivery</div>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-12 h-12 text-purple-600 dark:text-purple-400 mb-2" />
              <div className="font-semibold text-gray-900 dark:text-white">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 dark:bg-green-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Shopping Fresh Today!
          </h2>
          <p className="text-xl text-green-100 dark:text-green-200 mb-8">
            Join thousands of buyers getting farm-fresh produce at the best prices
          </p>
          < Link to="/sign-up" className="bg-white hover:bg-gray-100 text-green-600 px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 shadow-lg mx-auto transition-all">
            Create Your Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-green-100 dark:text-green-200 mt-4 text-sm">
            No subscription fees • Shop anytime • Cancel anytime
          </p>
        </div>
      </div>

      
    </div>
  );
};

export default BuyerOnboardingPage;