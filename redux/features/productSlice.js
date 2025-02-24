import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [], 
    singleProduct: null,
    productById: {}, // Added productById state
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
  },
});

export const { 
  setProducts, 
  resetProducts, 
  setSingleProductForQuickAdd, 
  resetSingleProduct, 
  setProductById, 
  resetProductById 
} = productsSlice.actions;

export default productsSlice.reducer;
