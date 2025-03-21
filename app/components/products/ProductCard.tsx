import Link from "next/link";
import Image from "next/image";
import { getCurrencySymbol } from "../../utils/getCurrencySymbol";
import { Product } from "../../../types/Product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = parseFloat(product.SalePrice) < parseFloat(product.RegularPrice);
  const currencySymbol = getCurrencySymbol(product.Currency);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transition hover:scale-105">
      {/* Product Image with Link to Product Page */}
      <Link href={`/products/${product.Slug}`}>
        <div className="w-full">
          <Image
            src={product.FeatureImageURL}
            alt={product.Title}
            width={400}
            height={0} // height auto
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
                {currencySymbol}{product.SalePrice}
              </span>
              <span className="text-gray-500 line-through">
                {currencySymbol}{product.RegularPrice}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {currencySymbol}{product.RegularPrice}
            </span>
          )}
        </div>

        <div className="mt-4">
          <Link href={`/products/${product.Slug}`}>
            <span className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition">
              View Product
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
