import type { Metadata } from "next";
import Image from "next/image";
import { getLocalization } from "../utils/getLocalization";

export const metadata = ((): Metadata => {
  const { about, siteName } = getLocalization();
  return {
    title: `${about.title} - ${siteName}`,
    description: about.content.split("\n")[0], // Use first paragraph as description
  };
})();


export default function AboutPage() {
  const { about } = getLocalization();

  if (!about) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Feature Image */}
          <div className="relative w-full h-64 md:h-96">
            <Image
              src={about.imagePath}
              alt={about.title}
              fill
              className="rounded-lg object-cover"
              priority
            />
          </div>

          {/* Text Content */}
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{about.title}</h1>
            <p className="text-lg text-gray-700 whitespace-pre-line">{about.content}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
