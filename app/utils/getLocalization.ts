import fs from "fs";
import path from "path";

// Define Localization Structure
interface LocalizationData {
  email: string;
  phone: string;
  address: string;
  siteName: string;
  siteTagline: string;
  labels: {
    email: string;
    phone: string;
    address: string;
    quickLinks: string;
    contactUs: string;
    followUs: string;
    searchPlaceholder: string;
    allCategories: string;
    sortByName: string;
    sortByPrice: string;
    sortByNewest: string;
    loadingProducts: string;
    noProductsFound: string;
    productDetails: string;
    products: string;
  };
  homepage: {
    banner: {
      title: string;
      subtitle: string;
      buttonText: string;
      imagePath: string;
      ctaLink: string;
    };
  };
  menu: { label: string; href: string }[];
  footerLinks: { label: string; href: string }[];
  socialLinks: { id: string; icon: string; url: string }[];
  copyright: string;
}

// Default Localization Fallback
const defaultLocalization: LocalizationData = {
  email: "contact@example.com",
  phone: "+1 234 567 890",
  address: "123 Main Street, Tish City",
  siteName: "TishCommerce",
  siteTagline: "Your Database-Free Store",
  labels: {
    email: "Email",
    phone: "Phone",
    address: "Address",
    quickLinks: "Quick Links",
    contactUs: "Contact Us",
    followUs: "Follow Us",
    searchPlaceholder: "Search products...",
    allCategories: "All Categories",
    sortByName: "Sort by Name",
    sortByPrice: "Sort by Price",
    sortByNewest: "Sort by Newest",
    loadingProducts: "Loading products...",
    noProductsFound: "No products found...",
    productDetails: "Product Details",
    products: "Products"
  },
  homepage: {
    banner: {
      title: "Welcome to TishCommerce",
      subtitle: "The easiest way to manage and sell your products online.",
      buttonText: "Get Started Now",
      imagePath: "/homepage-banner.jpg",
      ctaLink: "/products"
    }
  },
  menu: [],
  footerLinks: [],
  socialLinks: [],
  copyright: "© 2025 Tishonator. All rights reserved.",
};

// Fetch Localization Data
export const getLocalization = (): LocalizationData => {
  try {
    const localePath = path.join(process.cwd(), "locales/en.json");
    const data = fs.readFileSync(localePath, "utf-8");
    return JSON.parse(data) as LocalizationData;
  } catch (error) {
    console.error("Error loading localization file:", error);
    return defaultLocalization;
  }
};
