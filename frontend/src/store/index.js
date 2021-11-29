import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const imgSlice = createSlice({
  name: "img",
  initialState: { img: "", isLoadedImg: false, metadata: {} },
  reducers: {
    setImg(state, action) {
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
  initialState: {
    img: "",
    isLoading: false,
    isSegmented: false,
    histogram: [],
    statistics: [],
    marksArray: [],
    markersActualCoor: [],
  },
  reducers: {
    setSegmentedImg(state, action) {
      state.img = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setIsSegmented(state, action) {
      state.isSegmented = action.payload;
    },
    setHistogram(state, action) {
      state.histogram = action.payload;
    },
    setStatistics(state, action) {
      state.statistics = action.payload;
    },
    resetMarkers(state) {
      state.marksArray = [];
      state.markersActualCoor = [];
    },
    undoMarker(state) {
      state.marksArray.pop();
      state.markersActualCoor.pop();
    },
    resetAnalysis(state) {
      state.histogram = [];
      state.statistics = [];
    },
    setMarksArray(state, action) {
      state.marksArray = action.payload;
    },
    setMarkersActualCoor(state, action) {
      state.markersActualCoor = action.payload;
    }
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
      state.multiPred = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setIsClassified(state, action) {
      state.isClassified = action.payload;
    },
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
