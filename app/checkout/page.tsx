import OrderInfoInitializer from "../components/checkout/OrderInfoInitializer";
import BillingForm from "../components/checkout/BillingForm";
import OrderSummary from "../components/checkout/OrderSummary";
import PaymentMethods from "../components/checkout/PaymentMethods";
import { CheckoutProvider } from "../context/CheckoutContext";
import { ReduxProvider } from "../providers";

export default function CheckoutPage() {
  return (
    <ReduxProvider>
      <CheckoutProvider>
        <section className="py-10 px-4 md:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Forms */}
            <div className="lg:col-span-2 space-y-8">
              <OrderInfoInitializer />
              <BillingForm />
              <PaymentMethods />
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary />
            </div>
          </div>
        </section>
      </CheckoutProvider>
    </ReduxProvider>
  );
}
