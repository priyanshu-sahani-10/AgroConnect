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


import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { userLoggedIn , userLoggedOut } from '../slice/authSlice';
const USER_API="http://localhost:5000/api/v1/user/";

export const authApi = createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({
        baseUrl:USER_API,
        credentials:'include'
    }),
    endpoints: (builder) => ({
        

        registerUser: builder.mutation({
            query: (inputData) => ({
                url:"register",
                method:"POST",
                body:inputData
            })
        }),


        

        

        
    })
});
export const {
    useRegisterUserMutation,
} = authApi;