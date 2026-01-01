"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setPayPalApproved, setPayPalOrderID } from "../../store/slices/checkoutSlice";
import { useRouter } from "next/navigation";
import { clearCart } from "../../store/slices/cartSlice";

export default function PayPalButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const cartItems = useAppSelector((state) => state.cart.items);
  const billingForm = useAppSelector((state) => state.checkout.billingForm);
  const paymentMethodId = useAppSelector((state) => state.checkout.paymentMethodId);
  const orderId = useAppSelector((state) => state.checkout.orderId);
  const orderDate = useAppSelector((state) => state.checkout.orderDate);

  const currency = "USD";
  const total = cartItems.reduce(
    (acc, item) => acc + item.quantity * parseFloat(item.SalePrice || item.RegularPrice),
    0
  );

  // Don't render PayPal buttons until orderId is ready
  if (!orderId) {
    return <p className="text-sm text-gray-600">Initializing payment...</p>;
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency,
        intent: "capture",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical", color: "blue", shape: "pill" }}
        createOrder={async () => {
          try {
            if (!orderId) {
              console.error("❌ Order ID is missing");
              throw new Error("Order ID is not initialized");
            }

            const res = await fetch("/api/paypal/create-order", {
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
            const captureResult = await captureRes.json();

            if (!captureResult.success) {
              console.error("❌ PayPal capture failed:", captureResult);
              return;
            }

            dispatch(setPayPalApproved(true));

            const orderData = {
              orderId,
              orderDate,
              cartItems,
              billingForm,
              paymentMethodId,
              paypalOrderId: data.orderID, // Store PayPal order ID for download verification
            };

            const placeOrderRes = await fetch("/api/checkout/placeorder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(orderData),
            });

            const placeOrderResult = await placeOrderRes.json();

            if (!placeOrderRes.ok) {
              console.error("❌ Failed to place order:", placeOrderResult);
              return;
            }

            // Use enriched cart items with download URLs from server response
            const orderDataWithDownloads = {
              ...orderData,
              cartItems: placeOrderResult.cartItems || cartItems, // Use enriched items if available
            };

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
