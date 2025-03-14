import fs from "fs";
import path from "path";

export const getLocalization = () => {
  try {
    const localePath = path.join(process.cwd(), "locales/en.json");
    const data = fs.readFileSync(localePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading localization file:", error);
    return {
      labels: {
        searchPlaceholder: "Search products...",
        allCategories: "All Categories",
        sortByName: "Sort by Name",
        sortByPrice: "Sort by Price",
        sortByNewest: "Sort by Newest",
        loadingProducts: "Loading products...",
        noProductsFound: "No products found..."
      }
    };
  }
};
