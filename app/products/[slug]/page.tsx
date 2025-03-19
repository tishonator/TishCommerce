"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocalization } from "../../context/LocalizationContext";
import { getCurrencySymbol } from "../../utils/getCurrencySymbol";
import ProductLightbox from "../../components/products/ProductLightbox";

interface Product {
  ID: string;
  Title: string;
  Slug: string;
  ShortDescription: string;
  LongDescription: string;
  RegularPrice: string;
  SalePrice: string;
  Currency: string;
  FeatureImageURL: string;
  ProductImageGallery: string[];
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { labels } = useLocalization();  // Get localization from context

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      // If no slug, push user to 404 or handle error
      router.push("/404");
      return;
    }

    // Fetch the single product
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products?slug=${slug}`);
        if (!res.ok) throw new Error("Failed to fetch product data");
        const data: Product = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, router]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (!product) {
    return <p className="text-center text-gray-500">Product not found.</p>;
  }

  // Price block
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
        <h1 className="text-3xl font-bold text-gray-800">{product.Title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* LEFT COLUMN: IMAGES */}
          <ProductLightbox images={[product.FeatureImageURL, ...product.ProductImageGallery]} />

          {/* RIGHT COLUMN: DETAILS */}
          <div>
            <p className="text-lg text-gray-700">{product.ShortDescription}</p>
            <div className="mt-4">{priceBlock}</div>
          </div>
        </div>

        {/* LONG DESCRIPTION */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800">
            {labels.productDetails || "Product Details"}
          </h2>
          <p className="text-gray-700 mt-4">{product.LongDescription}</p>
        </div>
      </div>
    </section>
  );
}
