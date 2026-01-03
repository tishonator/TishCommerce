import Link from "next/link";
import { SiFacebook, SiInstagram, SiLinkedin, SiX, SiYoutube } from "react-icons/si";
import MobileMenu from "./MobileMenu";
import { getLocalization } from "../utils/getLocalization";

// Map icon strings to components
const iconMap = {
  SiFacebook: SiFacebook,
  SiX: SiX,
  SiInstagram: SiInstagram,
  SiLinkedin: SiLinkedin,
  SiYoutube: SiYoutube,
};

export default function Header() {
  const content = getLocalization(); // Fetch localization data

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-gray-100 text-gray-900 py-2 px-4 flex justify-between items-center text-sm md:text-base">
        {/* Contact Link */}
        <p className="hidden md:block">
          <Link href="/contact" className="text-gray-800 hover:text-gray-600 transition font-medium">
            {content.labels.contactUs || "Contact Us"}
          </Link>
        </p>

        {/* Social Icons */}
        <div className="flex gap-2 sm:gap-4 mx-auto md:mx-0">
          {content.socialLinks.map(({ id, icon, url }) => {
            const IconComponent = iconMap[icon as keyof typeof iconMap];
            return (
              <Link key={id} href={url} target="_blank" className="text-gray-700 hover:text-gray-500">
                <IconComponent size={20} />
              </Link>
            );
          })}
        </div>

        {/* Mobile Contact Link */}
        <p className="block md:hidden text-center w-full mt-2">
          <Link href="/contact" className="text-gray-800 hover:text-gray-600 transition font-medium">
            {content.labels.contactUs || "Contact Us"}
          </Link>
        </p>
      </div>

      {/* MAIN HEADER */}
      <header className="bg-white text-gray-900 py-4 px-4 flex justify-between items-center relative z-50">
        {/* Logo & Tagline */}
        <div>
          <h1 className="text-2xl font-bold">
            <Link href="/" className="text-gray-900 hover:text-gray-700">
              {content.siteName}
            </Link>
          </h1>
          <strong className="text-gray-700">{content.siteTagline}</strong>
        </div>

        {/* Mobile Menu (Client Component) */}
        <MobileMenu menuItems={content.menu} />
      </header>
    </>
  );
}
