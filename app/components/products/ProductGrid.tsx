"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import { useProductContext } from "../../context/ProductContext";

export default function ProductGrid() {
  const { filteredProducts, categories, setSearchQuery, setCategoryFilter, setSortBy } = useProductContext();
  const [localeData, setLocaleData] = useState<{ labels: { [key: string]: string } } | null>(null);

  useEffect(() => {
    fetch("/api/localization")
      .then((res) => res.json())
      .then((data) => setLocaleData(data))
      .catch(() => console.error("Failed to load localization"));
  }, []);

  if (!localeData) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  return (
    <div>
      {/* Pass localized labels to ProductFilters */}
      <ProductFilters
        setSearchQuery={setSearchQuery}
        setCategoryFilter={setCategoryFilter}
        setSortBy={setSortBy}
        categories={categories}
        labels={localeData.labels}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => <ProductCard key={product.ID} product={product} />)
        ) : (
          <p className="text-center text-gray-600">{localeData.labels.noProductsFound}</p>
        )}
      </div>
    </div>
  );
}
