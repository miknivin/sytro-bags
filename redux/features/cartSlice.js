'use client';
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  shippingInfo: {},
};

// Fetch localStorage data during runtime
if (typeof window !== "undefined") {
  initialState.cartItems = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

  initialState.shippingInfo = localStorage.getItem("shippingInfo")
    ? JSON.parse(localStorage.getItem("shippingInfo"))
    : {};
}

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    updateCartItem: (state, action) => {
      const item = action.payload;

      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product,
      );

      if (isItemExist) {
        state.cartItems = state.cartItems.map((i) =>
          i.product === isItemExist.product ? item : i,
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
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
        state.cartItems = [...state.cartItems, item];
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (i) => i.product !== action.payload
      );

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;

      localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
    },
    clearCart: (state) => {
      localStorage.removeItem("cartItems");
      state.cartItems = [];
    },
  },
});

export default cartSlice.reducer;

export const { setCartItem, removeCartItem, saveShippingInfo, clearCart,updateCartItem } =
  cartSlice.actions;
