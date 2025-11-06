import { createSlice } from "@reduxjs/toolkit";

const activitySlice = createSlice({
  name: "activty",
  initialState: {
    activities: [],
  },
  reducers: {
    setactivities: (state, action) => {
      state.activities = action.payload;
    },
  },
});

export const { setactivities } = activitySlice.actions;
export default activitySlice.reducer;
