import ProductGrid from "../components/products/ProductGrid";
import { getLocalization } from "../utils/getLocalization";

export default function ProductsPage() {
  const localeData = getLocalization(); // Fetch localization data

  return (
    <section className="py-12 bg-stone-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
          {localeData.labels.products}
        </h2>
        <ProductGrid />
      </div>
    </section>
  );
}
