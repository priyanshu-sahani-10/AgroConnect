import { useState } from "react";
import { 
  ChevronDown, 
  User, 
  LogOut, 
  Edit, 
  ShoppingCart, 
  Package, 
  Mail,
  IndianRupeeIcon,
  ShoppingBag
} from "lucide-react";
import { SignedIn, useClerk } from "@clerk/clerk-react";
import { useSelector } from "react-redux";

const UserProfileDropdown = ({ wrapperClassName = "" }) => {
  const { signOut } = useClerk();
  

  const user=useSelector((state)=> state.auth.user);
  // console.log("user in ProfileDropdown : ",user);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await signOut();
      setDropdownOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${wrapperClassName}`}>
      {/* <span className="text-sm text-gray-600 hidden lg:block">
        Welcome, <span className="font-semibold text-gray-900">{user?.name}</span>
      </span> */}
      
      <div className="relative">
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="w-10 h-10 rounded-full border-2 border-green-500 dark:border-green-400 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white flex items-center justify-center font-bold shadow-md dark:shadow-green-900/50">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 hidden md:block" />
        </button>

        {dropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-950/70 border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
              {/* User Info Header */}
              <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-white/20 flex items-center justify-center font-bold text-lg">
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{user?.name}</p>
                    <p className="text-xs text-green-50 capitalize">{user?.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-50">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{user?.email}</span>
                </div>
              </div>

              {/* Stats Section */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-3">
                  {user.role === "buyer" ? (
                    <>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                          <ShoppingCart className="w-4 h-4" />
                          <span className="text-xs font-medium">Total Orders</span>
                        </div>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">{user.totalOrder}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                          <IndianRupeeIcon className="w-4 h-4" />
                          <span className="text-xs font-medium">Total Spent</span>
                        </div>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">₹{user.totalSpent.toLocaleString()}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                          <Package className="w-4 h-4" />
                          <span className="text-xs font-medium">Total Sales</span>
                        </div>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">{user.totalSales}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                          <IndianRupeeIcon className="w-4 h-4" />
                          <span className="text-xs font-medium">Total Earned</span>
                        </div>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">₹{user.totalEarning.toLocaleString()}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <a href="/profile">
                  <button 
                    onClick={() => setDropdownOpen(false)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm transition-colors text-gray-900 dark:text-gray-100"
                  >
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium">My Profile</span>
                  </button>
                </a>

                <a href="/edit-profile">
                  <button 
                    onClick={() => setDropdownOpen(false)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm transition-colors text-gray-900 dark:text-gray-100"
                  >
                    <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium">Edit Account</span>
                  </button>
                </a>

                {user.role === "buyer" && (
                  <a href="/orders">
                    <button 
                      onClick={() => setDropdownOpen(false)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm transition-colors text-gray-900 dark:text-gray-100"
                    >
                      <ShoppingBag className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="font-medium">My Orders</span>
                    </button>
                  </a>
                ) }

                {user.role === "buyer" && (
                  <a href="/cart-items">
                    <button 
                      onClick={() => setDropdownOpen(false)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm transition-colors text-gray-900 dark:text-gray-100"
                    >
                      <ShoppingCart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="font-medium">My Cart</span>
                    </button>
                  </a>
                ) }



                {user.role === "farmer" && (
                  <a href="/my-products">
                    <button 
                      onClick={() => setDropdownOpen(false)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm transition-colors text-gray-900 dark:text-gray-100"
                    >
                      <Package className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="font-medium">My Products</span>
                    </button>
                  </a>
                )}
              </div>

              {/* Logout */}
                <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                <button
                  onClick={logoutHandler}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center gap-3 text-sm text-red-600 dark:text-red-400 font-medium transition-colors"
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
  );
};

export default UserProfileDropdown;