import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    LOCALES_PATH: "locales/en.json", // Change this to switch languages
  },
};

export default nextConfig;
