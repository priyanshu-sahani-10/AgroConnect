import {
  useGetSingleCropQuery,
  useUpdateUserCropMutation,
} from "@/features/api/cropApi";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Package,
  Wheat,
  Calendar,
  MapPin,
  Upload,
  ArrowLeft,
} from "lucide-react";

function UpdateUserCrop() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    productionYear: "",
    description: "",
    price: "",
    location: "",
    available: "",
    imageUrl: null,
  });

  const { cropId } = useParams();
  const navigate = useNavigate();
//   console.log("cropId in updatecrop : ", cropId);

  const [
    updateUserCrop,
    { updateCropError: isError, isLoading: updateCropLoading },
  ] = useUpdateUserCropMutation();
  const { data, isLoading: getCropLoading } = useGetSingleCropQuery({ cropId });
  const cropData = data?.data;
//   console.log("DATA in updateCrop : ", data);
//   console.log("cropdata in updateCrop : ", cropData);

  useEffect(() => {
    if (cropData) {
      const {
        name,
        category,
        productionYear,
        description,
        price,
        location,
        available,
      } = cropData;

      setFormData({
        name: name || "",
        category: category || "",
        productionYear: productionYear || "",
        description: description || "",
        price: price || "",
        location: location || "",
        available: available || "",
        imageUrl: null,
      });
    }
  }, [cropData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("productionYear", formData.productionYear);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("available", formData.available);
      formDataToSend.append("location", formData.location);
      if (formData.imageUrl) {
        formDataToSend.append("imageUrl", formData.imageUrl);
      }
      const res = await await updateUserCrop({
        cropId,
        formData: formDataToSend,
      }).unwrap();
      if (res.success) {
        alert("✅ Issue updated successfully!");
        navigate("/my-products");
      } else {
        alert("⚠️ Failed to update issue.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("❌ Something went wrong while updating crop.");
    }
  };

  if (getCropLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
          <p className="mt-6 text-gray-700 dark:text-gray-300 font-semibold text-lg">
            Loading crop data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/my-products")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to My Products</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
            Update Crop
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Modify your crop information below
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <form onSubmit={onSubmit}>
            {/* Image Preview Section */}
            {cropData?.imageUrl && !formData.imageUrl && (
              <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={cropData.imageUrl}
                  alt={cropData.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex items-center gap-1 px-4 py-2 rounded-full bg-green-500 text-white backdrop-blur-sm border-2 border-white shadow-lg">
                  <Package className="w-5 h-5" />
                  <span className="text-sm font-bold">Current Image</span>
                </div>
              </div>
            )}

            <div className="p-8 space-y-6">
              {/* Crop Name */}
              <div>
                <label
                  htmlFor="name"
                  className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <Wheat className="w-4 h-4 mr-2 text-green-500" />
                  Crop Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-all"
                  required
                />
              </div>

              {/* Category & Production Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="category"
                    className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <Wheat className="w-4 h-4 mr-2 text-green-500" />
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-all"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="productionYear"
                    className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <Calendar className="w-4 h-4 mr-2 text-green-500" />
                    Production Year
                  </label>
                  <input
                    type="text"
                    id="productionYear"
                    name="productionYear"
                    value={formData.productionYear}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-all resize-none"
                  required
                />
              </div>

              {/* Price & Available */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Price per kg (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 font-semibold transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="available"
                    className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <Package className="w-4 h-4 mr-2 text-green-500" />
                    Available Quantity (kg)
                  </label>
                  <input
                    type="number"
                    id="available"
                    name="available"
                    value={formData.available}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <MapPin className="w-4 h-4 mr-2 text-green-500" />
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-all"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label
                  htmlFor="imageUrl"
                  className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  <Upload className="w-4 h-4 mr-2 text-green-500" />
                  Update Crop Image (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="imageUrl"
                    name="imageUrl"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-gray-100 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-green-600 file:to-emerald-600 file:text-white hover:file:from-green-700 hover:file:to-emerald-700 file:cursor-pointer"
                  />
                </div>
                {formData.imageUrl && (
                  <div className="mt-3 flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                    <Upload className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                      New image selected: {formData.imageUrl.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={updateCropLoading}
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updateCropLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Package className="w-5 h-5" />
                      <span>Update Crop</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/my-products")}
                  className="px-8 py-3.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateUserCrop;
