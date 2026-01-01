"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Define the shape of configs/checkout.json
interface CheckoutSettings {
  paymentMethods: {
    id: string;
    name: string;
    enabled: boolean;
    icon: string;
  }[];
}

// Create context
const CheckoutContext = createContext<CheckoutSettings | null>(null);

// Provider component
export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [checkout, setCheckout] = useState<CheckoutSettings | null>(null);

  useEffect(() => {
    fetch("/api/checkout")
      .then((res) => res.json())
      .then((data) => setCheckout(data))
      .catch((err) => console.error("Failed to load checkout settings:", err));
  }, []);

  if (!checkout) {
    return <p className="text-center text-gray-600">Loading checkout settings...</p>;
  }

  return (
    <CheckoutContext.Provider value={checkout}>
      {children}
    </CheckoutContext.Provider>
  );
}

// Hook to consume context
export function useCheckoutSettings() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckoutSettings must be used within CheckoutProvider");
  }
  return context;
}
