import { ProductProvider } from "../context/ProductContext";
import OrderSummaryPage from "../components/ordersummary/OrderSummaryClient";

export default function OrderSummaryWrapper() {
  return (
    <ProductProvider>
      <OrderSummaryPage />
    </ProductProvider>
  );
}
