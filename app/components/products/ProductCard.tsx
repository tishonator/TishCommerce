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
  const effectivePrice = parseFloat(product.SalePrice || product.RegularPrice);
  const isFree = effectivePrice === 0;
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
      <Link href={`/product/${product.Slug}`}>
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
          <Link href={`/product/${product.Slug}`} className="hover:text-gray-600">
            {product.Title}
          </Link>
        </h3>

        <p className="text-gray-700 mt-2 text-sm line-clamp-2">{product.ShortDescription}</p>

        <div className="mt-3">
          {isFree ? (
            <span className="text-lg font-bold text-green-600">
              FREE
            </span>
          ) : hasDiscount ? (
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

        <div className="mt-4 flex flex-col gap-2">
          {/* Main action buttons row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href={`/product/${product.Slug}`} className={(!isFree || !product.DownloadURL) ? "sm:w-1/2" : "sm:w-1/2"}>
              <span className="w-full inline-block bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-semibold text-center transition">
                {labels.viewProduct || "View Product"}
              </span>
            </Link>

            {isFree && product.DownloadURL ? (
              <a
                href={product.DownloadURL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-1/2 inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-semibold text-center transition"
              >
                Download
              </a>
            ) : !isFree ? (
              <button
                onClick={handleAddToCart}
                className="w-full sm:w-1/2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-semibold text-center transition"
              >
                {labels.addToCart || "Add to Cart"}
              </button>
            ) : null}
          </div>

          {/* Demo button - full width */}
          {product.DemoURL && (
            <a
              href={product.DemoURL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold text-center transition"
            >
              DEMO
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
