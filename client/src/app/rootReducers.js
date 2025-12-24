import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../features/api/authApi";
import { cropApi } from "@/features/api/cropApi";
import { orderApi } from "@/features/api/orderApi";

import authReducer from "../features/slice/authSlice";
import { cartApi } from "@/features/api/cartApi";
import { chatApi } from "@/features/api/chatApi";
import { adminApi } from "@/features/api/adminApi";


const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [cropApi.reducerPath]: cropApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [chatApi.reducerPath]:chatApi.reducer,
  [adminApi.reducerPath]:adminApi.reducer,
  auth: authReducer,
});

export default rootReducer;
