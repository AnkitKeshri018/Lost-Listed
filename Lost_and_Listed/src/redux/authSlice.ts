import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    userMarkedfoundItems: [],
    userClaimedItems: [],
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setuserMarkedfoundItems:(state,action)=>{
      state.userMarkedfoundItems = action.payload;
    },
    setuserClaimedItems:(state,action)=>{
      state.userClaimedItems = action.payload
    }
  },
});

export const { setLoading, setUser,setuserClaimedItems,setuserMarkedfoundItems } = authSlice.actions;
export default authSlice.reducer;
