"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLocalization } from "../../context/LocalizationContext";

export default function HomepageBanner() {
  const { homepage } = useLocalization(); // Get homepage data

  if (!homepage?.banner) {
    return null; // Prevent render if localization data is missing
  }

  const { title, subtitle, buttonText, ctaLink, imagePath } = homepage.banner;

  return (
    <section
      className="w-full py-40 md:py-60 lg:py-80 text-white flex justify-center items-center text-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${imagePath})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto px-6"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 drop-shadow-lg">{title}</h2>
        <p className="text-lg mb-8 text-gray-200">{subtitle}</p>
        <Link
          href={ctaLink}
          className="bg-white text-gray-600 hover:bg-gray-200 hover:text-gray-800 px-8 py-4 rounded-full text-xl font-bold shadow-lg transition-transform transform hover:scale-110"
        >
          {buttonText}
        </Link>
      </motion.div>
    </section>
  );
}
