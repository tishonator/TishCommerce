"use client";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { useCheckoutSettings } from "../../context/CheckoutContext";
import { useLocalization } from "../../context/LocalizationContext";
import { useState } from "react";
import { clearCart } from "../../store/slices/cartSlice";
import { useRouter } from "next/navigation";

export default function PlaceOrderButton() {
  const dispatch = useAppDispatch();
  const { labels } = useLocalization();
  const { shippingMethods } = useCheckoutSettings();
  const router = useRouter();

  const cartItems = useAppSelector((state) => state.cart.items);
  const shippingForm = useAppSelector((state) => state.checkout.shippingForm);
  const billingForm = useAppSelector((state) => state.checkout.billingForm);
  const shippingMethodId = useAppSelector((state) => state.checkout.shippingMethodId);
  const paymentMethodId = useAppSelector((state) => state.checkout.paymentMethodId);
  const orderId = useAppSelector((state) => state.checkout.orderId);
  const orderDate = useAppSelector((state) => state.checkout.orderDate);

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const missingFields: string[] = [];

    if (!shippingForm.firstName?.trim()) missingFields.push("Shipping First Name");
    if (!shippingForm.lastName?.trim()) missingFields.push("Shipping Last Name");
    if (!shippingForm.country?.trim()) missingFields.push("Shipping Country");
    if (!shippingForm.address1?.trim()) missingFields.push("Shipping Address");
    if (!shippingForm.postalCode?.trim()) missingFields.push("Shipping Postal Code");
    if (!shippingForm.phone?.trim()) missingFields.push("Shipping Phone");
    if (!shippingForm.email?.trim()) missingFields.push("Shipping Email");

    if (!billingForm.firstName?.trim()) missingFields.push("Billing First Name");
    if (!billingForm.lastName?.trim()) missingFields.push("Billing Last Name");
    if (!billingForm.country?.trim()) missingFields.push("Billing Country");
    if (!billingForm.address1?.trim()) missingFields.push("Billing Address");
    if (!billingForm.postalCode?.trim()) missingFields.push("Billing Postal Code");
    if (!billingForm.phone?.trim()) missingFields.push("Billing Phone");
    if (!billingForm.email?.trim()) missingFields.push("Billing Email");

    if (!shippingMethodId?.trim()) missingFields.push("Shipping Method");
    if (!paymentMethodId?.trim()) missingFields.push("Payment Method");

    if (missingFields.length > 0) {
      setErrorMsg(`Please complete the following fields: ${missingFields.join(", ")}`);
      return false;
    }

    setErrorMsg("");
    return true;
  };

  const handlePlaceOrder = async () => {
    // Note: Only Cash on Delivery should trigger this button
    if (paymentMethodId !== "cod") {
      setErrorMsg("Please select Cash on Delivery to place the order here.");
      return;
    }

    if (!validate()) return;

    setIsLoading(true);

    const shippingMethod = shippingMethods.find((s) => s.id === shippingMethodId);
    const orderData = {
      orderId,
      orderDate,
      cartItems,
      shippingForm,
      billingForm,
      shippingMethod,
      paymentMethodId,
    };

    try {
      const res = await fetch("/api/checkout/placeorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result: { error?: string } = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || "Order failed");
      }

      localStorage.setItem("recentOrder", JSON.stringify(orderData));
      dispatch(clearCart());
      router.push("/ordersummary");
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Something went wrong while placing the order.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handlePlaceOrder}
        className={`w-full text-white font-semibold py-3 px-4 rounded-md transition
          ${isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"}`}
        disabled={isLoading}
      >
        {isLoading
          ? labels.placingOrder || "Placing Order..."
          : labels.placeOrder || "Place Order"}
      </button>
      {errorMsg && <p className="text-red-600 mt-2 text-sm">{errorMsg}</p>}
    </div>
  );
}
