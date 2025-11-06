import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products:[],
    userProducts:[]
  },
  reducers: {
    setproducts:(state,action)=>{
      state.products =action.payload
    },
    setuserProducts:(state,action)=>{
      state.userProducts =action.payload
    }
  },
});

export const { setproducts ,setuserProducts } = productSlice.actions;
export default productSlice.reducer;
