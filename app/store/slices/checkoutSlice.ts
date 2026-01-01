// Purpose: Redux slice to manage checkout state (billing form, payment method)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface CheckoutState {
  orderId: string;
  orderDate: string;
  billingForm: FormData;
  paymentMethodId: string;
  isPayPalApproved: boolean;
  payPalOrderID: string;
}

const initialForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
};

const initialState: CheckoutState = {
  orderId: "",
  orderDate: "",
  billingForm: initialForm,
  paymentMethodId: "",
  isPayPalApproved: false,
  payPalOrderID: ""
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setOrderInfo(state, action: PayloadAction<{ id: string; date: string }>) {
      state.orderId = action.payload.id;
      state.orderDate = action.payload.date;
    },
    setBillingForm(state, action: PayloadAction<Partial<FormData>>) {
      state.billingForm = { ...state.billingForm, ...action.payload };
    },
    setPaymentMethod(state, action: PayloadAction<string>) {
      state.paymentMethodId = action.payload;
    },
    setPayPalApproved(state, action: PayloadAction<boolean>) {
      state.isPayPalApproved = action.payload;
    },
    setPayPalOrderID(state, action: PayloadAction<string>) {
      state.payPalOrderID = action.payload;
    },
  },
});

export const {
  setOrderInfo,
  setBillingForm,
  setPaymentMethod,
  setPayPalApproved,
  setPayPalOrderID
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
