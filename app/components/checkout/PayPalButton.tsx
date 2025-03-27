"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setPayPalApproved, setPayPalOrderID } from "../../store/slices/checkoutSlice";
import { useRouter } from "next/navigation";
import { useCheckoutSettings } from "../../context/CheckoutContext";
import { clearCart } from "../../store/slices/cartSlice";

export default function PayPalButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const cartItems = useAppSelector((state) => state.cart.items);
  const shippingForm = useAppSelector((state) => state.checkout.shippingForm);
  const billingForm = useAppSelector((state) => state.checkout.billingForm);
  const shippingMethodId = useAppSelector((state) => state.checkout.shippingMethodId);
  const paymentMethodId = useAppSelector((state) => state.checkout.paymentMethodId);
  const orderId = useAppSelector((state) => state.checkout.orderId);
  const orderDate = useAppSelector((state) => state.checkout.orderDate);

  const { shippingMethods } = useCheckoutSettings();
  const shippingMethod = shippingMethods.find((s) => s.id === shippingMethodId);

  const currency = shippingMethod?.currency || "USD";
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * parseFloat(item.SalePrice || item.RegularPrice),
    0
  );
  const shippingCost = shippingMethod?.price || 0;
  const total = cartTotal + shippingCost;

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
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: total.toFixed(2),
                currency,
                orderId,
                cartItems,
                shippingMethodName: shippingMethod?.name || "Shipping"
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

            if (!shippingMethod) {
              console.error("❌ Shipping method not found.");
              return;
            }

            const orderData = {
              orderId,
              orderDate,
              cartItems,
              shippingForm,
              billingForm,
              shippingMethod,
              paymentMethodId,
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

            localStorage.setItem("recentOrder", JSON.stringify(orderData));
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
