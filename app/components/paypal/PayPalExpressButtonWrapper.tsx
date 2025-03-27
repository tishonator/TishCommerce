"use client";

import PayPalSingleProductExpressButton from "./PayPalSingleProductExpressButton";
import { ReduxProvider } from "../../providers";
import { CheckoutProvider } from "../../context/CheckoutContext";
import { Product } from "../../../types/Product";

export default function PayPalExpressButtonWrapper({ product }: { product: Product }) {
  return (
    <ReduxProvider>
      <CheckoutProvider>
        <PayPalSingleProductExpressButton product={product} />
      </CheckoutProvider>
    </ReduxProvider>
  );
}
