// Purpose: Redux slice to manage checkout state (shipping method, billing/shipping forms, payment method)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormData {
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  city: string;
  address1: string;
  address2: string;
  postalCode: string;
  phone: string;
  email: string;
}

interface CheckoutState {
  shippingForm: FormData;
  billingForm: FormData;
  shippingMethodId: string;
  paymentMethodId: string;
}

const initialForm: FormData = {
  firstName: "",
  lastName: "",
  country: "",
  state: "",
  city: "",
  address1: "",
  address2: "",
  postalCode: "",
  phone: "",
  email: "",
};

const initialState: CheckoutState = {
  shippingForm: initialForm,
  billingForm: initialForm,
  shippingMethodId: "",
  paymentMethodId: "",
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setShippingForm(state, action: PayloadAction<Partial<FormData>>) {
      state.shippingForm = { ...state.shippingForm, ...action.payload };
    },
    setBillingForm(state, action: PayloadAction<Partial<FormData>>) {
      state.billingForm = { ...state.billingForm, ...action.payload };
    },
    setShippingMethod(state, action: PayloadAction<string>) {
      state.shippingMethodId = action.payload;
    },
    setPaymentMethod(state, action: PayloadAction<string>) {
      state.paymentMethodId = action.payload;
    },
  },
});

export const {
  setShippingForm,
  setBillingForm,
  setShippingMethod,
  setPaymentMethod,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
