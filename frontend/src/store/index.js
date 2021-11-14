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
    },
  },
});

const segmentedSlice = createSlice({
  name: "segmentation",
  initialState: { img: "", isLoadedImg: false, isSegmented: false },
  reducers: {
    setImg(state, action) {
      state.img = action.payload;
    },
    setIsLoadedImg(state, action) {
      state.isLoadedImg = action.payload;
    },
    setIsSegmented(state, action) {
      state.isSegmented = action.payload;
    },
  },
});

const classificationSlice = createSlice({
  name: "classification",
  initialState: {
    gradcam: "",
    isLoading: false,
    isClassified: false,
    binaryPred: null,
    multiPred: null,
  },
  reducers: {
    setGradcam(state, action) {
      state.gradcam = action.payload;
    },
    setBinaryPred(state, action) {
      state.binaryPred = action.payload;
    },
    setMultiPred(state, action) {
      console.log("set MultiPred ran successfully with ", action.payload);
      state.multiPred = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setIsClassified(state, action) {
      state.isClassified = action.payload;
    }
  },
});

const store = configureStore({
  reducer: {
    img: imgSlice.reducer,
    segmentation: segmentedSlice.reducer,
    classification: classificationSlice.reducer,
  },
});

export const imgActions = imgSlice.actions;
export const segmentedActions = segmentedSlice.actions;
export const classificationActions = classificationSlice.actions;
export default store;
