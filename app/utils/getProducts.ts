import fs from "fs";
import path from "path";
import { Product } from "../../types/Product";

export default async function getProducts(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), "products.json");

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const products: Product[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return products.filter((product) => product.CatalogVisible);
}
