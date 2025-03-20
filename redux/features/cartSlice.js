"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  shippingInfo: {},
  uploadedImages: {},
  selectedDesigns: {},
};

if (typeof window !== "undefined") {
  initialState.cartItems = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

  initialState.shippingInfo = localStorage.getItem("shippingInfo")
    ? JSON.parse(localStorage.getItem("shippingInfo"))
    : {};

  initialState.uploadedImages = localStorage.getItem("uploadedImages")
    ? JSON.parse(localStorage.getItem("uploadedImages"))
    : {};

  initialState.selectedDesigns = localStorage.getItem("selectedDesigns")
    ? JSON.parse(localStorage.getItem("selectedDesigns"))
    : {};
}

// Helper function to persist data in local storage
const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    updateCartItem: (state, action) => {
      const item = action.payload;
      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );

      if (isItemExist) {
        state.cartItems = state.cartItems.map((i) =>
          i.product === isItemExist.product ? { ...i, ...item } : i
        );
      } else {
        state.cartItems.push(item);
      }

      saveToLocalStorage("cartItems", state.cartItems);
    },

    setCartItem: (state, action) => {
      const item = action.payload;
      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );

      if (isItemExist) {
        state.cartItems = state.cartItems.map((i) =>
          i.product === isItemExist.product
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        state.cartItems.push(item);
      }

      saveToLocalStorage("cartItems", state.cartItems);
    },

    removeCartItem: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter((i) => i.product !== productId);
      delete state.uploadedImages[productId];
      // delete state.selectedDesigns[productId];

      saveToLocalStorage("cartItems", state.cartItems);
      saveToLocalStorage("uploadedImages", state.uploadedImages);
      //saveToLocalStorage("selectedDesigns", state.selectedDesigns);
    },

    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      saveToLocalStorage("shippingInfo", state.shippingInfo);
    },

    clearCart: (state) => {
      localStorage.removeItem("cartItems");
      localStorage.removeItem("uploadedImages");
      localStorage.removeItem("selectedDesigns");

      state.cartItems = [];
      state.uploadedImages = {};
      state.selectedDesigns = {};
    },

    setSelectedDesign: (state, action) => {
      const { productId, design } = action.payload;

      if (!state.selectedDesigns) {
        state.selectedDesigns = {}; // Ensure the object exists
      }

      state.selectedDesigns[productId] = design;

      // Fix the typo: Save state.selectedDesigns instead of state.design
      saveToLocalStorage("selectedDesigns", state.selectedDesigns);
    },

    resetSelectedDesign: (state, action) => {
      const { productId } = action.payload;
      delete state.selectedDesigns[productId];
      saveToLocalStorage("selectedDesigns", state.selectedDesigns);
    },

    setUploadedImage: (state, action) => {
      const { productId, uploadedImage } = action.payload;
      state.uploadedImages[productId] = uploadedImage;
      saveToLocalStorage("uploadedImages", state.uploadedImages);
    },

    resetUploadedImage: (state, action) => {
      const { productId } = action.payload;
      const isInCart = state.cartItems.some(
        (item) => item.product === productId
      );
      if (isInCart) {
        state.cartItems = state.cartItems.filter(
          (i) => i.product !== productId
        );
        saveToLocalStorage("cartItems", state.cartItems);
      }
      delete state.uploadedImages[productId];
      saveToLocalStorage("uploadedImages", state.uploadedImages);
    },

    mergeCartData: (state) => {
      state.cartItems = state.cartItems.map((item) => ({
        ...item,
        selectedDesign: state.selectedDesigns[item.product] || null,
        uploadedImage: state.uploadedImages[item.product] || null,
      }));

      saveToLocalStorage("cartItems", state.cartItems);
    },
  },
});

export default cartSlice.reducer;

export const {
  setCartItem,
  removeCartItem,
  saveShippingInfo,
  clearCart,
  updateCartItem,
  setSelectedDesign,
  resetSelectedDesign,
  setUploadedImage,
  resetUploadedImage,
  mergeCartData,
} = cartSlice.actions;
