import productsListingData from "../../configs/products-listing.json";

// Products Listing Settings Interface
export interface ProductsListingSettings {
  pageSize: number;
}

// Default Fallback
const defaultProductsListingSettings: ProductsListingSettings = {
  pageSize: 18,
};

/**
 * Get products listing settings from configs/products-listing.json
 * Returns settings like page size for product listings
 * Now using direct import for compatibility with Vercel, Cloudflare, and Netlify
 */
export const getProductsListingSettings = (): ProductsListingSettings => {
  return productsListingData as ProductsListingSettings;
};
