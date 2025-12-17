import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../features/api/authApi";
import authReducer from "../features/slice/authSlice";
import { cropApi } from "@/features/api/cropApi";
import { orderApi } from "@/features/api/orderApi";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [cropApi.reducerPath]: cropApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  auth: authReducer,
});

export default rootReducer;
