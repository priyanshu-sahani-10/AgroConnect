import { useState } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  User,
  LogOut,
  Edit,
  ShoppingCart,
  Package,
  Mail,
  DollarSign,
  ShoppingBag,
  Users,
  ClipboardList,
} from "lucide-react";
import { useClerk } from "@clerk/clerk-react";
import { useSelector } from "react-redux";

const UserProfileDropdown = ({ wrapperClassName = "" }) => {
  const { signOut } = useClerk();
  const user = useSelector((state) => state.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logoutHandler = async () => {
    await signOut();
    setDropdownOpen(false);
  };

  return (
    <div className={`flex items-center ${wrapperClassName}`}>
      {/* Avatar Button */}
      <button
        onClick={() => setDropdownOpen(true)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <div className="w-10 h-10 rounded-full border-2 border-green-500 dark:border-green-400 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white flex items-center justify-center font-bold">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            user?.name?.charAt(0).toUpperCase()
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 hidden md:block" />
      </button>

      {/* PORTAL DROPDOWN */}
      {dropdownOpen &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setDropdownOpen(false)}
            />

            {/* Dropdown */}
            <div
              className="
                fixed z-[9999]
                top-16 right-4
                md:top-20 md:right-8
                w-[90vw] max-w-sm md:w-80
                bg-white dark:bg-gray-800
                rounded-lg shadow-xl
                border border-gray-200 dark:border-gray-700
                overflow-hidden
              "
            >
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-white/20 flex items-center justify-center font-bold text-lg">
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{user?.name}</p>
                    <p className="text-xs capitalize text-green-100">
                      {user?.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-green-100">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{user?.email}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-3">
                  {user.role === "buyer" && (
                    <>
                      <Stat
                        icon={ShoppingCart}
                        label="Orders"
                        value={user.totalOrder}
                      />
                      <Stat
                        icon={DollarSign}
                        label="Spent"
                        value={`₹${user.totalSpent}`}
                      />
                    </>
                  )}

                  {user.role === "farmer" && (
                    <>
                      <Stat
                        icon={Package}
                        label="Sales"
                        value={user.totalOrder}
                      />
                      <Stat
                        icon={DollarSign}
                        label="Earned"
                        value={`₹${user.totalEarning}`}
                      />
                    </>
                  )}

                  {user.role === "admin" && (
                    <>
                      <Stat icon={Users} label="Role" value="Admin" />
                      <Stat icon={ClipboardList} label="Access" value="Full" />
                    </>
                  )}
                </div>
              </div>

              {/* Menu */}
              <MenuItem icon={User} label="My Profile" href="/profile" />
              <MenuItem icon={Edit} label="Edit Account" href="/edit-profile" />

              {(user.role === "buyer" || user.role === "farmer") && (
                <MenuItem
                  icon={ShoppingBag}
                  label="My Orders"
                  href="/my-orders"
                />
              )}

              {user.role === "buyer" && (
                <MenuItem
                  icon={ShoppingCart}
                  label="My Cart"
                  href="/cart-items"
                />
              )}

              {user.role === "farmer" && (
                <MenuItem
                  icon={Package}
                  label="My Products"
                  href="/my-products"
                />
              )}

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
          </>,
          document.body
        )}
    </div>
  );
};

export default UserProfileDropdown;

/* ---------- Helper Components ---------- */

const Stat = ({ icon: Icon, label, value }) => (
  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1 text-xs">
      <Icon className="w-4 h-4" />
      {label}
    </div>
    <p className="text-lg font-bold text-green-600 dark:text-green-400">
      {value}
    </p>
  </div>
);

const MenuItem = ({ icon: Icon, label, href }) => (
  <a href={href}>
    <button className="w-full px-4 py-3 flex items-center gap-3 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
      <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      {label}
    </button>
  </a>
);
