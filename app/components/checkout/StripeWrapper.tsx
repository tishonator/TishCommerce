"use client";

import { Elements } from "@stripe/react-stripe-js";
import getStripe from "../../utils/get-stripejs";
import StripePaymentElement from "./StripePaymentElement";
import type { StripeElementsOptions } from "@stripe/stripe-js";

export default function StripeWrapper({ clientSecret }: { clientSecret: string }) {
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  return (
    <Elements stripe={getStripe()} options={options}>
      <StripePaymentElement />
    </Elements>
  );
}
