import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./features/userSlice";
import cartReducer from "./features/cartSlice";

import { productApi } from "./api/productsApi";
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";
import { orderApi } from "./api/orderApi";
import productsReducer from "./features/productSlice.js";
import customBagReducer from "./features/customBagSlice";

export const store = configureStore({
  reducer: {
    auth: userReducer,
    cart: cartReducer,
    product: productsReducer,
    customBag: customBagReducer,
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      productApi.middleware,
      authApi.middleware,
      userApi.middleware,
      orderApi.middleware,
    ]),
});
