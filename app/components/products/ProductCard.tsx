import Link from "next/link";
import Image from "next/image";
import { useLocalization } from "../../context/LocalizationContext";
import { Product } from "../../../types/Product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { colors, labels } = useLocalization();

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transition hover:scale-105">
      <div className="relative w-full h-56">
        <Image
          src={product.FeatureImageURL}
          alt={product.Title}
          fill
          className="rounded-t-lg object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-black truncate">{product.Title}</h3>
        <p className="text-gray-700 mt-3 text-sm line-clamp-2">{product.ShortDescription}</p>
        <div className="mt-4">
          <Link href={`/product/${product.Slug}`}>
            <span className={`inline-block ${colors.primary} ${colors.hover} text-white px-4 py-2 rounded-full text-sm font-semibold transition`}>
              {labels.viewProduct}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
