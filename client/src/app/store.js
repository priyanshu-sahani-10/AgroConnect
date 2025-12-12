import { configureStore } from "@reduxjs/toolkit";
import rootRedcuer from "./rootReducers";
import {authApi} from "../features/api/authApi";
import { cropApi } from "@/features/api/cropApi";
const appStore = configureStore({
    reducer:rootRedcuer,
    middleware:(defaultmiddleware)=>defaultmiddleware().concat(authApi.middleware,cropApi.middleware)
})

export default appStore;