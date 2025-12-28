import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ADMIN_API = `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin`;

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ADMIN_API,
    prepareHeaders: async (headers) => {
      const token = window.Clerk?.session
        ? await window.Clerk.session.getToken()
        : null;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["AdminUsers", "AdminOrders"],

  endpoints: (builder) => ({
    // 1. Get all users (Admin)
    getAdminAllUsers: builder.query({
      query: () => ({
        url: "getAllUsers",
        method: "GET",
        
      }),
      providesTags: ["AdminUsers"],
    }),

    // 2. Get all orders (Admin)
    getAdminAllOrders: builder.query({
      query: () => ({
        url: "getAllOrders",
        method: "GET",
        
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
