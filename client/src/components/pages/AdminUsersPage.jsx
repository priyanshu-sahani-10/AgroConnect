import React, { useState } from 'react';
import {
  Users, Search, Filter, Mail, Phone, MapPin,
  DollarSign, ShoppingCart, Calendar, Ban, CheckCircle
} from 'lucide-react';
import {
  useBlockUnblockUserMutation,
  useGetAdminAllUsersQuery
} from '@/features/api/adminApi';

const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const { data, isError, isLoading, error } = useGetAdminAllUsersQuery();
  const [blockUnblockUser] = useBlockUnblockUserMutation();

  const users = data?.users || [];

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.clerkId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'farmer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'buyer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      const response = await blockUnblockUser({
        userId,
        isBlocked: !isBlocked,
      }).unwrap();
      alert(response.message);
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6">
          <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Error</h3>
          <p className="text-red-600 dark:text-red-300">
            {error?.message || 'Failed to load users'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              User Management
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and view all registered users
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Stat label="Total Users" value={users.length} />
          <Stat label="Admins" value={users.filter(u => u.role === 'admin').length} />
          <Stat label="Farmers" value={users.filter(u => u.role === 'farmer').length} />
          <Stat label="Buyers" value={users.filter(u => u.role === 'buyer').length} />
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 transition-colors">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg transition-colors"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg transition-colors"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {['User', 'Role', 'Contact', 'Stats', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      {user.imageUrl ? (
                        <img src={user.imageUrl} className="h-10 w-10 rounded-full" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                          {user.name?.[0] || 'U'}
                        </div>
                      )}
                      <span className="text-gray-900 dark:text-gray-100">{user.name}</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center"><Mail className="w-4 h-4 mr-2" />{user.email}</div>
                      {user.mobileNo && <div className="flex items-center"><Phone className="w-4 h-4 mr-2" />{user.mobileNo}</div>}
                      {user.location && <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{user.location}</div>}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <div className="text-green-600">₹{user.totalEarning} earned</div>
                      <div className="text-red-600">₹{user.totalSpent} spent</div>
                      <div className="text-blue-600">{user.totalOrder} orders</div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleBlockUser(user._id, user.isBlocked)}
                        className={`px-3 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-colors
                          ${user.isBlocked
                            ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200'
                          }`}
                      >
                        {user.isBlocked ? <CheckCircle size={16} /> : <Ban size={16} />}
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-colors">
    <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
  </div>
);

export default AdminUsersPage;
