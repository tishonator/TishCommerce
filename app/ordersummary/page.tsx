import { ProductProvider } from "../context/ProductContext";
import OrderSummaryWrapper from "../components/ordersummary/OrderSummaryWrapper";

export default function OrderSummaryPage() {
  return (
    <ProductProvider>
      <OrderSummaryWrapper />
    </ProductProvider>
  );
}
