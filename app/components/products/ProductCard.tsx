import Link from "next/link";
import Image from "next/image";
import { getCurrencySymbol } from "../../utils/getCurrencySymbol";
import { useLocalization } from "../../context/LocalizationContext";
import { Product } from "../../../types/Product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { colors, labels } = useLocalization();

  const hasDiscount = parseFloat(product.SalePrice) < parseFloat(product.RegularPrice);
  const currencySymbol = getCurrencySymbol(product.Currency); // Get currency symbol

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transition hover:scale-105">
      {/* Product Image with Link to Product Page */}
      <Link href={`/products/${product.Slug}`}>
        <div className="relative w-full h-56 cursor-pointer">
          <Image
            src={product.FeatureImageURL}
            alt={product.Title}
            fill
            className="rounded-t-lg object-cover"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-6">
        {/* Title with Link */}
        <h3 className="text-xl font-semibold text-black truncate">
          <Link href={`/products/${product.Slug}`} className={colors.hover}>
            {product.Title}
          </Link>
        </h3>

        {/* Short Description */}
        <p className="text-gray-700 mt-2 text-sm line-clamp-2">{product.ShortDescription}</p>

        {/* Price Section */}
        <div className="mt-3">
          {hasDiscount ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-red-600">
                {currencySymbol} {product.SalePrice}
              </span>
              <span className="text-gray-500 line-through">
                {currencySymbol} {product.RegularPrice}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-black">
              {currencySymbol} {product.RegularPrice}
            </span>
          )}
        </div>

        {/* View Product Button */}
        <div className="mt-4">
          <Link href={`/products/${product.Slug}`}>
            <span
              className={`inline-block ${colors.primary} ${colors.hover} text-white px-4 py-2 rounded-full text-sm font-semibold transition`}
            >
              {labels.viewProduct}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
