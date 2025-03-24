import fs from "fs";
import path from "path";

// Define Checkout Settings Structure
interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  currency: string;
}

interface Country {
  code: string;
  name: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
}

export interface CheckoutSettings {
  shippingMethods: ShippingMethod[];
  shippingCountries: Country[];
  billingCountries: Country[];
  paymentMethods: PaymentMethod[];
}

// Default Fallback
const defaultCheckoutSettings: CheckoutSettings = {
  shippingMethods: [
    { id: "standard", name: "Standard Shipping", price: 5.0, currency: "USD" },
    { id: "express", name: "Express Shipping", price: 15.0, currency: "USD" },
    { id: "pickup", name: "Local Pickup", price: 0, currency: "USD" },
  ],
  shippingCountries: [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
  ],
  billingCountries: [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
    { code: "GB", name: "United Kingdom" },
  ],
  paymentMethods: [
    { id: "stripe", name: "Stripe", enabled: true },
    { id: "paypal", name: "PayPal", enabled: true },
    { id: "cod", name: "Cash on Delivery", enabled: true },
  ],
};

// Fetch Checkout Settings
export const getCheckoutSettings = (): CheckoutSettings => {
  try {
    const filePath = path.join(process.cwd(), "checkout.json");
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData) as CheckoutSettings;
  } catch (error) {
    console.error("Error loading checkout.json:", error);
    return defaultCheckoutSettings;
  }
};
