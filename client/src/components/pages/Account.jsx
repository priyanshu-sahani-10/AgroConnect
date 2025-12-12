import React, { useState, useRef } from "react";
import { User, MapPin, Phone, Sprout, Camera, X } from "lucide-react";
import { useRegisterUserMutation } from "@/features/api/authApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const authUser = useSelector((state) => state.auth.user);
  const userEmail = authUser?.email;
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "buyer",
    location: "",
    mobileNo: "",
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  const [registerUser, { isLoading, isError, error, isSuccess }] =
    useRegisterUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("mobileNo", formData.mobileNo);
    formDataToSend.append("email", userEmail);
    
    if (formData.photo) {
      formDataToSend.append("photo", formData.photo);
    }

    try {
      const res = await registerUser(formDataToSend).unwrap();
      console.log("Register response:", res);
      alert("Account created successfully.");
      navigate("/");
    } catch (err) {
      console.error("Error creating account:", err);
    }
  };

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
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-950/50 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Profile Created!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-full bg-linear-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 w-full">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-950/50 p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <Sprout className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Welcome to AgroConnect
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Complete your profile to get started</p>
        </div>

        <div className="space-y-5">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Photo
            </label>
            <div className="flex flex-col items-center">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-green-100 dark:border-green-900"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 dark:bg-red-600 text-white rounded-full p-1 hover:bg-red-600 dark:hover:bg-red-700 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 dark:hover:border-green-400 transition bg-gray-50 dark:bg-gray-700"
                >
                  <Camera className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Add Photo</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              {!photoPreview && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                >
                  Upload Photo
                </button>
              )}
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label
              htmlFor="mobileNo"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="tel"
                id="mobileNo"
                value={formData.mobileNo}
                onChange={(e) =>
                  handleChange(
                    "mobileNo",
                    e.target.value.replace(/\D/g, "").slice(0, 10)
                  )
                }
                className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
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
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="City or region"
              />
            </div>
          </div>

          {/* Error Message */}
          {isError && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error?.data?.message || "An error occurred"}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-green-600 dark:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-800 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900 transition disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed mt-6 shadow-md dark:shadow-green-900/50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating...
              </span>
            ) : (
              "Complete Setup"
            )}
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          Your email is automatically linked from your account
        </p>
      </div>
    </div>
  );
};

export default Account;