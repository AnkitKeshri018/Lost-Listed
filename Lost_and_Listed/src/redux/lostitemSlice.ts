// src/redux/lostitemSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const lostitemSlice = createSlice({
  name: "lostitem",
  initialState: {
    lostItems: [],
  },
  reducers: {
    setLostItems: (state, action) => {
      state.lostItems = action.payload;
    },
  },
});

export const {
  setLostItems,
} = lostitemSlice.actions;
export default lostitemSlice.reducer;
