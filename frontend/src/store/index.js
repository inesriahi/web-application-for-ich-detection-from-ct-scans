import {configureStore} from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";


const imgSlice = createSlice({
    name: 'img',
    initialState: {img: "", isLoadedImg: false},
    reducers: {
        setImg(state, action) {
            // console.log("setImg ran correctly")
            state.img = action.payload;
        }, 
        setIsLoadedImg(state, action) {
            state.isLoadedImg = action.payload;
        }
    },
})
const store = configureStore({
    reducer: {img: imgSlice.reducer}
})

export const imgActions = imgSlice.actions;
export default store;