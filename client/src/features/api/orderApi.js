import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ORDER_API = "http://localhost:5000/api/v1/order/";

export const orderApi = createApi({
  reducerPath: "orderApi",

  baseQuery: fetchBaseQuery({
    baseUrl: ORDER_API,
    credentials: "include",
  }),

  tagTypes: ["Order"],

  endpoints: (builder) => ({
    // 1️⃣ Create DB Order (Buy Now - Step 2)
    createOrder: builder.mutation({
      query: (inputData) => ({
        url: "create",
        method: "POST",
        body: inputData,
      }),
      invalidatesTags: ["Order"],
    }),

    // 2️⃣ Create Razorpay Order (Step 3)
    createRazorpayOrder: builder.mutation({
      query: (inputData) => ({
        url: "razorpay/create",
        method: "POST",
        body: inputData,
      }),
    }),

    // (Future) Get buyer orders
    getMyOrders: builder.query({
      query: () => ({
        url: "my-orders",
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    verifyRazorpayPayment: builder.mutation({
      query: (paymentData) => ({
        url: "razorpay/verify",
        method: "POST",
        body: paymentData,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useCreateRazorpayOrderMutation,
  useGetMyOrdersQuery,
  useVerifyRazorpayPaymentMutation,
} = orderApi;
