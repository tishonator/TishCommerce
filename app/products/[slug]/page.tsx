import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "../../utils/getProducts";
import { getCurrencySymbol } from "../../utils/getCurrencySymbol";
import ProductLightbox from "../../components/products/ProductLightbox";
import { getLocalization } from "../../utils/getLocalization";
import AddToCartButtonWrapper from "../../components/products/AddToCartButtonWrapper";
import PayPalExpressButtonWrapper from "@/app/components/paypal/PayPalExpressButtonWrapper";

// Define a type for route params as a Promise
type AsyncParams = Promise<{ slug?: string }>;

// read localization
const localeData = getLocalization();

/**
 * Note: `generateMetadata` must also treat `params` as a Promise.
 * Then "await params" to get the real slug value.
 */
export async function generateMetadata({
  params,
}: {
  params: AsyncParams;
}): Promise<Metadata> {
  const { slug } = await params; // MUST await

  if (!slug) {
    return {
      title: "Product Not Found",
      description: "No product slug provided.",
    };
  }

  // Local file read is now allowed, as we properly awaited the param
  const product = getProductBySlug(slug);
  if (!product) {
    return {
      title: "Product Not Found",
      description: `Product with slug "${slug}" does not exist.`,
    };
  }

  return {
    title: `${product.Title} - ${localeData.siteName}`,
    description: product.ShortDescription,
  };
}

/**
 * The route itself must also treat `params` as a Promise.
 */
export default async function ProductPage({
  params,
}: {
  params: AsyncParams;
}) {
  // First await for the real param
  const { slug } = await params;
  if (!slug) {
    return notFound();
  }

  // Now do local file read
  const product = getProductBySlug(slug);
  if (!product) {
    return notFound();
  }

  // Build SSR UI
  const priceBlock =
    product.SalePrice !== product.RegularPrice ? (
      <p className="text-xl font-bold text-red-600">
        {getCurrencySymbol(product.Currency)}
        {product.SalePrice}
        <span className="ml-2 text-gray-500 line-through">
          {getCurrencySymbol(product.Currency)}
          {product.RegularPrice}
        </span>
      </p>
    ) : (
      <p className="text-xl font-bold text-gray-900">
        {getCurrencySymbol(product.Currency)}
        {product.RegularPrice}
      </p>
    );

  return (
    <section className="py-12 bg-stone-100">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800">{product.Title}</h1>

        <div className="grid mt-2 grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* LEFT COLUMN: IMAGES */}
          <ProductLightbox images={[product.FeatureImageURL, ...product.ProductImageGallery]} />

          {/* RIGHT COLUMN: DETAILS */}
          <div>
            <p className="text-lg text-gray-700">{product.ShortDescription}</p>
            <div className="mt-4">{priceBlock}</div>

            <div className="mt-4">
              <AddToCartButtonWrapper product={product} />
            </div>

            <div className="mt-4 max-w-48">
              <PayPalExpressButtonWrapper product={product} />
            </div>

          </div>
        </div>

        {/* LONG DESCRIPTION */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800">
            {localeData.labels.productDetails || "Product Details"}
          </h2>
          <p className="text-gray-700 mt-4">{product.LongDescription}</p>
        </div>
      </div>
    </section>
  );
}
