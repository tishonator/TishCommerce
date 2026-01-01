"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearCart, setCartItems } from "../../store/slices/cartSlice";
import {
  setPayPalApproved,
  setPayPalOrderID,
  setOrderInfo,
} from "../../store/slices/checkoutSlice";
import { Product } from "../../../types/Product";

export default function PayPalSingleProductExpressButton({
  product,
}: {
  product: Product;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const orderId = useAppSelector((state) => state.checkout.orderId);
  const orderDate = useAppSelector((state) => state.checkout.orderDate);

  // Ensure order info is generated even on product page
  useEffect(() => {
    if (!orderId) {
      const newId = uuidv4().split("-")[0];
      const date = new Date().toISOString().split("T")[0];
      dispatch(setOrderInfo({ id: newId, date }));
    }
  }, [orderId, dispatch]);

  const cartItems = [{ ...product, quantity: 1 }];
  const total = parseFloat(product.SalePrice || product.RegularPrice);
  const currency = "USD";

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency,
        intent: "capture",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical", shape: "pill", label: "buynow" }}
        createOrder={async () => {
          try {
            const res = await fetch("/api/paypal/create-order-express", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: total.toFixed(2),
                currency,
                orderId,
                cartItems,
              }),
            });

            const data = await res.json();
            if (!data.orderID) throw new Error("Missing order ID from PayPal");

            dispatch(setPayPalOrderID(data.orderID));
            return data.orderID;
          } catch (err) {
            console.error("❌ Failed to create PayPal order:", err);
            throw err;
          }
        }}
        onApprove={async (data) => {
          try {
            const captureRes = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderID: data.orderID }),
            });
            const result = await captureRes.json();

            if (!result.success) {
              console.error("❌ PayPal capture failed:", result);
              return;
            }

            dispatch(setPayPalApproved(true));

            // Extract customer info from PayPal capture result
            const name = result.details?.payer?.name?.given_name
              ? `${result.details.payer.name.given_name} ${result.details.payer.name.surname || ""}`
              : result.details?.purchase_units?.[0]?.shipping?.name?.full_name || "PayPal Customer";
            const [firstName, ...lastParts] = name.split(" ");
            const lastName = lastParts.join(" ") || "";
            const email = result.details?.payer?.email_address || "";

            const orderData = {
              orderId,
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
              const error = await orderRes.json();
              console.error("❌ Order placement failed:", error);
              return;
            }

            const orderResult = await orderRes.json();

            // Use enriched cart items with download URLs from server response
            const orderDataWithDownloads = {
              ...orderData,
              cartItems: orderResult.cartItems || cartItems, // Use enriched items if available
            };

            dispatch(setCartItems(orderResult.cartItems || cartItems));
            localStorage.setItem("recentOrder", JSON.stringify(orderDataWithDownloads));
            dispatch(clearCart());
            router.push("/ordersummary");
          } catch (err) {
            console.error("❌ PayPal onApprove error:", err);
          }
        }}
      />
    </PayPalScriptProvider>
  );
}
