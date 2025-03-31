"use client";

import { useCheckoutSettings } from "../../context/CheckoutContext";
import { useLocalization } from "../../context/LocalizationContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setShippingForm } from "../../store/slices/checkoutSlice";
import { useEffect, useMemo } from "react";

export default function ShippingForm() {
  const { shippingCountries, countryStates } = useCheckoutSettings();
  const { labels } = useLocalization();
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.checkout.shippingForm);

  useEffect(() => {
    if (!form.country && shippingCountries.length > 0) {
      dispatch(setShippingForm({ country: shippingCountries[0].code }));
    }
  }, [form.country, shippingCountries, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(setShippingForm({ [name]: value }));
  };

  // Get the list of states for selected country
  const availableStates = useMemo(() => {
    return countryStates[form.country] || null;
  }, [countryStates, form.country]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">{labels.shippingInformation || "Shipping Information"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="firstName" value={form.firstName} onChange={handleChange} placeholder={labels.firstName} className="input bg-white border border-gray-300 p-1 pl-2 rounded" required />
        <input name="lastName" value={form.lastName} onChange={handleChange} placeholder={labels.lastName} className="input bg-white border border-gray-300 p-1 pl-2 rounded" required />
        
        <select name="country" value={form.country} onChange={handleChange} className="input bg-white border border-gray-300 p-1">
          {shippingCountries.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>

        {/* Conditionally render state dropdown or nothing */}
        {availableStates ? (
          <select name="state" value={form.state} onChange={handleChange} className="input bg-white border border-gray-300 p-1">
            {availableStates.map((s) => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        ) : null}

        <input name="city" value={form.city} onChange={handleChange} placeholder={labels.city || "City"} className="input bg-white border border-gray-300 p-1 pl-2 rounded" required />
        <input name="address1" value={form.address1} onChange={handleChange} placeholder={labels.address1} className="input bg-white border border-gray-300 p-1 pl-2 rounded" required />
        <input name="address2" value={form.address2} onChange={handleChange} placeholder={labels.address2} className="input bg-white border border-gray-300 p-1 pl-2 rounded" />
        <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder={labels.postalCode} className="input bg-white border border-gray-300 p-1 pl-2 rounded" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder={labels.phone} className="input bg-white border border-gray-300 p-1 pl-2 rounded" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder={labels.email} className="input bg-white border border-gray-300 p-1 pl-2 rounded" required />
      </div>
    </div>
  );
}
