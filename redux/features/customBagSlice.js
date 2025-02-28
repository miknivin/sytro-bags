import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  imageUrls: [], // Array to store multiple images
  isCustomDesign: false, // Boolean to track custom design status
};

const customBag = createSlice({
  name: "customBag",
  initialState,
  reducers: {
    addImageUrl: (state, action) => {
      state.imageUrls.push(action.payload); // Add new image URL
    },
    removeImageUrl: (state, action) => {
      state.imageUrls = state.imageUrls.filter((url) => url !== action.payload);
    },
    clearImages: (state) => {
      state.imageUrls = [];
    },
    setCustomDesign: (state, action) => {
      state.isCustomDesign = action.payload; // Set custom design status
    },
    toggleCustomDesign: (state) => {
      state.isCustomDesign = !state.isCustomDesign; // Toggle custom design status
    },
  },
});

export const { addImageUrl, removeImageUrl, clearImages, setCustomDesign, toggleCustomDesign } = customBag.actions;
export default customBag.reducer;
