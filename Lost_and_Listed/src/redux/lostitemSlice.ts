// src/redux/lostitemSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const lostitemSlice = createSlice({
  name: "lostitem",
  initialState: {
    lostItems: [],
    userlostItems:[],

  },
  reducers: {
    setLostItems: (state, action) => {
      state.lostItems = action.payload;
    },
    setuserLostItems:(state,action)=>{
      state.userlostItems = action.payload;
    }
  },
});

export const { setLostItems, setuserLostItems } = lostitemSlice.actions;
export default lostitemSlice.reducer;
