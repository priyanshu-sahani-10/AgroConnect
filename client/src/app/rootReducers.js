import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../features/api/authApi";
import authReducer from "../features/slice/authSlice";
import { cropApi } from "@/features/api/cropApi";

const rootRedcuer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [cropApi.reducerPath]: cropApi.reducer,
  auth: authReducer,
});

export default rootRedcuer;
