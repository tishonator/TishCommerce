// -----------------------------
// store/store.ts
// Purpose: Configure and export Redux store
// -----------------------------

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";

// Configure and export the Redux store
export const store = configureStore({
  reducer: {
    cart: cartReducer, // Add the cart slice to the store
  },
});

// Types for dispatch and root state, useful for TypeScript autocompletion
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
