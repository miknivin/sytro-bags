import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [], 
    singleProduct: null,
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
  },
});

export const { setProducts, resetProducts, setSingleProductForQuickAdd, resetSingleProduct } = productsSlice.actions;
export default productsSlice.reducer;
