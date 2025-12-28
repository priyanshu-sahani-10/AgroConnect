import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const CROP_API = `${import.meta.env.VITE_API_BASE_URL}/api/v1/crop`;

export const cropApi = createApi({
  reducerPath: "cropApi",
  baseQuery: fetchBaseQuery({
    baseUrl: CROP_API,
    credentials: "include",
  }),

  tagTypes: ["UserCrop", "AllCrop"],

  endpoints: (builder) => ({
    // 1. Register crop API
    registerCrop: builder.mutation({
      query: (inputData) => ({
        url: "register-crop",
        method: "POST",
        body: inputData,
      }),
      invalidatesTags: ["UserCrop", "AllCrop"],
    }),

    //2. Get All crops API
    getAllCrop: builder.query({
      query: () => ({
        url: "getCrops",
        method: "GET",
        credentials: "include",
      }),
       providesTags: ["AllCrop"],
    }),

    //3.Get All user Crops Api
    getAllUserCrop: builder.query({
      query: () => ({
        url: "userCrops",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["UserCrop"],
    }),

    //4.Update user crop data API

    updateUserCrop: builder.mutation({
      query: ({ cropId, formData }) => ({
        url: `updateCrop/${cropId}`,
        method: "PUT",
        credentials: "include",
        body: formData,
      }),
      invalidatesTags: ["UserCrop", "AllCrop"],
    }),

    // 5. Get signle Crop Info API

    getSingleCrop: builder.query({
      query: ({ cropId }) => ({
        url: `getCrop/${cropId}`,
        method: "GET",
        credentials: "include",
      }),
    }),


    //6. Delete User Crop API
    deleteUserCrop:builder.mutation({
      query:({cropId})=>({
        url:`deleteCrop/${cropId}`,
        method:"DELETE",
        credentials:"include"
      }),
      invalidatesTags: ["UserCrop", "AllCrop"],
    })

  }),
});

export const {
  useRegisterCropMutation,
  useGetAllCropQuery,
  useGetAllUserCropQuery,
  useUpdateUserCropMutation,
  useGetSingleCropQuery,
  useDeleteUserCropMutation
} = cropApi;
