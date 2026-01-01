"use client";

import { useEffect } from "react";
import ProductGrid from "./ProductGrid";
import { useProductContext } from "../../context/ProductContext";

interface ProductGridCategoryProps {
  category: string;
  pageSize?: number;
}

/**
 * ProductGrid wrapper that automatically filters by category
 * Used for category-specific product listing pages
 */
export default function ProductGridCategory({ category, pageSize = 18 }: ProductGridCategoryProps) {
  const { setCategoryFilter } = useProductContext();

  // Set category filter when component mounts or category changes
  useEffect(() => {
    setCategoryFilter(category);

    // Clean up: reset filter when component unmounts
    return () => {
      setCategoryFilter("all");
    };
  }, [category, setCategoryFilter]);

  return <ProductGrid pageSize={pageSize} />;
}
