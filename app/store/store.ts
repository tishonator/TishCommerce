// -----------------------------
// store/store.ts
// Purpose: Configure and export Redux store
// -----------------------------

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import checkoutReducer from "./slices/checkoutSlice";

// Configure and export the Redux store
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    checkout: checkoutReducer,
  },
});

// Types for dispatch and root state, useful for TypeScript autocompletion
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
