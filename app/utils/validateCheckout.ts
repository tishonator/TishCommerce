import { CheckoutState } from "../store/slices/checkoutSlice";

export const isCheckoutValid = (checkout: CheckoutState): boolean => {
  const { billingForm, paymentMethodId } = checkout;

  // Validate required fields
  const requiredFields = [
    billingForm.firstName,
    billingForm.lastName,
    billingForm.email,
    paymentMethodId,
  ];

  if (!requiredFields.every((field) => field && field.trim() !== "")) {
    return false;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(billingForm.email)) {
    return false;
  }

  return true;
};
