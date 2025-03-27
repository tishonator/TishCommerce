export const getPayPalApiBase = () => {
  const useSandbox = process.env.PAYPAL_USE_SANDBOX === "true";
  return useSandbox
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
};
  