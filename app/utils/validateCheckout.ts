import { CheckoutState } from "../store/slices/checkoutSlice";

export const isCheckoutValid = (checkout: CheckoutState): boolean => {
  const { shippingForm, billingForm, shippingMethodId, paymentMethodId } = checkout;

  const requiredFields = [
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
    paymentMethodId,
  ];

  return requiredFields.every((field) => field && field.trim() !== "");
};
