"use client";

import { ReduxProvider } from "../../providers";
import { CheckoutProvider } from "../../context/CheckoutContext";
import OrderSummaryClient from "./OrderSummaryClient";

export default function OrderSummaryWrapper() {
  return (
    <ReduxProvider>
      <CheckoutProvider>
        <OrderSummaryClient />
      </CheckoutProvider>
    </ReduxProvider>
  );
}
