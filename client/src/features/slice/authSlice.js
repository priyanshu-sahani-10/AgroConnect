/* 🟦 1. What is a Redux Slice? (createSlice)
A slice is for local/frontend state only.
You use it when you want to store things like:
isLoggedIn

userRole

theme (dark/light)

cart items (sometimes)

👉 Slice = frontend state only
👉 No direct backend call
👉 You manually use dispatch() */



import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,

  reducers:{

    userLoggedIn:(state,action)=>{
        state.user=action.payload.user;
        state.isAuthenticated=true;
    },

    userLoggedOut:(state)=>{
        state.user=null;
        state.isAuthenticated=false;
    }
  }
});


export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
