"use client";

import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import { useProductContext } from "../../context/ProductContext";
import { useLocalization } from "../../context/LocalizationContext";

export default function ProductGrid() {
  const { filteredProducts, categories, setSearchQuery, setCategoryFilter, setSortBy } = useProductContext();
  const { labels } = useLocalization();

  return (
    <div>
      {/* Pass localized labels to ProductFilters */}
      <ProductFilters
        setSearchQuery={setSearchQuery}
        setCategoryFilter={setCategoryFilter}
        setSortBy={setSortBy}
        categories={categories}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => <ProductCard key={product.ID} product={product} />)
        ) : (
          <p className="text-center text-gray-600">{labels.noProductsFound}</p>
        )}
      </div>
    </div>
  );
}
