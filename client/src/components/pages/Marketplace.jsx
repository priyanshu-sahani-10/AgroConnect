import React, { useState } from "react";
import {
  Package,
  Calendar,
  MapPin,
  IndianRupeeIcon,
  Wheat,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  User,
} from "lucide-react";
import { useGetAllCropQuery } from "@/features/api/cropApi.js";
import { useNavigate } from "react-router-dom";

// Mock data - replace with your actual API data
const mockCrops = [
  {
    _id: "1",
    name: "Organic Wheat",
    category: "Cereals",
    productionYear: "2024",
    description:
      "Premium quality organic wheat grown without pesticides. Perfect for making flour and bread.",
    price: 45.5,
    location: "Mumbai, Maharashtra",
    available: 500,
    imageUrl:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800",
    farmer: { name: "Rajesh Kumar", _id: "f1" },
    createdAt: "2024-12-01",
  },
  {
    _id: "2",
    name: "Basmati Rice",
    category: "Grains",
    productionYear: "2024",
    description:
      "Aromatic long-grain basmati rice, aged for perfect cooking quality.",
    price: 85.0,
    location: "Punjab",
    available: 1000,
    imageUrl:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800",
    farmer: { name: "Simran Singh", _id: "f2" },
    createdAt: "2024-11-28",
  },
  {
    _id: "3",
    name: "Masoor Dal",
    category: "Pulses",
    productionYear: "2024",
    description: "High-protein red lentils, perfectly cleaned and sorted.",
    price: 92.0,
    location: "Madhya Pradesh",
    available: 300,
    imageUrl:
      "https://images.unsplash.com/photo-1596040033229-a0b67219daf0?w=800",
    farmer: { name: "Amit Patel", _id: "f3" },
    createdAt: "2024-11-25",
  },
  {
    _id: "4",
    name: "Fresh Tomatoes",
    category: "Vegetables",
    productionYear: "2024",
    description:
      "Farm-fresh red tomatoes, rich in vitamins and perfect for cooking.",
    price: 35.0,
    location: "Karnataka",
    available: 200,
    imageUrl:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800",
    farmer: { name: "Lakshmi Reddy", _id: "f4" },
    createdAt: "2024-12-10",
  },
  {
    _id: "5",
    name: "Alphonso Mangoes",
    category: "Fruits",
    productionYear: "2024",
    description:
      "The king of mangoes - sweet, juicy Alphonso mangoes from Ratnagiri.",
    price: 250.0,
    location: "Ratnagiri, Maharashtra",
    available: 150,
    imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800",
    farmer: { name: "Pradeep Naik", _id: "f5" },
    createdAt: "2024-12-08",
  },
  {
    _id: "6",
    name: "Turmeric Powder",
    category: "Spices",
    productionYear: "2023",
    description:
      "Pure turmeric powder with high curcumin content, naturally grown.",
    price: 180.0,
    location: "Andhra Pradesh",
    available: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800",
    farmer: { name: "Venkat Rao", _id: "f6" },
    createdAt: "2024-12-05",
  },
  {
    _id: "7",
    name: "Green Peas",
    category: "Vegetables",
    productionYear: "2024",
    description:
      "Fresh green peas, harvested at peak ripeness for maximum sweetness.",
    price: 60.0,
    location: "Uttar Pradesh",
    available: 250,
    imageUrl:
      "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=800",
    farmer: { name: "Mohan Verma", _id: "f7" },
    createdAt: "2024-12-11",
  },
  {
    _id: "8",
    name: "Red Chili",
    category: "Spices",
    productionYear: "2024",
    description: "Spicy red chilies with vibrant color and intense flavor.",
    price: 220.0,
    location: "Andhra Pradesh",
    available: 80,
    imageUrl:
      "https://images.unsplash.com/photo-1583032015627-7a5c8b6d6c3e?w=800",
    farmer: { name: "Ravi Kumar", _id: "f8" },
    createdAt: "2024-12-09",
  },
  {
    _id: "9",
    name: "Chickpeas",
    category: "Pulses",
    productionYear: "2024",
    description: "Premium kabuli chana, perfect for curries and salads.",
    price: 95.0,
    location: "Rajasthan",
    available: 400,
    imageUrl:
      "https://images.unsplash.com/photo-1610415946035-bad6fc9b5b6e?w=800",
    farmer: { name: "Sunita Sharma", _id: "f9" },
    createdAt: "2024-12-07",
  },
  {
    _id: "10",
    name: "Green Apples",
    category: "Fruits",
    productionYear: "2024",
    description: "Crisp and tangy green apples from the hills.",
    price: 150.0,
    location: "Himachal Pradesh",
    available: 180,
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800",
    farmer: { name: "Anil Thakur", _id: "f10" },
    createdAt: "2024-12-06",
  },
];

const categories = [
  "All",
  "Cereals",
  "Grains",
  "Pulses",
  "Fruits",
  "Vegetables",
  "Spices",
  "Other",
];

const ITEMS_PER_PAGE = 9;

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const navigate=useNavigate();
  // Simulate API data
  const { data, isError, isLoading } = useGetAllCropQuery();
  // console.log("backend crops : ", data);

  const crops = data?.data || [];

  const filteredCrops =
    selectedCategory === "All"
      ? crops
      : crops.filter((crop) => crop.category === selectedCategory);

  const sortedCrops = [...filteredCrops].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Pagination calculations
  const totalPages = Math.ceil(sortedCrops.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCrops = sortedCrops.slice(startIndex, endIndex);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCropClick = (crop) => {
    setSelectedCrop(crop._id);
    // console.log("selectedCrop : ",);
    // console.log("selectedCrop : ",selectedCrop);
    navigate(`/marketplace/${crop._id}`);
  };

  const handleAddToCart = (cropId) => {
    alert(`Crop ${cropId} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg">Loading crops…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-red-600">
          Failed to load crops. Try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            AgroConnect Marketplace
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fresh crops directly from farmers to your doorstep
          </p>
        </div>

        {/* Category Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 transition-colors duration-300">
          <div className="flex gap-3 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        {sortedCrops.length > 0 && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, sortedCrops.length)} of{" "}
            {sortedCrops.length} crops
          </div>
        )}

        {/* Crops Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {currentCrops.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-colors duration-300">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wheat className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Crops Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No crops in this category. Check back later or try another
                  category.
                </p>
              </div>
            </div>
          ) : (
            currentCrops.map((crop) => (
              <div
                key={crop._id}
                onClick={() => handleCropClick(crop)}
                className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group border border-transparent dark:border-gray-700"
              >
                {/* Image */}
                {crop.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
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

                    {crop.reportedBy && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <User className="w-4 h-4 mr-2 text-green-500 dark:text-green-400" />
                        <span>Owner : {crop.reportedBy.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(crop._id);
                      }}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

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

export default Marketplace;
