import ProductGrid from "../components/products/ProductGrid";
import fs from "fs";
import path from "path";

// Load localization settings
const localePath = path.join(process.cwd(), "locales/en.json");
const localeData = JSON.parse(fs.readFileSync(localePath, "utf-8"));

export default function ProductsPage() {
  return (
    <section className="py-12 bg-stone-100">
      <div className="container mx-auto px-4">
        <h2 className={`text-4xl font-bold text-black text-center mb-8 ${localeData.colors.primary}`}>
          {localeData.labels.products}
        </h2>
        <ProductGrid />
      </div>
    </section>
  );
}
