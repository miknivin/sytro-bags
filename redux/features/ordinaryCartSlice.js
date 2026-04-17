"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  shippingInfo: {},
  quantityChange: { isIncreasing: false, timestamp: 0 },
};

if (typeof window !== "undefined") {
  try {
    initialState.cartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];

    initialState.shippingInfo = localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {};
  } catch (error) {
    console.error("Ordinary state load failed safely:", error);
  }
}

// Helper function to persist data in local storage
const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Fail silently
  }
};

export const ordinaryCartSlice = createSlice({
  name: "ordinaryCartSlice",
  initialState,
  reducers: {
    ordinaryUpdateCartItem: (state, action) => {
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

    ordinarySetCartItem: (state, action) => {
      const item = action.payload;
      console.log(item, "item");

      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );

      if (isItemExist) {
        state.cartItems = state.cartItems.map((i) =>
          i.product === isItemExist.product ? item : i
        );
      } else {
        state.cartItems.push(item);
      }

      saveToLocalStorage("cartItems", state.cartItems);
    },

    ordinaryRemoveCartItem: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter((i) => i.product !== productId);
      saveToLocalStorage("cartItems", state.cartItems);
    },

    ordinarySaveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      saveToLocalStorage("shippingInfo", state.shippingInfo);
    },

    ordinaryClearCart: (state) => {
      localStorage.removeItem("cartItems");
      state.cartItems = [];
    },

    ordinarySetQuantityChange: (state, action) => {
      const { isIncreasing } = action.payload;
      state.quantityChange = {
        isIncreasing,
        timestamp: Date.now(),
      };
      saveToLocalStorage("quantityChange", state.quantityChange);
    },
  },
});

export default ordinaryCartSlice.reducer;

export const {
  ordinarySetCartItem,
  ordinaryRemoveCartItem,
  ordinarySaveShippingInfo,
  ordinaryClearCart,
  ordinaryUpdateCartItem,
  ordinarySetQuantityChange,
} = ordinaryCartSlice.actions;
