import { configureStore } from "@reduxjs/toolkit";
import rootRedcuer from "./rootReducers";
import {authApi} from "../features/api/authApi";
const appStore = configureStore({
    reducer:rootRedcuer,
    middleware:(defaultmiddleware)=>defaultmiddleware().concat(authApi.middleware)
})

export default appStore;