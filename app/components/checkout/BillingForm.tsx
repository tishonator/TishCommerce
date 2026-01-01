"use client";

import { useLocalization } from "../../context/LocalizationContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setBillingForm } from "../../store/slices/checkoutSlice";
import { useState } from "react";

export default function BillingForm() {
  const { labels } = useLocalization();
  const dispatch = useAppDispatch();
  const billingForm = useAppSelector((state) => state.checkout.billingForm);
  const [emailError, setEmailError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(setBillingForm({ [name]: value }));

    // Validate email on change
    if (name === "email") {
      validateEmail(value);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleEmailBlur = () => {
    validateEmail(billingForm.email);
  };

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {labels.billingInformation || "Customer Information"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="firstName"
          value={billingForm.firstName}
          onChange={handleChange}
          placeholder={labels.firstName || "First Name"}
          className="input bg-white border border-gray-300 p-2 pl-3 rounded focus:border-blue-500 focus:outline-none"
          required
        />
        <input
          name="lastName"
          value={billingForm.lastName}
          onChange={handleChange}
          placeholder={labels.lastName || "Last Name"}
          className="input bg-white border border-gray-300 p-2 pl-3 rounded focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      <div className="space-y-2">
        <input
          name="email"
          type="email"
          value={billingForm.email}
          onChange={handleChange}
          onBlur={handleEmailBlur}
          placeholder={labels.email || "Email Address"}
          className={`input bg-white border p-2 pl-3 rounded w-full focus:outline-none ${
            emailError ? "border-red-500" : "border-gray-300 focus:border-blue-500"
          }`}
          required
        />
        {emailError && (
          <p className="text-red-500 text-sm">{emailError}</p>
        )}
        <p className="text-sm text-gray-600 mt-2">
          {labels.downloadLinkEmailNotice || "Download links will be sent to this email address after payment confirmation."}
        </p>
      </div>
    </div>
  );
}
