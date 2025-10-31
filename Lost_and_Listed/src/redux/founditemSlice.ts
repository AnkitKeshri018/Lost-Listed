import { createSlice } from "@reduxjs/toolkit";

const founditemSlice = createSlice({
  name: "founditem",
  initialState: {
    foundItems: [],
    userfoundItems: [],
  },
  reducers: {
    setfoundItems: (state, action) => {
      state.foundItems = action.payload;
    },
    setuserfoundItems: (state, action) => {
      state.userfoundItems = action.payload;
    },
  },
});

export const { setfoundItems, setuserfoundItems } = founditemSlice.actions;
export default founditemSlice.reducer;
