import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,

  reducers: {


    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i._id === item._id);
      if(!existingItem){
        state.items.push(item)
      }
    },

    removeFromCart:(state,action)=>{
        const item = action.payload;
        state.items=state.items.filter((i)=> i._id!==item._id);
    }

  },
});

export const {addToCart,removeFromCart }=cartSlice.actions;
export default cartSlice.reducer