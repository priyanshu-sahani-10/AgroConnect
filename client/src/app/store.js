import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducers";
import {authApi} from "../features/api/authApi";
import { cropApi } from "@/features/api/cropApi";
import { orderApi } from "@/features/api/orderApi";
const appStore = configureStore({
    reducer:rootReducer,
    middleware:(defaultmiddleware)=>defaultmiddleware().concat(authApi.middleware,cropApi.middleware,orderApi.middleware)
})

export default appStore;