import React, { useState } from "react";
import {
  Package,
  Calendar,
  Phone,
  User,
  MapPin,
  CheckCircle,
  Truck,
  Box,
  IndianRupee,
  ChevronRight,
  Filter,
  ShoppingBag,
} from "lucide-react";
import { useGetMyOrdersQuery } from "@/features/api/orderApi";
import { useAuth } from "@clerk/clerk-react";
const { isLoaded, isSignedIn } = useAuth();
const MyOrders = () => {
  const { data, isLoading, isError } = useGetMyOrdersQuery(undefined, {
  skip: !isLoaded || !isSignedIn,
});
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const orders = data?.orders || [];
  const totalOrders = data?.totalOrders || 0;
  const role=data?.role==="farmer"?"Buyer":"Farmer";
  const userRole=role.toLowerCase();

  // Filter orders by status
  const filteredOrders =
    selectedStatus === "ALL"
      ? orders
      : orders.filter((order) => order.orderStatus === selectedStatus);

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      CREATED: {
        bg: "bg-gray-100 dark:bg-gray-700",
        text: "text-gray-700 dark:text-gray-300",
        icon: Box,
        label: "Order Created",
      },
      CONFIRMED: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-300",
        icon: CheckCircle,
        label: "Confirmed",
      },
      SHIPPED: {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-700 dark:text-orange-300",
        icon: Truck,
        label: "Shipped",
      },
      DELIVERED: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300",
        icon: CheckCircle,
        label: "Delivered",
      },
    };

    const config = statusConfig[status] || statusConfig.CREATED;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}
      >
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  // Payment status badge
  const getPaymentBadge = (status) => {
    const config = {
      PAID: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300",
        label: "Paid",
      },
      PENDING: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-300",
        label: "Pending",
      },
      FAILED: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-300",
        label: "Failed",
      },
    };

    const style = config[status] || config.PENDING;
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}
      >
        {style.label}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Failed to Load Orders
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Unable to fetch your orders. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-16 h-16 text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            No Orders Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't placed any orders. Start shopping to see your orders
            here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8 text-green-600 dark:text-green-400" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
              My Orders
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage your {totalOrders} order
            {totalOrders !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Filter by Status
            </span>
          </div>
          <div className="flex gap-3 flex-wrap">
            {["ALL", "CREATED", "CONFIRMED", "SHIPPED", "DELIVERED"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedStatus === status
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {status === "ALL" ? "All Orders" : status}
                </button>
              )
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No orders found with status: {selectedStatus}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Order ID
                      </p>
                      <p className="font-mono font-semibold text-gray-800 dark:text-gray-100">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {getPaymentBadge(order.paymentStatus)}
                      {getStatusBadge(order.orderStatus)}
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Product Info */}
                    <div className="lg:col-span-2">
                      <div className="flex gap-4">
                        {order.crop?.imageUrl && (
                          <img
                            src={order.crop.imageUrl}
                            alt={order.crop.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                            {order.crop?.name || "Crop"}
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Package className="w-4 h-4 text-green-500" />
                              <span>
                                Quantity: {order.quantity} kg × ₹
                                {order.pricePerKg.toFixed(2)}
                              </span>
                            </div>
                            {order[userRole] && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <User className="w-4 h-4 text-green-500" />
                                <span>{role}: {order[userRole].name}</span>
                              </div>
                            )}
                            {order[userRole]?.mobileNo && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Phone className="w-4 h-4 text-green-500" />
                                <span>{order[userRole].mobileNo}</span>
                              </div>
                            )}
                            {order.deliveryAddress && (
                              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <MapPin className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-2">
                                  {`Delivered To :-> ${order.deliveryAddress}`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="lg:col-span-1">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
                          Order Summary
                        </h4>
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Subtotal</span>
                            <span>
                              ₹{(order.pricePerKg * order.quantity).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Delivery</span>
                            <span>₹50.00</span>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-800 dark:text-gray-100">
                              Total
                            </span>
                            <div className="flex items-center gap-1">
                              <IndianRupee className="w-5 h-5 text-green-600 dark:text-green-400" />
                              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {order.totalAmount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Footer */}
                <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {order.razorpayPaymentId && (
                        <span>Payment ID: {order.razorpayPaymentId}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
