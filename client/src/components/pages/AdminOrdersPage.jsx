import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

import {
  ShoppingCart,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Package,
  Phone,
  User,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  IndianRupee,
} from "lucide-react";
import { useGetAdminAllOrdersQuery } from "@/features/api/adminApi";

const AdminOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { isLoaded, isSignedIn } = useAuth();
  const { data, isLoading, isError } = useGetAdminAllOrdersQuery(undefined, {
    skip: !isLoaded || !isSignedIn,
  });

  // console.log("data in adminOrderpage ", data);

  const orders = data?.orders || [];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.farmer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.crop?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      order.orderStatus.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        color:
          "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
        icon: Clock,
        label: "Pending",
      },
      CONFIRMED: {
        color:
          "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
        icon: CheckCircle,
        label: "Confirmed",
      },
      SHIPPED: {
        color:
          "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
        icon: Truck,
        label: "Shipped",
      },
      DELIVERED: {
        color:
          "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
        icon: CheckCircle,
        label: "Delivered",
      },
      CREATED: {
        color:
          "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
        icon: XCircle,
        label: "Created",
      },
    };
    return configs[status] || configs.PENDING;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateStats = () => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );
    const pendingOrders = orders.filter(
      (o) => o.orderStatus === "CREATED"
    ).length;
    const completedOrders = orders.filter(
      (o) => o.orderStatus === "CONFIRMED"
    ).length;

    return { totalRevenue, pendingOrders, completedOrders };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 dark:text-red-400 font-semibold mb-2">
            Error
          </h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded hover:bg-red-700 dark:hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Order Management
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage all platform orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Orders
              </div>
              <Package className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {orders.length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Revenue
              </div>
              <IndianRupee className="w-5 h-5 text-green-500 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ₹{stats.totalRevenue.toLocaleString()}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Pending
              </div>
              <Clock className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.pendingOrders}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Completed
              </div>
              <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.completedOrders}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order ID, buyer, farmer, or crop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 dark:text-gray-500 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="created">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-8 text-center text-gray-500 dark:text-gray-400">
              No orders found matching your criteria
            </div>
          ) : (
            filteredOrders.map((order, index) => {
              const statusConfig = getStatusConfig(order.orderStatus);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={order._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 hover:shadow-md dark:hover:shadow-gray-900/70 transition-shadow"
                >
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="mb-3 md:mb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Order #{index + 1}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color} flex items-center gap-1`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Total Amount
                        </div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          ₹{order.totalAmount?.toLocaleString() || 0}
                        </div>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Crop Details */}
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Product Details
                        </div>
                        {order.crop ? (
                          <div className="flex items-start gap-3">
                            {order.crop.imageUrl ? (
                              <img
                                src={order.crop.imageUrl}
                                alt={order.crop.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <Package className="w-8 h-8 text-green-600 dark:text-green-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {order.crop.name}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Quantity:{" "}
                                <span className="font-semibold">
                                  {order.quantity}
                                </span>{" "}
                                {order.unit || "units"}
                              </div>
                              <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                                ₹{order.crop.price}/unit
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Crop details unavailable
                          </div>
                        )}
                      </div>

                      {/* Buyer Details */}
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Buyer Information
                        </div>
                        {order.buyer ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {order.buyer.name}
                              </span>
                            </div>
                            {order.buyer.mobileNo && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {order.buyer.mobileNo}
                                </span>
                              </div>
                            )}
                            {order.deliveryAddress && (
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                <div className="font-medium mb-1">
                                  Delivery Address:
                                </div>
                                <div className="text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded">
                                  {order.deliveryAddress}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Buyer details unavailable
                          </div>
                        )}
                      </div>

                      {/* Farmer Details */}
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Farmer Information
                        </div>
                        {order.farmer ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {order.farmer.name}
                              </span>
                            </div>
                            {order.farmer.mobileNo && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {order.farmer.mobileNo}
                                </span>
                              </div>
                            )}
                            {order.paymentMethod && (
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                <div className="font-medium mb-1">
                                  Payment Method:
                                </div>
                                <div className="text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded capitalize">
                                  {order.paymentMethod}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Farmer details unavailable
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Info */}
                    {order.notes && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Order Notes
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Results Count */}
        <div className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
