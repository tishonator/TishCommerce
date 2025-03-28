"use client";

import { useEffect, useState } from "react";
import StripeWrapper from "./StripeWrapper";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { useCheckoutSettings } from "../../context/CheckoutContext";

export default function StripeClientSecretLoader() {
  const [clientSecret, setClientSecret] = useState("");
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((state) => state.cart.items);
  const shippingMethodId = useAppSelector((state) => state.checkout.shippingMethodId);
  const orderId = useAppSelector((state) => state.checkout.orderId);
  const orderDate = useAppSelector((state) => state.checkout.orderDate);
  const shippingForm = useAppSelector((state) => state.checkout.shippingForm);
  const billingForm = useAppSelector((state) => state.checkout.billingForm);
  const paymentMethodId = useAppSelector((state) => state.checkout.paymentMethodId);
  const { shippingMethods } = useCheckoutSettings();

  const shippingMethod = shippingMethods.find((m) => m.id === shippingMethodId);
  const shippingCost = shippingMethod?.price || 0;
  const currency = shippingMethod?.currency || "USD";

  const total =
    cartItems.reduce(
      (sum, item) =>
        sum + item.quantity * parseFloat(item.SalePrice || item.RegularPrice),
      0
    ) + shippingCost;

  useEffect(() => {
    const loadSecret = async () => {
      if (!orderId || cartItems.length === 0 || !shippingMethod) return;

      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Stripe expects cents
          currency,
          orderId,
          cartItems,
          shippingMethodName: shippingMethod.name,
        }),
      });

      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);

        const orderData = {
          orderId,
          orderDate,
          cartItems,
          shippingForm,
          billingForm,
          shippingMethod,
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
    shippingForm,
    billingForm,
    shippingMethod,
    paymentMethodId,
    currency,
    dispatch,
  ]);

  if (!clientSecret) return <p>Loading Stripe…</p>;

  return <StripeWrapper clientSecret={clientSecret} />;
}
