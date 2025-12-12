/*🟩 2. What is an API (RTK Query)? (createApi)
An API file is for backend communication.
You use it when you want to:
call backend

send HTTP requests

fetch data

save data in DB

👉 API = backend connection
👉 Automatically manages async logic
👉 No manual dispatch needed */

// src/services/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../slice/authSlice";

const USER_API = "http://localhost:5000/api/v1/user/";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include", // keep if using Clerk session cookies
  }),
  endpoints: (builder) => ({
    // 1) registerUser mutation
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register-user",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) dispatch(userLoggedIn({ user: data.user }));
        } catch (error) {
          console.log("Backend error in register:", error);
        }
      },
    }),

    // 2) syncUser mutation
    syncUser: builder.mutation({
      query: ({ email, token }) => ({
        url: "sync",
        method: "POST",
        body: { email },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) dispatch(userLoggedIn({ user: data.user }));
        } catch (error) {
          console.log("Backend error in sync user:", error);
        }
      },
    }),

    // (Optional) you can also add login/logout mutations similarly
  }),
});

export const { useRegisterUserMutation, useSyncUserMutation } = authApi;
export default authApi;
