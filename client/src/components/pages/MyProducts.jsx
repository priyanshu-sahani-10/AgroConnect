import React, { useState } from "react";
import {
  Package,
  Calendar,
  MapPin,
  Wheat,
  Edit,
  Trash2,
  User,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  useDeleteUserCropMutation,
  useGetAllUserCropQuery,
} from "@/features/api/cropApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ITEMS_PER_PAGE = 9;

const MyProducts = () => {
  const { data, isLoading, isSuccess, isError } = useGetAllUserCropQuery();
  const [deleteUserCrop, {isLoading:isDeleting}] = useDeleteUserCropMutation();
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const crops = data?.data || [];
  

  //user from selector;
  const user=useSelector((state)=>state.auth.user);

  // Pagination calculations
  const totalPages = Math.ceil(crops.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCrops = crops.slice(startIndex, endIndex);

  // Calculate current earnings (from totalEarning field in user model)
  // This should come from the user's actual earnings, but if not available from API,
  // you can calculate from sold crops
  const currentEarnings = user?.totalEarning || 0; // Replace with actual field from your API

  // Calculate potential earnings from remaining stock
  const potentialEarnings = crops.reduce((sum, crop) => {
    return sum + crop.price * crop.available;
  }, 0);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigate = useNavigate();
  const handleEdit = (cropId) => {
    // alert(`cropId is : ,${cropId}`);
    navigate(`/updateCrop/${cropId}`);
  };

  const handleDelete = async (cropId, cropName) => {
    // Add your delete logic here
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      console.log("Delete crop:", cropId);
      const res = await deleteUserCrop({ cropId }).unwrap();
      console.log("Delete crop res : ", res);
      if (res.success) {
        alert(res.message);
      }
    } catch (error) {
      alert(err?.data?.message || "Failed to delete crop");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Loading your products...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to Load Products
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Unable to fetch your products. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            My Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your crop listings
          </p>
        </div>

        {/* Earnings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Current Earnings */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 dark:text-green-200 text-sm font-medium mb-1">
                  Current Earnings
                </p>
                <p className="text-4xl font-bold text-white">
                  ₹{currentEarnings.toFixed(2)}
                </p>
                <p className="text-green-100 dark:text-green-200 text-sm mt-2">
                  Total earned so far
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Potential Earnings */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700 rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 dark:text-blue-200 text-sm font-medium mb-1">
                  Potential Earnings
                </p>
                <p className="text-4xl font-bold text-white">
                  ₹{potentialEarnings.toFixed(2)}
                </p>
                <p className="text-blue-100 dark:text-blue-200 text-sm mt-2">
                  From remaining stock ({crops.length} products)
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Package className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {crops.length > 0 && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, crops.length)} of{" "}
            {crops.length} products
          </div>
        )}

        {/* Products Grid */}
        {crops.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Products Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You haven't added any products. Start by adding your first crop!
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200">
                Add Your First Product
              </button>
            </div>
          </div>
        ) : (
          <div className=" grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {currentCrops.map((crop) => (
              <div
                key={crop._id}
                className=" group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-transparent dark:border-gray-700"
              >
                {/* Image */}
                {crop.imageUrl && (
                  <div className=" relative h-48 overflow-hidden">
                    <img
                      src={crop.imageUrl}
                      alt={crop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500 text-white backdrop-blur-sm border-2 border-white shadow-lg">
                      <Package className="w-4 h-4" />
                      <span className="text-xs font-bold">
                        {crop.available}kg
                      </span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-1">
                    {crop.name}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm">
                    {crop.description}
                  </p>

                  {/* Price Tag */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Price per kg
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                          ₹{crop.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Wheat className="w-4 h-4 mr-2 text-green-500 dark:text-green-400" />
                      <span>{crop.category}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2 text-green-500 dark:text-green-400" />
                      <span>Harvested in {crop.productionYear}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2 text-green-500 dark:text-green-400" />
                      <span className="line-clamp-1">{crop.location}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => handleEdit(crop._id)}
                      className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(crop._id, crop.name)}
                      disabled={isDeleting}
                      className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pb-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        currentPage === page
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span
                      key={page}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProducts;
