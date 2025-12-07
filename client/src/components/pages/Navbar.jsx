import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton,SignIn } from '@clerk/clerk-react';
import { Menu, X, Home, ShoppingCart, Package, User, LogOut, ChevronDown, Sprout, MessageCircle } from "lucide-react";
import UserProfileDropdown from "./ProfileDropDown";

export default function Navbar() {
  // Replace with your Redux selector
  const user = null; // { name: "John Doe", email: "john@example.com", role: "farmer", photoUrl: "" }
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logoutHandler = () => {
    // Add logout logic
    console.log("Logout");
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`h-16 md:h-20 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-lg shadow-lg"
            : "bg-white/95 backdrop-blur-sm shadow-md"
        } border-b border-green-200`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Sprout className="text-white w-6 h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                AgroConnect
              </h1>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {user && (
                <>
                  <a href="/">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <Home className="w-4 h-4" />
                      Home
                    </button>
                  </a>
                  <a href="/marketplace">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <ShoppingCart className="w-4 h-4" />
                      Marketplace
                    </button>
                  </a>
                  {user.role === "farmer" && (
                    <a href="/my-products">
                      <button className="flex items-center gap-2 px-6 py-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all">
                        <Package className="w-4 h-4" />
                        My Products
                      </button>
                    </a>
                  )}
                  {user.role === "buyer" && (
                    <a href="/orders">
                      <button className="flex items-center gap-2 px-6 py-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all">
                        <Package className="w-4 h-4" />
                        My Orders
                      </button>
                    </a>
                  )}
                  <a href="/chat">
                    <button className="flex items-center gap-2 px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </button>
                  </a>
                </>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    Welcome, <span className="font-semibold text-gray-900">{user?.name}</span>
                  </span>
                  <div className="relative">
                    <button 
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full border-2 border-green-500 bg-linear-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    </button>

                    {dropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setDropdownOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                          <div className="p-4 border-b border-gray-200">
                            <p className="font-semibold">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                          </div>

                          <div className="py-2">
                            <a href="/profile">
                              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm">
                                <User className="w-4 h-4" />
                                My Profile
                              </button>
                            </a>
                            {user.role === "farmer" && (
                              <a href="/my-products">
                                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm">
                                  <Package className="w-4 h-4" />
                                  My Products
                                </button>
                              </a>
                            )}
                            {user.role === "buyer" && (
                              <a href="/orders">
                                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm">
                                  <Package className="w-4 h-4" />
                                  My Orders
                                </button>
                              </a>
                            )}
                          </div>

                          <div className="border-t border-gray-200 py-2">
                            <button
                              onClick={logoutHandler}
                              className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-sm text-red-600"
                            >
                              <LogOut className="w-4 h-4" />
                              Log out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <a href="/sign-in">
                    <button className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                      Login
                    </button>
                  </a>
                  <a href="/sign-up">
                    <button className="px-6 py-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all">
                      Sign Up
                    </button>
                  </a>
                  {/* <a> */}
                    <button className="px-6 py-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all">
                      <UserProfileDropdown/>
                    </button>
                  {/* </a> */}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
          mobileMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Menu Content */}
        <div
          className={`absolute top-16 md:top-20 right-0 w-full sm:w-80 bg-white border-l border-gray-200 shadow-2xl h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] overflow-y-auto transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 space-y-6">
            {user && (
              <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 rounded-full border-2 border-green-500 bg-linear-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            )}

            {user ? (
              <div className="space-y-2">
                <a href="/" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 text-left">
                    <Home className="w-4 h-4" />
                    Home
                  </button>
                </a>
                <a href="/marketplace" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 text-left">
                    <ShoppingCart className="w-4 h-4" />
                    Marketplace
                  </button>
                </a>
                {user.role === "farmer" && (
                  <a href="/my-products" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full flex items-center gap-2 px-4 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg">
                      <Package className="w-4 h-4" />
                      My Products
                    </button>
                  </a>
                )}
                {user.role === "buyer" && (
                  <a href="/orders" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full flex items-center gap-2 px-4 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg">
                      <Package className="w-4 h-4" />
                      My Orders
                    </button>
                  </a>
                )}
                <a href="/chat" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full flex items-center gap-2 px-4 py-3 border-2 border-green-600 text-green-600 rounded-lg">
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </button>
                </a>
                <a href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 text-left">
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                </a>
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={logoutHandler}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <a href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-4 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50">
                    Login
                  </button>
                </a>
                <a href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-4 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg">
                    Sign Up
                  </button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}