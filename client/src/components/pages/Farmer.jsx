import React from "react";
import {
  Sprout,
  TrendingUp,
  Users,
  Shield,
  MessageSquare,
  Wallet,
  Package,
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  Globe,
} from "lucide-react";

const FarmerOnboardingPage = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Direct Sales",
      description: "Sell directly to buyers without middlemen and get fair prices for your crops",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: Wallet,
      title: "Secure Payments",
      description: "Receive payments securely through integrated payment gateway directly to your account",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: MessageSquare,
      title: "Real-Time Chat",
      description: "Chat directly with buyers, negotiate prices, and answer queries instantly",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: Package,
      title: "Inventory Management",
      description: "Easily manage your crop listings with real-time inventory updates",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      icon: Users,
      title: "Wider Reach",
      description: "Connect with buyers across different regions and expand your market",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      icon: Shield,
      title: "Safe & Trusted",
      description: "Secure platform with verified users and transparent transactions",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
  ];

  const benefits = [
    "No commission on first 10 sales",
    "Free listing for all crops",
    "24/7 customer support",
    "Easy-to-use dashboard",
    "Real-time order notifications",
    "Detailed sales analytics",
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Create Your Account",
      description: "Sign up as a farmer with basic details and verification",
    },
    {
      step: "2",
      title: "List Your Crops",
      description: "Add your crops with photos, prices, and quantities",
    },
    {
      step: "3",
      title: "Connect with Buyers",
      description: "Receive orders and chat with interested buyers",
    },
    {
      step: "4",
      title: "Get Paid Securely",
      description: "Complete orders and receive payments directly to your account",
    },
  ];

  const testimonials = [
    {
      name: "Ramesh Kumar",
      location: "Punjab",
      feedback: "AgroConnect helped me sell my wheat directly to buyers. I earned 20% more than market rates!",
      rating: 5,
    },
    {
      name: "Suresh Patil",
      location: "Maharashtra",
      feedback: "The platform is easy to use. I can manage everything from my phone. Great experience!",
      rating: 5,
    },
    {
      name: "Lakshmi Devi",
      location: "Karnataka",
      feedback: "Direct communication with buyers has built trust. My sales have doubled in 3 months!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-600 dark:bg-green-500 p-4 rounded-full">
                <Sprout className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to <span className="text-green-600 dark:text-green-400">AgroConnect</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
              Empowering Farmers with Direct Market Access
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              Join thousands of farmers who are selling their crops directly to buyers, 
              eliminating middlemen, and earning better profits
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 shadow-lg transition-all">
                Create Farmer Account
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-green-600 dark:text-green-400 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-green-600 dark:border-green-500 transition-all">
                Learn More
              </button>
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
              <div className="text-green-100 dark:text-green-200">Active Farmers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-green-100 dark:text-green-200">Crops Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">₹2Cr+</div>
              <div className="text-green-100 dark:text-green-200">Transactions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-green-100 dark:text-green-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What We Offer
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to grow your farming business online
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

      {/* Benefits Section */}
      <div className="bg-gray-50 dark:bg-gray-800/50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose AgroConnect?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Join our platform and enjoy exclusive benefits
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
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Get started in 4 simple steps
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

      {/* Testimonials Section */}
      <div className="bg-gradient-to-b from-green-50 to-white dark:from-gray-800 dark:to-gray-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Farmers Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real stories from our farming community
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
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
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
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 dark:bg-green-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-green-100 dark:text-green-200 mb-8">
            Join AgroConnect today and start selling your crops directly to buyers
          </p>
          <button className="bg-white hover:bg-gray-100 text-green-600 px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 shadow-lg mx-auto transition-all">
            Create Your Free Account
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-green-100 dark:text-green-200 mt-4 text-sm">
            No credit card required • Free forever • Get started in 2 minutes
          </p>
        </div>
      </div>

     
    </div>
  );
};

export default FarmerOnboardingPage;