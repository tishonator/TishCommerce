import { Product } from "../../types/Product";
import productsData from "../../configs/products.json";

// Define function to get all products
// Now using direct import for compatibility with Vercel, Cloudflare, and Netlify
export default async function getProducts(): Promise<Product[]> {
  try {
    const products: Product[] = productsData as Product[];
    return products.filter((product) => product.CatalogVisible);
  } catch (error) {
    console.error("Error loading products file:", error);
    return [];
  }
}

// Function to get a product by slug
export function getProductBySlug(slug: string): Product | undefined {
  try {
    const products: Product[] = productsData as Product[];
    return products.find((product) => product.Slug === slug);
  } catch (error) {
    console.error(`Error fetching product with slug "${slug}":`, error);
    return undefined;
  }
}

// Function to get all unique categories from products
export function getAllCategories(): string[] {
  try {
    const products: Product[] = productsData as Product[];

    // Extract all categories from all products
    const allCategories = products
      .filter((product) => product.CatalogVisible)
      .flatMap((product) => product.ProductCategories || []);

    // Return unique categories
    return Array.from(new Set(allCategories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
