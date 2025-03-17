import fs from "fs";
import path from "path";
import Link from "next/link";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si";
import MobileMenu from "./MobileMenu";

// Define TypeScript interfaces
interface SocialLink {
  id: string;
  icon: keyof typeof iconMap;
  url: string;
}

interface MenuItem {
  label: string;
  href: string;
}

interface LocalizationData {
  colors: { primary: string; secondary: string; hover: string };
  email: string;
  siteName: string;
  siteTagline: string;
  labels: { email: string };
  menu: MenuItem[];
  socialLinks: SocialLink[];
}

// Map icon strings to components
const iconMap = {
  SiFacebook: SiFacebook,
  SiX: SiX,
  SiInstagram: SiInstagram,
  SiLinkedin: SiLinkedin,
};

// Fetch localization data server-side
async function getLocalizationData(): Promise<LocalizationData> {
  const filePath = path.join(process.cwd(), "locales/en.json");
  const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return content;
}

export default async function Header() {
  const content = await getLocalizationData(); // Load localization on the server

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-stone-100 text-black py-2 px-4 flex justify-between items-center text-sm md:text-base">
        {/* Email */}
        <p className="hidden md:block">
          {content.labels.email}:{" "}
          <Link href={`mailto:${content.email}`} className={`text-black ${content.colors.hover} transition`}>
            {content.email}
          </Link>
        </p>

        {/* Social Icons */}
        <div className="flex gap-4 mx-auto md:mx-0">
          {content.socialLinks.map(({ id, icon, url }) => {
            const IconComponent = iconMap[icon as keyof typeof iconMap];
            return (
              <Link key={id} href={url} target="_blank" className={content.colors.hover}>
                <IconComponent size={20} />
              </Link>
            );
          })}
        </div>

        {/* Mobile Email */}
        <p className="block md:hidden text-center w-full mt-2">
          {content.labels.email}:{" "}
          <Link href={`mailto:${content.email}`} className={`text-black ${content.colors.hover} transition`}>
            {content.email}
          </Link>
        </p>
      </div>

      {/* MAIN HEADER */}
      <header className={`bg-white ${content.colors.primary} py-4 px-4 flex justify-between items-center relative z-50`}>
        {/* Logo & Tagline */}
        <div>
          <h1 className="text-2xl font-bold">
            <Link href="/" className={`text-black ${content.colors.hover}`}>
              {content.siteName}
            </Link>
          </h1>
          <strong className={`fontNormal ${content.colors.secondary}`}>{content.siteTagline}</strong>
        </div>

        {/* Mobile Menu (Client Component) */}
        <MobileMenu menuItems={content.menu} />
      </header>
    </>
  );
}
