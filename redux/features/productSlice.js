import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [], 
    singleProduct: null,
    productById: {}, // Added productById state
    selectedTemplate: null, // New selectedTemplate state
  },
  reducers: {
    setProducts: (state, action) => {
      state.items = [...state.items, ...action.payload];
    },
    resetProducts: (state) => {
      state.items = []; 
    },
    setSingleProductForQuickAdd: (state, action) => {
      state.singleProduct = action.payload; 
    },
    resetSingleProduct: (state) => {
      state.singleProduct = null; 
    },
    setProductById: (state, action) => {
      state.productById = action.payload; // Sets product by ID
    },
    resetProductById: (state) => {
      state.productById = {}; // Resets product by ID
    },
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload; // Sets the selected template
    },
    resetSelectedTemplate: (state) => {
      state.selectedTemplate = null; // Resets the selected template
    },
  },
});

export const { 
  setProducts, 
  resetProducts, 
  setSingleProductForQuickAdd, 
  resetSingleProduct, 
  setProductById, 
  resetProductById, 
  setSelectedTemplate, // Exporting new action
  resetSelectedTemplate, // Exporting reset action
} = productsSlice.actions;

export default productsSlice.reducer;
