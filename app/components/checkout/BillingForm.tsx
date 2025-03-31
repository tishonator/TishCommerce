"use client";

import { useCheckoutSettings } from "../../context/CheckoutContext";
import { useLocalization } from "../../context/LocalizationContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setBillingForm } from "../../store/slices/checkoutSlice";
import { useEffect, useMemo } from "react";

export default function BillingForm() {
  const { billingCountries, countryStates } = useCheckoutSettings();
  const { labels } = useLocalization();

  const dispatch = useAppDispatch();
  const billingForm = useAppSelector((state) => state.checkout.billingForm);
  const shippingForm = useAppSelector((state) => state.checkout.shippingForm);

  useEffect(() => {
    if (!billingForm.country && billingCountries.length > 0) {
      dispatch(setBillingForm({ country: billingCountries[0].code }));
    }
  }, [billingCountries, billingForm.country, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "country") {
      // Reset state when changing country
      dispatch(setBillingForm({ country: value, state: "" }));
    } else {
      dispatch(setBillingForm({ [name]: value }));
    }
  };

  const handleSameAsShipping = () => {
    dispatch(setBillingForm({ ...shippingForm }));
  };

  const availableStates = useMemo(() => {
    return countryStates[billingForm.country] || null;
  }, [countryStates, billingForm.country]);

  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">
          {labels.billingInformation || "Billing Information"}
        </h3>
        <button
          type="button"
          onClick={handleSameAsShipping}
          className="text-sm text-gray-600 underline hover:text-gray-800"
        >
          {labels.sameAsShipping || "Same as Shipping"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="firstName" value={billingForm.firstName} onChange={handleChange} placeholder={labels.firstName} className="input bg-white border border-gray-300 p-1 pl-2 rounded" required />
        <input name="lastName" value={billingForm.lastName} onChange={handleChange} placeholder={labels.lastName} className="input bg-white border border-gray-300 p-1 pl-2 rounded" required />
        
        <select name="country" value={billingForm.country} onChange={handleChange} className="input bg-white border border-gray-300 p-1">
          {billingCountries.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>

        <input name="city" value={billingForm.city} onChange={handleChange} placeholder={labels.city} className="input bg-white border border-gray-300 p-1 pl-2 rounded" required />

        {/* Conditionally render state dropdown if states available */}
        {availableStates ? (
          <select name="state" value={billingForm.state} onChange={handleChange} className="input bg-white border border-gray-300 p-1">
            {availableStates.map((s) => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        ) : null}

        <input name="address1" value={billingForm.address1} onChange={handleChange} placeholder={labels.address1} className="input bg-white border border-gray-300 p-1 pl-2 rounded" required />
        <input name="address2" value={billingForm.address2} onChange={handleChange} placeholder={labels.address2} className="input bg-white border border-gray-300 p-1 pl-2 rounded" />
        <input name="postalCode" value={billingForm.postalCode} onChange={handleChange} placeholder={labels.postalCode} className="input bg-white border border-gray-300 p-1 pl-2 rounded" required />
        <input name="phone" value={billingForm.phone} onChange={handleChange} placeholder={labels.phone} className="input bg-white border border-gray-300 p-1 pl-2 rounded" required />
        <input name="email" value={billingForm.email} onChange={handleChange} placeholder={labels.email} className="input bg-white border border-gray-300 md:col-span-2 p-1 pl-2 rounded" required />
      </div>
    </div>
  );
}
