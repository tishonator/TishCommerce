"use client";

import { useCheckoutSettings } from "../../context/CheckoutContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setPaymentMethod } from "../../store/slices/checkoutSlice";
import { useLocalization } from "../../context/LocalizationContext";
import PayPalButton from "./PayPalButton";
import PlaceOrderButton from "./PlaceOrderButton";
import Image from "next/image";

export default function PaymentMethod() {
  const { labels } = useLocalization();
  const { paymentMethods } = useCheckoutSettings();
  const dispatch = useAppDispatch();
  const selectedMethodId = useAppSelector((state) => state.checkout.paymentMethodId);

  const shippingForm = useAppSelector((state) => state.checkout.shippingForm);
  const billingForm = useAppSelector((state) => state.checkout.billingForm);
  const shippingMethodId = useAppSelector((state) => state.checkout.shippingMethodId);

  const isFormComplete = () => {
    const formFields = [
      shippingForm.firstName,
      shippingForm.lastName,
      shippingForm.country,
      shippingForm.address1,
      shippingForm.postalCode,
      shippingForm.phone,
      shippingForm.email,
      billingForm.firstName,
      billingForm.lastName,
      billingForm.country,
      billingForm.address1,
      billingForm.postalCode,
      billingForm.phone,
      billingForm.email,
      shippingMethodId,
    ];
    return formFields.every((field) => field && field.trim() !== "");
  };

  const formReady = isFormComplete();

  const handleChange = (id: string) => {
    if (formReady) {
      dispatch(setPaymentMethod(id));
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {labels.paymentMethod || "Payment Method"}
      </h2>

      {!formReady && (
        <p className="text-sm text-gray-500 mb-2">
          {labels.completeBeforePayment ||
            "Please complete all shipping and billing fields before selecting a payment method."}
        </p>
      )}

      <div
        className={`space-y-4 bg-white rounded p-5 transition-all duration-300 ${
          formReady ? "" : "opacity-80 blur-[1px] pointer-events-none"
        }`}
      >
        {paymentMethods
          .filter((method) => method.enabled)
          .map((method) => (
            <div key={method.id}>
              <label className="flex items-center justify-between p-1 cursor-pointer transition">
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethodId === method.id}
                    onChange={() => handleChange(method.id)}
                    className="accent-gray-700"
                  />
                  <span className="text-sm font-medium text-gray-800">{method.name}</span>
                  {method.icon && (
                    <Image
                      src={method.icon}
                      alt={method.name}
                      width={40}
                      height={24}
                      className="object-contain"
                    />
                  )}
                </div>
              </label>

              {method.id === "paypal" && selectedMethodId === "paypal" && (
                <div className="mt-4 ml-6">
                  <PayPalButton />
                </div>
              )}

              {method.id === "cod" && selectedMethodId === "cod" && (
                <div className="mt-4 ml-6">
                  <PlaceOrderButton />
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
