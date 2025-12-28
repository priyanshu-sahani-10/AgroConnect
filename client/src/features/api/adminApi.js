import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ADMIN_API = `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin`;

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ADMIN_API,
    credentials: "include",
  }),

  tagTypes: ["AdminUsers", "AdminOrders"],

  endpoints: (builder) => ({
    // 1. Get all users (Admin)
    getAdminAllUsers: builder.query({
      query: () => ({
        url: "getAllUsers",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["AdminUsers"],
    }),

    // 2. Get all orders (Admin)
    getAdminAllOrders: builder.query({
      query: () => ({
        url: "getAllOrders",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["AdminOrders"],
    }),

    blockUnblockUser: builder.mutation({
      query: ({ userId, isBlocked }) => ({
        url: `block-unblock/${userId}`,
        method: "PATCH",
        body: { isBlocked },
      }),
      invalidatesTags: ["AdminUsers"],
    }),

  }),
});

export const {
  useGetAdminAllUsersQuery,
  useGetAdminAllOrdersQuery,
  useBlockUnblockUserMutation,
} = adminApi;
