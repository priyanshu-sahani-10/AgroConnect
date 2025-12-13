import React, { useState, useRef, useEffect } from "react";
import { User, MapPin, Phone, Sprout, Camera, X, Mail, Edit2, Save } from "lucide-react";
import { useSelector } from "react-redux";
import {  useUpdateUserMutation } from "@/features/api/authApi";

export default function EditProfile() {
    const [updateUser,{isError,isSuccess}]=useUpdateUserMutation();
  const userData = useSelector((state) => state.auth.user);
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ SAFE INITIAL STATE
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    location: "",
    mobileNo: "",
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  // ✅ SYNC REDUX DATA WHEN IT ARRIVES
  useEffect(() => {
    if (userData && !isEditing) {
      setFormData({
        name: userData.name || "",
        role: userData.role || "",
        location: userData.location || "",
        mobileNo: userData.mobileNo || "",
        photo: null,
      });

      setPhotoPreview(userData.imageUrl || null);
    }
  }, [userData, isEditing]);

  // ✅ LOADING GUARD
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Photo size should be less than 5MB");
        return;
      }
      
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photo: null,
    }));
    setPhotoPreview(userData.imageUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("mobileNo", formData.mobileNo);
    
    if (formData.photo) {
      formDataToSend.append("photo", formData.photo);
    }

    

    try {
        console.log("Submitting profile update:", formData);
        
      const result =  await updateUser(formDataToSend).unwrap();
        console.log(" profile update:", result);

      if(result.success){
          alert("Profile updated successfully!");
      }
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userData.name,
      role: userData.role,
      location: userData.location,
      mobileNo: userData.mobileNo,
      photo: null,
    });
    setPhotoPreview(userData.imageUrl);
    setIsEditing(false);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header with Edit Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-950/50 p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Image */}
            <div className="relative">
              {isEditing ? (
                <div className="flex flex-col items-center">
                  <img
                    src={photoPreview || "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-green-200 dark:border-green-900 object-cover"
                  />
                  {formData.photo && (
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-0 right-0 bg-red-500 dark:bg-red-600 text-white rounded-full p-2 hover:bg-red-600 dark:hover:bg-red-700 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                  >
                    <Camera className="w-4 h-4" />
                    Change Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={photoPreview || "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-green-200 dark:border-green-900 object-cover"
                  />
                  <span className={`absolute bottom-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(userData.role)}`}>
                    {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full">
              {isEditing ? (
                <div className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                      <input
                        type="tel"
                        value={formData.mobileNo}
                        onChange={(e) =>
                          handleChange(
                            "mobileNo",
                            e.target.value.replace(/\D/g, "").slice(0, 10)
                          )
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="10-digit mobile number"
                        maxLength="10"
                      />
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      I am a
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        onClick={() => handleChange("role", "farmer")}
                        className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                          formData.role === "farmer"
                            ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
                        }`}
                      >
                        <div className="text-center">
                          <Sprout
                            className={`w-6 h-6 mx-auto mb-1 ${
                              formData.role === "farmer"
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-400 dark:text-gray-500"
                            }`}
                          />
                          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">Farmer</span>
                        </div>
                      </div>

                      <div
                        onClick={() => handleChange("role", "buyer")}
                        className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                          formData.role === "buyer"
                            ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
                        }`}
                      >
                        <div className="text-center">
                          <User
                            className={`w-6 h-6 mx-auto mb-1 ${
                              formData.role === "buyer"
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-400 dark:text-gray-500"
                            }`}
                          />
                          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">Buyer</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="City or region"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                    {userData.name}
                  </h2>
                  <div className="space-y-2 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{userData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>+91 {userData.mobileNo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{userData.location}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-2 bg-green-600 dark:bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Stats Grid - Only visible when not editing */}
        {!isEditing && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-950/50 p-6">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{userData.totalOrder}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-950/50 p-6">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Earning</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{formatCurrency(userData.totalEarning)}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-950/50 p-6">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{formatCurrency(userData.totalSpent)}</p>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-950/50 p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-l-4 border-green-500 dark:border-green-400 pl-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
                  <p className="text-gray-800 dark:text-gray-100 font-medium">{userData.email}</p>
                </div>
                <div className="border-l-4 border-blue-500 dark:border-blue-400 pl-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Account Type</p>
                  <p className="text-gray-800 dark:text-gray-100 font-semibold capitalize">{userData.role}</p>
                </div>
                <div className="border-l-4 border-purple-500 dark:border-purple-400 pl-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Member Since</p>
                  <p className="text-gray-800 dark:text-gray-100">{formatDate(userData.createdAt)}</p>
                </div>
                <div className="border-l-4 border-pink-500 dark:border-pink-400 pl-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Clerk ID</p>
                  <p className="text-gray-800 dark:text-gray-100 font-mono text-sm">{userData.clerkId}</p>
                </div>
              </div>
            </div>

            {/* Net Balance for Farmers */}
            {userData.role === 'farmer' && (
              <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-xl font-semibold mb-2">Net Balance</h3>
                <p className="text-4xl font-bold">
                  {formatCurrency(userData.totalEarning - userData.totalSpent)}
                </p>
                <p className="text-green-100 mt-2 text-sm">
                  Earnings minus expenses
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}