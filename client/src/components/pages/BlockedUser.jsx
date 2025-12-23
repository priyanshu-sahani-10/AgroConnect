import { useClerk } from '@clerk/clerk-react';
import { AlertTriangle, Mail, Shield, User, Phone, MapPin, Calendar, DollarSign, ShoppingCart, IdCard } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BlockedUserPage = () => {

  const userData = useSelector((state)=>state.auth.user)
  const adminContact = {
    name: "Farm Market Support Team",
    email: "priyanshusahani@gmail.com",
    phone: "+91 8369601243",
    whatsapp: "+91 98765 43210"
  };

  // Helper function to get role badge color
  
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'farmer':
        return 'bg-green-100 text-green-700';
      case 'buyer':
        return 'bg-blue-100 text-blue-700';
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const {signOut}=useClerk();
  const navigate=useNavigate();
  const onClickhandler = async (path) => {
  await signOut({
    redirectUrl: `/${path}`,
  });
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Main Block Notice */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-t-4 border-red-500 mb-6">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-red-600" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {userData.name} Is Blocked !
            </h1>
            <div className="flex items-center justify-center gap-2 text-red-600 mb-4">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Access Restricted</span>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <p className="text-gray-700 text-center text-lg leading-relaxed">
              Your account has been temporarily blocked due to activities that violated our community guidelines or terms of service.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Common reasons for account blocks:
            </h2>
            <ul className="space-y-3">
              {[
                'Inappropriate content or behavior',
                'Violation of community guidelines',
                'Fraudulent or unfair activities',
                'Multiple user reports',
                'Terms of service violations'
              ].map((reason, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* User Verification Info - Prominent Display */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <IdCard className="w-7 h-7 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Verify Your Account Details
            </h2>
          </div>
          
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Account Email</label>
                <p className="text-xl font-bold text-gray-900 mt-1">{userData.email}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Account Name</label>
                <p className="text-xl font-bold text-gray-900 mt-1">{userData.name}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Account Type</label>
                <div className="mt-1">
                  <span className={`inline-block px-4 py-2 rounded-full text-base font-semibold capitalize ${getRoleBadgeColor(userData.role)}`}>
                    {userData.role}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Mobile No</label>
                <p className="text-lg font-mono text-gray-700 mt-1 break-all">{userData.mobileNo}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Please verify this is your account before contacting support
              </p>
            </div>
          </div>
        </div>

        {/* User Full Info Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-6 h-6" />
            Complete Account Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* User Profile */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {userData.imageUrl ? (
                  <img src={userData.imageUrl} alt={userData.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100">
                    <User className="w-10 h-10 text-blue-600" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{userData.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{userData.email}</p>
                <span className={`inline-block px-3 py-1 text-sm rounded-full capitalize font-medium ${getRoleBadgeColor(userData.role)}`}>
                  {userData.role}
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Mobile Number</p>
                  <p className="font-medium">{userData.mobileNo}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium">{userData.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Member Since</p>
                  <p className="font-medium">{new Date(userData.createdAt).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="md:col-span-2 grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                  <DollarSign className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">₹{userData.totalEarning.toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-600 mt-1">Total Earning</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
                  <DollarSign className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">₹{userData.totalSpent.toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-600 mt-1">Total Spent</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{userData.totalOrder}</p>
                <p className="text-sm text-gray-600 mt-1">Total Orders</p>
              </div>
            </div>

            {/* Account Status */}
            <div className="md:col-span-2 mt-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Account Status: <span className="text-red-600">Blocked</span></p>
                    <p className="text-sm text-gray-600 mt-1">
                      Last Updated: {new Date(userData.updatedAt).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Actions Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Alternative Options</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Login with Different Account */}
            <div className="border-2 border-blue-200 rounded-lg p-6 hover:border-blue-400 transition-colors bg-gradient-to-br from-blue-50 to-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">Login with Another Account</h3>
              </div>
              <p className="text-gray-600 mb-6">
                If you have another account, you can sign out from this blocked account and login with a different one.
              </p>
              <button
                onClick={() => {
                  onClickhandler("sign-in")
                }}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Switch Account
              </button>
            </div>

            {/* Create New Account */}
            <div className="border-2 border-green-200 rounded-lg p-6 hover:border-green-400 transition-colors bg-gradient-to-br from-green-50 to-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">Create New Account</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Start fresh with a new account. Make sure to follow our community guidelines to avoid future blocks.
              </p>
              <button
                onClick={() => {
                  onClickhandler("sign-up")
                }}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-gray-700 text-center">
              <strong>Note:</strong> Creating multiple accounts to bypass blocks is against our terms of service and may result in permanent suspension.
            </p>
          </div>
        </div>

        {/* Contact Admin Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Support</h2>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                  Need Help or Want to Appeal?
                </h3>
                <p className="text-gray-700 mb-4">
                  If you believe this is a mistake or would like to appeal this decision, please reach out to our support team. We're here to help resolve any issues.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Email Contact */}
            <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Email Support</h3>
              </div>
              <p className="text-gray-600 mb-4">Send us a detailed email about your situation</p>
              <a
                href={`mailto:${adminContact.email}?subject=Account Block Appeal - ${userData.email}&body=Hi Support Team,%0D%0A%0D%0AMy account has been blocked and I would like to appeal this decision.%0D%0A%0D%0AAccount Details:%0D%0AName: ${userData.name}%0D%0AEmail: ${userData.email}%0D%0AUser ID: ${userData.clerkId}%0D%0A%0D%0AReason for appeal:%0D%0A[Please explain your situation here]`}
                className="inline-block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {adminContact.email}
              </a>
            </div>

            {/* Phone Contact */}
            <div className="border border-gray-200 rounded-lg p-6 hover:border-green-300 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Phone Support</h3>
              </div>
              <p className="text-gray-600 mb-4">Call us directly to discuss your account</p>
              <a
                href={`tel:${adminContact.phone}`}
                className="inline-block w-full text-center bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                {adminContact.phone}
              </a>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700 text-center">
              <strong>Response Time:</strong> Our support team typically responds within 24-48 hours. Please include your account email (<strong>{userData.email}</strong>) and User ID in your message for faster processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockedUserPage;