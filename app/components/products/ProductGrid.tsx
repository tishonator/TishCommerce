"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import { Product } from "../../../types/Product";

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [localeData, setLocaleData] = useState<{ labels: { [key: string]: string } } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");

  useEffect(() => {
    // Fetch products
    fetch("/api/products")
  .then((res) => res.json())
  .then((data: Product[]) => {
    setProducts(data);
    setFilteredProducts(data);
    setCategories(
      Array.from(
        new Set(
          data.flatMap((p) => p.ProductCategories)
        )
      ).sort()
    );
    setLoading(false);
  })
  .catch(() => setLoading(false));


    // Fetch localization
    fetch("/api/localization")
      .then((res) => res.json())
      .then((data) => setLocaleData(data))
      .catch(() => console.error("Failed to load localization"));
  }, []);

  useEffect(() => {
    let updatedProducts = [...products];

    if (searchQuery) {
      updatedProducts = updatedProducts.filter((product) =>
        product.Title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter) {
      updatedProducts = updatedProducts.filter((product) =>
        product.ProductCategories.includes(categoryFilter)
      );
    }

    updatedProducts.sort((a, b) => {
      if (sortBy === "price") return parseFloat(a.SalePrice) - parseFloat(b.SalePrice);
      if (sortBy === "newest") return b.ID.localeCompare(a.ID);
      return a.Title.localeCompare(b.Title);
    });

    setFilteredProducts(updatedProducts);
  }, [searchQuery, categoryFilter, sortBy, products]);

  if (loading || !localeData) {
    return <p className="text-center text-gray-600">Loading products...</p>;
  }

  return (
    <div>
      <ProductFilters
        setSearchQuery={setSearchQuery}
        setCategoryFilter={setCategoryFilter}
        setSortBy={setSortBy}
        categories={categories}
        labels={localeData.labels} // Pass localized labels
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
