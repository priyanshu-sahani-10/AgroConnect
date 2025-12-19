import React, { useState, useMemo } from "react";
import {
  Package,
  Calendar,
  MapPin,
  Wheat,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  User,
  Zap,
  Search,
  X,
  Lock,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";

// Dummy crop data
const dummyCrops = [
  {
    _id: "1",
    name: "Organic Basmati Rice",
    description: "Premium quality aromatic basmati rice, perfect for biryanis and special dishes. Naturally grown without pesticides.",
    category: "Cereals",
    price: 85,
    available: 500,
    productionYear: "2024",
    location: "Punjab, India",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
    reportedBy: { name: "Rajesh Kumar" }
  },
  {
    _id: "2",
    name: "Fresh Red Tomatoes",
    description: "Farm-fresh, vine-ripened tomatoes with rich flavor. Perfect for cooking and salads.",
    category: "Vegetables",
    price: 35,
    available: 200,
    productionYear: "2024",
    location: "Maharashtra, India",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80",
    reportedBy: { name: "Priya Sharma" }
  },
  {
    _id: "3",
    name: "Organic Green Moong Dal",
    description: "Protein-rich moong dal, carefully sorted and cleaned. Great source of nutrition.",
    category: "Pulses",
    price: 120,
    available: 300,
    productionYear: "2024",
    location: "Rajasthan, India",
    imageUrl: "https://5.imimg.com/data5/SELLER/Default/2021/11/VP/KI/AM/10888193/whole-green-moong.jpeg",
    reportedBy: { name: "Amit Patel" }
  },
  {
    _id: "4",
    name: "Golden Wheat Grains",
    description: "High-quality wheat grains, ideal for making flour and various traditional dishes.",
    category: "Grains",
    price: 25,
    available: 1000,
    productionYear: "2024",
    location: "Haryana, India",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
    reportedBy: { name: "Suresh Singh" }
  },
  {
    _id: "5",
    name: "Fresh Green Spinach",
    description: "Crisp and fresh spinach leaves, packed with iron and vitamins. Harvested this morning.",
    category: "Vegetables",
    price: 40,
    available: 150,
    productionYear: "2024",
    location: "Uttar Pradesh, India",
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80",
    reportedBy: { name: "Meena Devi" }
  },
  {
    _id: "6",
    name: "Red Chili Powder",
    description: "Authentic Indian red chili powder with perfect heat level. Adds vibrant color and spice to dishes.",
    category: "Spices",
    price: 180,
    available: 100,
    productionYear: "2024",
    location: "Andhra Pradesh, India",
    imageUrl: "https://www.neonaturalindustries.com/wp-content/uploads/2022/06/red-chillies.jpg",
    reportedBy: { name: "Venkat Rao" }
  },
  {
    _id: "7",
    name: "Sweet Alphonso Mangoes",
    description: "The king of mangoes! Juicy, aromatic Alphonso mangoes straight from the orchard.",
    category: "Fruits",
    price: 250,
    available: 80,
    productionYear: "2024",
    location: "Konkan, Maharashtra",
    imageUrl: "https://farmlovers.org/blobs/stickies/c084827c-0f30-4990-afde-1e3d0fc66320.jpg",
    reportedBy: { name: "Ganesh Naik" }
  },
  {
    _id: "8",
    name: "Fresh Green Peas",
    description: "Sweet and tender green peas, perfect for curries and rice dishes. Freshly shelled.",
    category: "Vegetables",
    price: 60,
    available: 120,
    productionYear: "2024",
    location: "Himachal Pradesh, India",
    imageUrl: "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=800&q=80",
    reportedBy: { name: "Sanjay Thakur" }
  },
  {
    _id: "9",
    name: "Turmeric Powder",
    description: "Pure turmeric powder with natural golden color. Known for its medicinal properties and culinary uses.",
    category: "Spices",
    price: 160,
    available: 200,
    productionYear: "2024",
    location: "Tamil Nadu, India",
    imageUrl: "https://www.viralspices.com/wp-content/uploads/2022/01/Evaluating-the-Differences-between-Fresh-and-Dried-Turmeric.jpg",
    reportedBy: { name: "Lakshmi Iyer" }
  }
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

const ITEMS_PER_PAGE = 6;

const LandingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const filteredCrops = useMemo(() => {
    let result =
      selectedCategory === "All"
        ? dummyCrops
        : dummyCrops.filter((crop) => crop.category === selectedCategory);

    if (!searchQuery.trim()) return result;

    const query = searchQuery.toLowerCase();
    return result.filter(
      (crop) =>
        crop.name?.toLowerCase().includes(query) ||
        crop.description?.toLowerCase().includes(query) ||
        crop.location?.toLowerCase().includes(query) ||
        crop.category?.toLowerCase().includes(query) ||
        crop.reportedBy?.name?.toLowerCase().includes(query)
    );
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredCrops.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCrops = filteredCrops.slice(startIndex, endIndex);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleActionClick = () => {
    setShowLoginPrompt(true);
    setTimeout(() => setShowLoginPrompt(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header with Call to Action */}
        <div className="mb-8 relative">
          <div className="absolute top-0 right-0">
           
          </div>

          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            AgroConnect Marketplace
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Fresh crops directly from farmers to your doorstep
          </p>
          <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
            🌾 Preview Mode - Login to access full marketplace
          </div>
        </div>

        {/* Login Prompt Toast */}
        {showLoginPrompt && (
          <div className="fixed top-20 right-6 z-50 bg-white dark:bg-gray-800 border-2 border-green-500 rounded-lg shadow-2xl p-4 animate-fade-in max-w-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Login Required
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please login or sign up to add items to cart and make purchases.
                </p>
              </div>
            </div>
          </div>
        )}

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

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 transition-colors duration-300">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by crop name, location, farmer name, or description..."
              className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        {filteredCrops.length > 0 && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredCrops.length)}{" "}
            of {filteredCrops.length} crops
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
                  Try adjusting your search or category filter.
                </p>
              </div>
            </div>
          ) : (
            currentCrops.map((crop) => (
              <div
                key={crop._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group border border-transparent dark:border-gray-700 relative"
              >
                {/* Preview Badge Overlay */}
                <div className="absolute top-2 left-2 z-10 px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                  Preview
                </div>

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
                        <span>Owner: {crop.reportedBy.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons with Lock Icon */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={handleActionClick}
                      className="flex-1 px-3 py-2.5 bg-white dark:bg-gray-700 border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 rounded-lg font-medium text-sm hover:bg-green-50 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2 relative"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <Lock className="w-3 h-3 absolute top-1 right-1" />
                      Add to Cart
                    </button>
                    <button
                      onClick={handleActionClick}
                      className="flex-1 px-3 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md relative"
                    >
                      <Zap className="w-4 h-4" />
                      <Lock className="w-3 h-3 absolute top-1 right-1" />
                      Buy Now
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

        {/* Bottom CTA Banner */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-xl p-8 text-center text-white mb-8">
          <h2 className="text-3xl font-bold mb-3">
            Ready to Connect with Farmers?
          </h2>
          <p className="text-green-50 mb-6 max-w-2xl mx-auto">
            Join AgroConnect today to access fresh, quality crops directly from
            farmers. Support local agriculture and get the best produce delivered
            to your doorstep.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to='/sign-up'
              className="px-8 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <UserPlus className="w-5 h-5" />
              Create Account
            </Link>
            <Link
              to='/sign-in'
              className="px-8 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition-all duration-200 flex items-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Login Now
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;