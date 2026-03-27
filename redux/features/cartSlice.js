"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  shippingInfo: {},
  uploadedImages: {},
  selectedDesigns: {},
  customNames: {},
  quantityChange: { isIncreasing: false, timestamp: 0 },
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

  initialState.customNames = localStorage.getItem("customNames")
    ? JSON.parse(localStorage.getItem("customNames"))
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
    upsertCartItem: (state, action) => {
      const item = action.payload;
      const normalizedItem =
        item.category === "Kids Bags"
          ? item
          : { ...item, uploadedImage: undefined };
      const itemIndex = state.cartItems.findIndex(
        (cartItem) => cartItem.product === item.product
      );

      if (itemIndex >= 0) {
        state.cartItems[itemIndex] = normalizedItem;
      } else {
        state.cartItems.push(normalizedItem);
      }

      saveToLocalStorage("cartItems", state.cartItems);
    },

    updateCartItem: (state, action) => {
      const item = action.payload;
      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );

      if (isItemExist) {
        state.cartItems = state.cartItems.map((i) =>
          i.product === isItemExist.product
            ? {
              ...i,
              ...item,
              ...(item.category === "Kids Bags" && item.uploadedImage
                ? { uploadedImage: item.uploadedImage }
                : {}),
            }
            : i
        );
      } else {
        state.cartItems.push(
          item.category === "Kids Bags"
            ? item
            : { ...item, uploadedImage: undefined }
        );
      }

      saveToLocalStorage("cartItems", state.cartItems);
    },

    setCartItem: (state, action) => {
      const item = action.payload;
      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );

      if (isItemExist) {
        if (item.category === "Kids Bags") {
          const uploadedImageCount = Array.isArray(isItemExist.uploadedImage)
            ? isItemExist.uploadedImage.length
            : isItemExist.uploadedImage
              ? 1
              : 0;

          if (isItemExist.quantity === uploadedImageCount) {
            state.cartItems = state.cartItems.map((i) =>
              i.product === isItemExist.product ? item : i
            );
          }
        } else {
          state.cartItems = state.cartItems.map((i) =>
            i.product === isItemExist.product
              ? { ...item, uploadedImage: undefined }
              : i
          );
        }
      } else {
        state.cartItems.push(
          item.category === "Kids Bags"
            ? item
            : { ...item, uploadedImage: undefined }
        );
      }

      saveToLocalStorage("cartItems", state.cartItems);
    },

    removeCartItem: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter((i) => i.product !== productId);
      delete state.uploadedImages[productId];
      delete state.customNames[productId];
      delete state.selectedDesigns[productId];

      saveToLocalStorage("cartItems", state.cartItems);
      saveToLocalStorage("uploadedImages", state.uploadedImages);
      saveToLocalStorage("customNames", state.customNames);
      saveToLocalStorage("selectedDesigns", state.selectedDesigns);
    },

    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      saveToLocalStorage("shippingInfo", state.shippingInfo);
    },

    clearCart: (state) => {
      localStorage.removeItem("cartItems");
      localStorage.removeItem("uploadedImages");
      localStorage.removeItem("selectedDesigns");
      localStorage.removeItem("customNames");

      state.cartItems = [];
      state.uploadedImages = {};
      state.selectedDesigns = {};
      state.customNames = {};
    },

    setSelectedDesign: (state, action) => {
      const { productId, design } = action.payload;

      if (!state.selectedDesigns) {
        state.selectedDesigns = {};
      }

      state.selectedDesigns[productId] = design;
      saveToLocalStorage("selectedDesigns", state.selectedDesigns);
    },

    resetSelectedDesign: (state, action) => {
      const { productId } = action.payload;
      delete state.selectedDesigns[productId];
      saveToLocalStorage("selectedDesigns", state.selectedDesigns);
    },

    setCustomName: (state, action) => {
      const { productId, customName } = action.payload;
      if (!state.customNames) {
        state.customNames = {};
      }
      state.customNames[productId] = customName;
      saveToLocalStorage("customNames", state.customNames);
    },

    resetCustomName: (state, action) => {
      const { productId } = action.payload;
      delete state.customNames[productId];
      saveToLocalStorage("customNames", state.customNames);
    },

    setUploadedImage: (state, action) => {
      const { productId, uploadedImage } = action.payload;

      if (!state.uploadedImages[productId]) {
        state.uploadedImages[productId] = [];
      }

      if (Array.isArray(uploadedImage)) {
        state.uploadedImages[productId] = [
          ...state.uploadedImages[productId],
          ...uploadedImage,
        ];
      } else {
        state.uploadedImages[productId].push(uploadedImage);
      }

      saveToLocalStorage("uploadedImages", state.uploadedImages);
    },

    replaceUploadedImage: (state, action) => {
      const { productId, uploadedImage } = action.payload;
      const normalizedImages = Array.isArray(uploadedImage)
        ? uploadedImage.filter(Boolean)
        : uploadedImage
          ? [uploadedImage]
          : [];

      if (normalizedImages.length > 0) {
        state.uploadedImages[productId] = normalizedImages;
      } else {
        delete state.uploadedImages[productId];
      }

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

    removeUploadedImage: (state, action) => {
      const { productId, imageIndex } = action.payload;
      if (state.uploadedImages[productId]) {
        state.uploadedImages[productId] = state.uploadedImages[
          productId
        ].filter((_, index) => index !== imageIndex);
        if (state.uploadedImages[productId].length === 0) {
          delete state.uploadedImages[productId];
        }
        saveToLocalStorage("uploadedImages", state.uploadedImages);
      }
    },

    mergeCartData: (state) => {
      state.cartItems = state.cartItems.map((item) => ({
        ...item,
        selectedDesign: state.selectedDesigns[item.product] || null,
        uploadedImages:
          item.category === "Kids Bags"
            ? state.uploadedImages[item.product] || []
            : undefined,
      }));

      saveToLocalStorage("cartItems", state.cartItems);
    },

    setQuantityChange: (state, action) => {
      const { isIncreasing } = action.payload;
      state.quantityChange = {
        isIncreasing,
        timestamp: Date.now(),
      };
      saveToLocalStorage("quantityChange", state.quantityChange);
    },

    removeCartItemUploadedImage: (state, action) => {
      const { productId, imageIndex } = action.payload;
      const cartItem = state.cartItems.find(
        (item) => item.product === productId
      );

      if (cartItem && Array.isArray(cartItem.uploadedImage)) {
        if (cartItem.uploadedImage.length > 1) {
          cartItem.uploadedImage = cartItem.uploadedImage.filter(
            (_, index) => index !== imageIndex
          );
        }

        saveToLocalStorage("cartItems", state.cartItems);
      }
    },
  },
});

export default cartSlice.reducer;

export const {
  upsertCartItem,
  setCartItem,
  removeCartItem,
  saveShippingInfo,
  clearCart,
  updateCartItem,
  setSelectedDesign,
  resetSelectedDesign,
  setCustomName,
  resetCustomName,
  setUploadedImage,
  replaceUploadedImage,
  resetUploadedImage,
  removeUploadedImage,
  mergeCartData,
  setQuantityChange,
  removeCartItemUploadedImage,
} = cartSlice.actions;
