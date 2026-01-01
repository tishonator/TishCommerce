import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGridCategory from "../../components/products/ProductGridCategory";
import { getLocalization } from "../../utils/getLocalization";
import { getProductsListingSettings } from "../../utils/getProductsListing";
import { getAllCategories } from "../../utils/getProducts";
import { categoryToSlug, slugToCategory } from "../../utils/categorySlugUtils";
import { ReduxProvider } from "../../providers";

const localeData = getLocalization();

// Generate static paths for all categories at build time
export function generateStaticParams() {
  const categories = getAllCategories();

  return categories.map((category) => ({
    category: categoryToSlug(category),
  }));
}

// Generate metadata for each category page
export async function generateMetadata(props: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const categories = getAllCategories();
  const categoryName = slugToCategory(params.category, categories);

  if (!categoryName) {
    return {
      title: `Category Not Found - ${localeData.siteName}`,
    };
  }

  return {
    title: `${categoryName} - ${localeData.labels.products} - ${localeData.siteName}`,
    description: `Browse ${categoryName} products at ${localeData.siteName}`,
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ category: string }>;
}) {
  const params = await props.params;
  const productsListingSettings = getProductsListingSettings();
  const categories = getAllCategories();

  // Convert slug back to actual category name
  const categoryName = slugToCategory(params.category, categories);

  // If category not found, show 404
  if (!categoryName) {
    notFound();
  }

  return (
    <section className="py-12 bg-stone-100">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-2">
            {categoryName}
          </h1>
          <p className="text-center text-gray-600">
            {localeData.labels.products}
          </p>
        </div>

        {/* Product Grid with Category Filter */}
        <div className="mt-2">
          <ReduxProvider>
            <ProductGridCategory
              category={categoryName}
              pageSize={productsListingSettings.pageSize}
            />
          </ReduxProvider>
        </div>
      </div>
    </section>
  );
}
