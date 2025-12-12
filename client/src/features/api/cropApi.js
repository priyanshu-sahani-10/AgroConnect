import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const CROP_API = "http://localhost:5000/api/v1/crop/";

export const cropApi = createApi({
  reducerPath: "cropApi",
  baseQuery: fetchBaseQuery({
    baseUrl: CROP_API,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    // 1. Register crop API
    registerCrop: builder.mutation({
      query: (inputData) => ({
        url: "register-crop",
        method: "POST",
        body: inputData,
      }),
    }),
  }),
});

export const { useRegisterCropMutation } = cropApi;
export default cropApi;
