import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function Profile() {
  // Sample user data - replace with actual data from your backend
  const userData = useSelector((state)=> state.auth.user);
  console.log("User in profile.jsx : ", userData);
  

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      farmer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      buyer: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  if (!userData) {
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
      <p className="text-gray-600 dark:text-gray-400 text-lg">Loading profile...</p>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-950/50 p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={userData.imageUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"}
                alt={userData.name}
                className="w-32 h-32 rounded-full border-4 border-green-200 dark:border-green-900 object-cover"
              />
              <span className={`absolute bottom-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(userData.role)}`}>
                {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
              </span>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {userData.name || "User Name"}
              </h1>
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{userData.email}</span>
                </div>
                {userData.mobileNo && (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Phone className="w-4 h-4" />
                    <span>+91 {userData.mobileNo}</span>
                  </div>
                )}
                {userData.location && (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{userData.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Total Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-950/50 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{userData.totalOrder}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <ShoppingBag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Total Earning */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-950/50 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Earning</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{formatCurrency(userData.totalEarning)}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-950/50 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{formatCurrency(userData.totalSpent)}</p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-950/50 p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-green-500 dark:border-green-400 pl-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Clerk ID</p>
              <p className="text-gray-800 dark:text-gray-100 font-mono text-sm">{userData.clerkId}</p>
            </div>
            <div className="border-l-4 border-blue-500 dark:border-blue-400 pl-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Account Type</p>
              <p className="text-gray-800 dark:text-gray-100 font-semibold capitalize">{userData.role}</p>
            </div>
            <div className="border-l-4 border-purple-500 dark:border-purple-400 pl-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Member Since
              </p>
              <p className="text-gray-800 dark:text-gray-100">{formatDate(userData.createdAt)}</p>
            </div>
            <div className="border-l-4 border-pink-500 dark:border-pink-400 pl-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Last Updated
              </p>
              <p className="text-gray-800 dark:text-gray-100">{formatDate(userData.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Net Balance (if applicable) */}
        {userData.role === 'farmer' && (
          <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-2xl shadow-lg dark:shadow-green-900/50 p-8 text-white">
            <h3 className="text-xl font-semibold mb-2">Net Balance</h3>
            <p className="text-4xl font-bold">
              {formatCurrency(userData.totalEarning - userData.totalSpent)}
            </p>
            <p className="text-green-100 dark:text-green-200 mt-2 text-sm">
              Earnings minus expenses
            </p>
          </div>
        )}
      </div>
    </div>
  );
}