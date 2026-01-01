"use client";

import { useEffect, useState } from "react";
import StripeWrapper from "./StripeWrapper";
import { useAppSelector, useAppDispatch } from "../../store/hooks";

export default function StripeClientSecretLoader() {
  const [clientSecret, setClientSecret] = useState("");
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((state) => state.cart.items);
  const orderId = useAppSelector((state) => state.checkout.orderId);
  const orderDate = useAppSelector((state) => state.checkout.orderDate);
  const billingForm = useAppSelector((state) => state.checkout.billingForm);
  const paymentMethodId = useAppSelector((state) => state.checkout.paymentMethodId);

  const currency = "USD";

  const total = cartItems.reduce(
    (sum, item) =>
      sum + item.quantity * parseFloat(item.SalePrice || item.RegularPrice),
    0
  );

  useEffect(() => {
    const loadSecret = async () => {
      if (!orderId || cartItems.length === 0) return;

      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Stripe expects cents
          currency,
          orderId,
          orderDate,
          cartItems,
          billingForm,
          paymentMethodId,
        }),
      });

      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);

        const orderData = {
          orderId,
          orderDate,
          cartItems,
          billingForm,
          paymentMethodId,
        };

        localStorage.setItem("recentOrder", JSON.stringify(orderData));
      } else {
        console.error("❌ No clientSecret returned from Stripe API");
      }
    };

    loadSecret();
  }, [
    total,
    orderId,
    orderDate,
    cartItems,
    billingForm,
    paymentMethodId,
    currency,
    dispatch,
  ]);

  if (!clientSecret) return <p>Loading Stripe…</p>;

  return <StripeWrapper clientSecret={clientSecret} />;
}
