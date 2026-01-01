import localeData from "../../configs/locale.en.json";

// Define Localization Structure
interface LocalizationData {
  phone: string;
  address: string;
  siteName: string;
  siteTagline: string;
  labels: {
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
    recentProducts: string;
    orderConfirmationTitle: string;
    orderConfirmationMessage: string;
  };
  menu: { label: string; href: string }[];
  footerLinks: { label: string; href: string }[];
  socialLinks: { id: string; icon: string; url: string }[];
  homepage: {
    banner: {
      title: string;
      subtitle: string;
      buttonText: string;
      imagePath: string;
      ctaLink: string;
    };
    brandStory: {
      title: string;
      description: string;
      buttonText: string;
      ctaLink: string;
    };
    testimonialsTitle: string;
    testimonials: {
      id: number;
      name: string;
      avatar: string;
      rating: number;
      review: string;
    }[];
    brandsTitle: string;
    brands: { name: string; logo: string }[];
  };
  about: {
    title: string,
    imagePath: string,
    content: string
  },
  copyright: string;
}

// Default Localization Fallback
const defaultLocalization: LocalizationData = {
  phone: "+1 234 567 890",
  address: "123 Main Street, Tish City",
  siteName: "TishCommerce",
  siteTagline: "Your Database-Free Store",
  labels: {
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
    products: "Products",
    recentProducts: "Recent Products",
    orderConfirmationTitle: "Your Order Confirmation",
    orderConfirmationMessage: "Your order was placed successfully. Thank you for your purchase!",
  },
  menu: [
    { label: "Homepage", href: "/" },
    { label: "Products", href: "/products" },
    { label: "News", href: "/news" },
    { label: "Contacts", href: "/contactus" },
  ],
  footerLinks: [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ],
  socialLinks: [
    { id: "facebook", icon: "SiFacebook", url: "https://facebook.com/yourpage" },
    { id: "x", icon: "SiX", url: "https://x.com/yourprofile" },
    { id: "instagram", icon: "SiInstagram", url: "https://instagram.com/yourpage" },
    { id: "linkedin", icon: "SiLinkedin", url: "https://linkedin.com/in/yourprofile" },
  ],
  homepage: {
    banner: {
      title: "Welcome to TishCommerce",
      subtitle: "The easiest way to manage and sell your products online.",
      buttonText: "Get Started Now",
      imagePath: "/homepage-banner.jpg",
      ctaLink: "/products",
    },
    brandStory: {
      title: "Our Story",
      description:
        "We’re a family-owned business dedicated to eco-friendly materials and fair trade practices. Our mission is to bring you high-quality, sustainable products that make a difference.",
      buttonText: "Read More",
      ctaLink: "/about",
    },
    testimonialsTitle: "What Our Customers Say",
    testimonials: [],
    brandsTitle: 'Trusted by Top Brands',
    brands: []
  },
  about: {
    title: "About Our Family Business",
    imagePath: "/images/about-us.jpg",
    content:
      "We’re a family-owned business dedicated to eco-friendly materials and fair trade practices.\n\nOur mission is to bring you high-quality, sustainable products that make a difference.",
  },
  copyright: "© 2025 Tishonator. All rights reserved.",
};

// Fetch Localization Data
// Now using direct import for compatibility with Vercel, Cloudflare, and Netlify
export const getLocalization = (): LocalizationData => {
  return localeData as LocalizationData;
};
