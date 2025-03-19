import { getProductBySlug } from "../../utils/getProducts";
import { getLocalization } from "../../utils/getLocalization";
import { getCurrencySymbol } from "../../utils/getCurrencySymbol";
import { notFound } from "next/navigation";
import ProductLightbox from "../../components/products/ProductLightbox";

interface ProductPageProps {
  params: { slug: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);
  const localeData = getLocalization();

  if (!product) {
    return notFound();
  }

  return (
    <section className="py-12 bg-stone-100">
      <div className="container mx-auto px-4">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800">
          {product.Title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* LEFT COLUMN - Feature Image & Gallery */}
          <ProductLightbox images={[product.FeatureImageURL, ...product.ProductImageGallery]} />

          {/* RIGHT COLUMN - Product Details */}
          <div>
            <p className="text-lg text-gray-700">{product.ShortDescription}</p>
            <div className="mt-4">
              {product.SalePrice !== product.RegularPrice ? (
                <p className="text-xl font-bold text-red-600">
                  {getCurrencySymbol(product.Currency)}{product.SalePrice}
                  <span className="ml-2 text-gray-500 line-through">
                    {getCurrencySymbol(product.Currency)}{product.RegularPrice}
                  </span>
                </p>
              ) : (
                <p className="text-xl font-bold text-gray-900">
                  {getCurrencySymbol(product.Currency)}{product.RegularPrice}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* LONG DESCRIPTION */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800">
            {localeData.labels.productDetails || "Product Details"} {/* Fallback if missing */}
          </h2>
          <p className="text-gray-700 mt-4">{product.LongDescription}</p>
        </div>
      </div>
    </section>
  );
}
