"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearCart } from "../../store/slices/cartSlice";
import {
  setOrderInfo,
  setPayPalApproved,
  setPayPalOrderID,
} from "../../store/slices/checkoutSlice";

export default function PayPalBasketExpressCheckoutButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items);
  const orderId = useAppSelector((state) => state.checkout.orderId);
  const orderDate = useAppSelector((state) => state.checkout.orderDate);

  const [ready, setReady] = useState(false);
  const [localOrderId, setLocalOrderId] = useState("");

  const total = cartItems.reduce(
    (acc, item) => acc + item.quantity * parseFloat(item.SalePrice || item.RegularPrice),
    0
  );

  const currency = "USD";

  useEffect(() => {
    if (!orderId) {
      const newId = uuidv4().split("-")[0];
      const date = new Date().toISOString().split("T")[0];
      dispatch(setOrderInfo({ id: newId, date }));
      setLocalOrderId(newId);
    } else {
      setLocalOrderId(orderId);
    }

    setReady(true);
  }, [orderId, dispatch]);

  if (!ready || cartItems.length === 0) return null;

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency,
        intent: "capture",
      }}
    >
      <PayPalButtons
        style={{ layout: "horizontal", label: "buynow", shape: "pill" }}
        forceReRender={[localOrderId, total, currency]} // prevent reinitializing PayPal if data is unchanged
        createOrder={async () => {
          const res = await fetch("/api/paypal/create-order-basket-express", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: total.toFixed(2),
              currency,
              orderId: localOrderId,
              cartItems,
            }),
          });

          const data = await res.json();
          if (!data.orderID) throw new Error("Missing PayPal Order ID");

          dispatch(setPayPalOrderID(data.orderID));
          return data.orderID;
        }}
        onApprove={async (data) => {
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID: data.orderID }),
          });

          const result = await res.json();
          if (!result.success) {
            console.error("❌ PayPal capture failed:", result);
            return;
          }

          dispatch(setPayPalApproved(true));

          const name = result.details?.payer?.name?.given_name
            ? `${result.details.payer.name.given_name} ${result.details.payer.name.surname || ""}`
            : result.details?.purchase_units?.[0]?.shipping?.name?.full_name || "";
          const [firstName, ...lastParts] = name.split(" ");
          const lastName = lastParts.join(" ") || "";
          const email = result.details?.payer?.email_address || "";

          const orderData = {
            orderId: localOrderId,
            orderDate,
            cartItems,
            billingForm: {
              firstName,
              lastName,
              email,
            },
            paymentMethodId: "paypal",
            paypalOrderId: data.orderID,
          };

          const orderRes = await fetch("/api/checkout/placeorder", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          });

          if (!orderRes.ok) {
            const err = await orderRes.json();
            console.error("❌ Order placement failed:", err);
            return;
          }

          const orderResult = await orderRes.json();

          // Use enriched cart items with download URLs from server response
          const orderDataWithDownloads = {
            ...orderData,
            cartItems: orderResult.cartItems || cartItems, // Use enriched items if available
          };

          localStorage.setItem("recentOrder", JSON.stringify(orderDataWithDownloads));
          dispatch(clearCart());
          router.push("/ordersummary");
        }}
      />
    </PayPalScriptProvider>
  );
}
