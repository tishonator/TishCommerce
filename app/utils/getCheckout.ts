import checkoutData from "../../configs/checkout.json";

// Define Checkout Settings Structure
interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  icon: string;
}

export interface CheckoutSettings {
  paymentMethods: PaymentMethod[];
}

// Default Fallback
const defaultCheckoutSettings: CheckoutSettings = {
  paymentMethods: [
    { id: "stripe", name: "Stripe", enabled: true, icon: "/payments/stripe.png" },
    { id: "paypal", name: "PayPal", enabled: true, icon: "/payments/paypal.png" },
  ],
};

// Fetch Checkout Settings
// Now using direct import for compatibility with Vercel, Cloudflare, and Netlify
export const getCheckoutSettings = (): CheckoutSettings => {
  return checkoutData as CheckoutSettings;
};
