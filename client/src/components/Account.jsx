import React, { useState } from 'react';
import { User, MapPin, Phone, Sprout } from 'lucide-react';

const Account = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'buyer',
    location: '',
    mobile: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.mobile.trim() || formData.mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/users/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Created!</h2>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-full bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 w-full">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Sprout className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to AgroConnect</h1>
          <p className="text-gray-600">Complete your profile to get started</p>
        </div>

        <div className="space-y-5">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                id="mobile"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                placeholder="10-digit mobile number"
                maxLength="10"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => handleChange('role', 'farmer')}
                className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                  formData.role === 'farmer'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <Sprout className={`w-6 h-6 mx-auto mb-1 ${formData.role === 'farmer' ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="font-medium text-sm">Farmer</span>
                </div>
              </div>
              
              <div
                onClick={() => handleChange('role', 'buyer')}
                className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                  formData.role === 'buyer'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <User className={`w-6 h-6 mx-auto mb-1 ${formData.role === 'buyer' ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="font-medium text-sm">Buyer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                placeholder="City or region"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.name.trim() || !formData.mobile.trim()}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition disabled:bg-gray-300 disabled:cursor-not-allowed mt-6"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </span>
            ) : (
              'Complete Setup'
            )}
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Your email is automatically linked from your account
        </p>
      </div>
    </div>
  );
}

export default Account;
