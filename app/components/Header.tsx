import fs from "fs";
import path from "path";
import Link from "next/link";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si";
import MobileMenu from "./MobileMenu";

// Get locales path from environment variable
const localesPath = process.env.LOCALES_PATH || "locales/en.json";
const filePath = path.join(process.cwd(), localesPath);

// Load JSON content dynamically
const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const iconMap = {
  SiFacebook: SiFacebook,
  SiX: SiX,
  SiInstagram: SiInstagram,
  SiLinkedin: SiLinkedin
};

const Header = () => {
  return (
    <>
      {/* TOP BAR */}
      <div className="bg-stone-100 text-black py-2 px-4 flex justify-between items-center text-sm md:text-base">
        {/* Email */}
        <p className="hidden md:block">
          Email: <Link href={`mailto:${content.email}`} className="text-black hover:text-red-700 transition">{content.email}</Link>
        </p>

        {/* Social Icons */}
        <div className="flex gap-4 mx-auto md:mx-0">
          {content.socialLinks.map(({ id, icon, url }) => {
            const IconComponent = iconMap[icon as keyof typeof iconMap];
            return (
              <Link key={id} href={url} target="_blank" className="hover:text-red-700">
                <IconComponent size={20} />
              </Link>
            );
          })}
        </div>

        {/* Mobile Email */}
        <p className="block md:hidden text-center w-full mt-2">
          Email: <Link href={`mailto:${content.email}`} className="text-black hover:text-red-700 transition">{content.email}</Link>
        </p>
      </div>

      {/* MAIN HEADER */}
      <header className="bg-white text-red-600 py-4 px-4 flex justify-between items-center relative z-50">
        {/* Logo & Tagline */}
        <div>
          <h1 className="text-2xl font-bold">
            <Link href="/" className="text-black hover:text-red-700">{content.siteName}</Link>
          </h1>
          <strong className="fontNormal text-red-900">{content.siteTagline}</strong>
        </div>

        {/* Mobile Menu (Client Component) */}
        <MobileMenu menuItems={content.menu} />
      </header>
    </>
  );
};

export default Header;
