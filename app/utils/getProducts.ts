import fs from "fs";
import path from "path";
import { Product } from "../../types/Product";

// Define function to get all products
export default async function getProducts(): Promise<Product[]> {
  try {
    const filePath = path.join(process.cwd(), "configs/products.json");

    if (!fs.existsSync(filePath)) {
      return [];
    }

    const products: Product[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return products.filter((product) => product.CatalogVisible);
  } catch (error) {
    console.error("Error loading products file:", error);
    return [];
  }
}

// Function to get a product by slug
export function getProductBySlug(slug: string): Product | undefined {
  try {
    const filePath = path.join(process.cwd(), "configs/products.json");

    if (!fs.existsSync(filePath)) {
      return undefined;
    }

    const products: Product[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return products.find((product) => product.Slug === slug);
  } catch (error) {
    console.error(`Error fetching product with slug "${slug}":`, error);
    return undefined;
  }
}
