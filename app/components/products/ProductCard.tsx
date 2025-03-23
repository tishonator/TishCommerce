"use client";

import Link from "next/link";
import Image from "next/image";
import { getCurrencySymbol } from "../../utils/getCurrencySymbol";
import { Product } from "../../../types/Product";
import { useAppDispatch } from "../../store/hooks";
import { addToCart } from "../../store/slices/cartSlice";
import { useLocalization } from "../../context/LocalizationContext";
import { showMiniCart } from "../../utils/MiniCartController";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = parseFloat(product.SalePrice) < parseFloat(product.RegularPrice);
  const currencySymbol = getCurrencySymbol(product.Currency);
  const dispatch = useAppDispatch();
  const { labels } = useLocalization();

  const handleAddToCart = () => {
    dispatch(addToCart(product));

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });

    showMiniCart();
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transition hover:scale-105">
      {/* Product Image with Link to Product Page */}
      <Link href={`/products/${product.Slug}`}>
        <div className="w-full">
          <Image
            src={product.FeatureImageURL}
            alt={product.Title}
            width={400}
            height={0}
            className="w-full h-auto object-contain rounded-t-lg"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 truncate">
          <Link href={`/products/${product.Slug}`} className="hover:text-gray-600">
            {product.Title}
          </Link>
        </h3>

        <p className="text-gray-700 mt-2 text-sm line-clamp-2">{product.ShortDescription}</p>

        <div className="mt-3">
          {hasDiscount ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-red-600">
                {currencySymbol}
                {product.SalePrice}
              </span>
              <span className="text-gray-500 line-through">
                {currencySymbol}
                {product.RegularPrice}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {currencySymbol}
              {product.RegularPrice}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Link href={`/products/${product.Slug}`} className="sm:w-1/2">
            <span className="w-full inline-block bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-semibold text-center transition">
              {labels.viewProduct || "View Product"}
            </span>
          </Link>

          <button
            onClick={handleAddToCart}
            className="w-full sm:w-1/2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-semibold text-center transition"
          >
            {labels.addToCart || "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
