import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const imgSlice = createSlice({
  name: "img",
  initialState: { img: "", isLoadedImg: false, metadata: {} },
  reducers: {
    setImg(state, action) {
      // console.log("setImg ran correctly")
      state.img = action.payload;
    },
    setIsLoadedImg(state, action) {
      state.isLoadedImg = action.payload;
    },
    setMetadata(state, action) {
      state.metadata = action.payload;
    }
  },
});

const segmentedSlice = createSlice({
  name: "segmentation",
  initialState: { img: "", isLoadedImg: false },
  reducers: {
    setImg(state, action) {
      // console.log("setImg ran correctly")
      state.img = action.payload;
    },
    setIsLoadedImg(state, action) {
      state.isLoadedImg = action.payload;
    },
  },
});

const store = configureStore({
  reducer: { img: imgSlice.reducer, segmentation: segmentedSlice.reducer },
});

export const imgActions = imgSlice.actions;
export const segmentedActions = segmentedSlice.actions;
export default store;
