"use client";

import { useCheckoutSettings } from "../../context/CheckoutContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setPaymentMethod } from "../../store/slices/checkoutSlice";
import { useLocalization } from "../../context/LocalizationContext";
import Image from "next/image";

export default function PaymentMethod() {
  const { labels } = useLocalization();
  const { paymentMethods } = useCheckoutSettings();
  const dispatch = useAppDispatch();
  const selectedMethodId = useAppSelector((state) => state.checkout.paymentMethodId);

  const handleChange = (id: string) => {
    dispatch(setPaymentMethod(id));
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {labels.paymentMethod || "Payment Method"}
      </h2>

      <div className="space-y-4 bg-white rounded p-5">
        {paymentMethods
          .filter((method) => method.enabled)
          .map((method) => (
            <label
              key={method.id}
              className="flex items-center justify-between p-1 cursor-pointer transition"
            >
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
          ))}
      </div>
    </div>
  );
}
