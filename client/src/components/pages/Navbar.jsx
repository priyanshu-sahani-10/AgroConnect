import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  ShoppingCart,
  Package,
  User,
  LogOut,
  ChevronDown,
  Sprout,
  MessageCircle,
} from "lucide-react";
import UserProfileDropdown from "./ProfileDropDown";
import { useSelector } from "react-redux";
import DarkMode from "./DarkMode";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  console.log("User in Navbar : ", user);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logoutHandler = () => {
    console.log("Logout");
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`h-16 md:h-20 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg dark:shadow-gray-800/50"
            : "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md dark:shadow-gray-800/30"
        } border-b border-green-200 dark:border-green-800`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-xl flex items-center justify-center shadow-md dark:shadow-green-900/50">
                <Sprout className="text-white w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                AgroConnect
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {user && user.name && (
                <>
                  <Link to="/">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors">
                      <Home className="w-4 h-4" /> Home
                    </button>
                  </Link>

                  <Link to="/marketplace">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors">
                      <ShoppingCart className="w-4 h-4" /> Marketplace
                    </button>
                  </Link>

                  {user.role === "farmer" && (
                    <Link to="/my-products">
                      <button className="flex items-center gap-2 px-6 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors shadow-md dark:shadow-green-900/50">
                        <Package className="w-4 h-4" /> My Products
                      </button>
                    </Link>
                  )}

                  {user.role === "buyer" && (
                    <Link to="/orders">
                      <button className="flex items-center gap-2 px-6 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors shadow-md dark:shadow-green-900/50">
                        <Package className="w-4 h-4" /> My Orders
                      </button>
                    </Link>
                  )}

                  <Link to="/chat">
                    <button className="flex items-center gap-2 px-4 py-2 border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/50 transition-colors">
                      <MessageCircle className="w-4 h-4" /> Chat
                    </button>
                  </Link>

                  <div className="bg-green-100 dark:bg-green-900/50 rounded-3xl transition-colors">
                    <UserProfileDropdown />
                  </div>
                </>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-4">
              {!user ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/sign-in">
                    <button className="px-4 sm:px-6 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors shadow-md dark:shadow-green-900/50 text-sm sm:text-base">
                      Login
                    </button>
                  </Link>

                  <Link to="/sign-up">
                    <button className="px-4 sm:px-6 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors shadow-md dark:shadow-green-900/50 text-sm sm:text-base">
                      Sign Up
                    </button>
                  </Link>
                </div>
              ) : (
                <>
                  {!user.name && (
                    <Link to="/create-account">
                      <button className="hidden md:block px-4 sm:px-6 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors shadow-md dark:shadow-green-900/50 text-sm sm:text-base">
                        Create Account
                      </button>
                    </Link>
                  )}
                  
                  {/* Mobile Profile Icon - Only show when logged in with name */}
                  {user.name && (
                    <div className="lg:hidden bg-green-100 dark:bg-green-900/50 rounded-full transition-colors">
                      <UserProfileDropdown />
                    </div>
                  )}
                </>
              )}

              {/* Theme toggle - visible on all screens */}
              <DarkMode />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 ${
          mobileMenuOpen ? "visible" : "invisible"
        }`}
      >
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/50 dark:bg-black/70 transition-opacity ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`absolute top-16 md:top-20 right-0 w-full sm:w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] overflow-y-auto transition-transform ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {!user ? (
              <div className="space-y-2 sm:space-y-3">
                <Link to="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-4 py-3 border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/50 transition-colors text-sm sm:text-base font-medium">
                    Login
                  </button>
                </Link>

                <Link to="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-4 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors shadow-md dark:shadow-green-900/50 text-sm sm:text-base font-medium">
                    Sign Up
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {/* User Info Header in Mobile Menu */}
                {user.name && (
                  <div className="pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-md dark:shadow-green-900/50">
                        {user?.imageUrl ? (
                          <img src={user.imageUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          user?.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-base truncate">{user.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{user.role}</p>
                      </div>
                    </div>
                  </div>
                )}

                {user.name ? (
                  <>
                    <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 rounded-lg text-gray-900 dark:text-gray-100 transition-colors text-sm sm:text-base">
                        <Home className="w-4 h-4 sm:w-5 sm:h-5" /> 
                        <span>Home</span>
                      </button>
                    </Link>

                    <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 rounded-lg text-gray-900 dark:text-gray-100 transition-colors text-sm sm:text-base">
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" /> 
                        <span>Marketplace</span>
                      </button>
                    </Link>

                    {user.role === "farmer" && (
                      <Link to="/my-products" onClick={() => setMobileMenuOpen(false)}>
                        <button className="w-full px-4 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors shadow-md dark:shadow-green-900/50 flex items-center gap-3 justify-center text-sm sm:text-base font-medium">
                          <Package className="w-4 h-4 sm:w-5 sm:h-5" /> 
                          <span>My Products</span>
                        </button>
                      </Link>
                    )}

                    {user.role === "buyer" && (
                      <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
                        <button className="w-full px-4 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors shadow-md dark:shadow-green-900/50 flex items-center gap-3 justify-center text-sm sm:text-base font-medium">
                          <Package className="w-4 h-4 sm:w-5 sm:h-5" /> 
                          <span>My Orders</span>
                        </button>
                      </Link>
                    )}

                    <Link to="/chat" onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full px-4 py-3 border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/50 transition-colors flex items-center gap-3 justify-center text-sm sm:text-base font-medium">
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" /> 
                        <span>Chat</span>
                      </button>
                    </Link>

                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 rounded-lg text-gray-900 dark:text-gray-100 transition-colors text-sm sm:text-base">
                        <User className="w-4 h-4 sm:w-5 sm:h-5" /> 
                        <span>My Profile</span>
                      </button>
                    </Link>

                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={logoutHandler}
                        className="w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center gap-3 rounded-lg transition-colors text-sm sm:text-base font-medium"
                      >
                        <LogOut className="w-4 h-4 sm:w-5 sm:h-5" /> 
                        <span>Log out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <Link to="/create-account" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full px-4 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors shadow-md dark:shadow-green-900/50 text-sm sm:text-base font-medium">
                      Create Account
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}