"use client";

import PayPalBasketExpressCheckoutButton from "./PayPalBasketExpressCheckoutButton";
import { ReduxProvider } from "../../providers";
import { CheckoutProvider } from "../../context/CheckoutContext";

export default function PayPalBasketExpressWrapper() {
  return (
    <ReduxProvider>
      <CheckoutProvider>
        <PayPalBasketExpressCheckoutButton />
      </CheckoutProvider>
    </ReduxProvider>
  );
}
