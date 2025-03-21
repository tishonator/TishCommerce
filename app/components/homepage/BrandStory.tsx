import Link from "next/link";
import { getLocalization } from "../../utils/getLocalization";

export default async function BrandStory() {
  // Fetch localization data (Server-Side)
  const { homepage } = getLocalization();

  if (!homepage?.brandStory) {
    return null; // Prevent rendering if missing data
  }

  const { title, description, buttonText, ctaLink } = homepage.brandStory;

  return (
    <section className="relative w-full py-24 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white">
      <div className="container mx-auto px-6 text-center">
        {/* Title */}
        <h2 className="text-4xl font-extrabold mb-6 tracking-wide">
          {title}
        </h2>

        {/* Description */}
        <p className="text-lg max-w-3xl mx-auto opacity-90">
          {description}
        </p>

        {/* Call to Action Button */}
        <Link
          href={ctaLink}
          className="mt-8 inline-block bg-white text-gray-800 hover:bg-gray-200 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition transform hover:scale-105"
        >
          {buttonText}
        </Link>
      </div>

      {/* Decorative Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800/30 to-transparent pointer-events-none"></div>
    </section>
  );
}
