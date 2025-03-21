import ProductGrid from "../components/products/ProductGrid";
import { getLocalization } from "../utils/getLocalization";
import type { Metadata } from "next";

// Fetch localization data
const localeData = getLocalization();

// Set page metadata
export const metadata: Metadata = {
  title: `${localeData.siteName} - ${localeData.labels.products}`,
  description: localeData.siteTagline,
};

export default function ProductsPage() {
  return (
    <section className="py-12 bg-stone-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
          {localeData.labels.products}
        </h2>
        <div className="mt-2">
          <ProductGrid />
        </div>
      </div>
    </section>
  );
}
