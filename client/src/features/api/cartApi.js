import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const CART_API = `${import.meta.env.VITE_API_BASE_URL}/api/v1/cart`;

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: CART_API,
    credentials: "include",
  }),

  tagTypes: ["Cart"],

  endpoints: (builder) => ({
    // 1️⃣ Add crop to cart
    addToCart: builder.mutation({
      query: ({cropId}) => ({
        url: `addItem/${cropId}`,
        method: "POST",
        body: { cropId },
      }),
      invalidatesTags: ["Cart"],
    }),

    // 2️⃣ Get buyer cart
    getCart: builder.query({
      query: () => ({
        url: "getCartItems",
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),

    // 3️⃣ Remove item from cart
    removeFromCart: builder.mutation({
      query: ({cropId}) => ({
        url: `removeitem/${cropId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // 4️⃣ Clear entire cart (optional)
    clearCart: builder.mutation({
      query: () => ({
        url: "clearItems",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
