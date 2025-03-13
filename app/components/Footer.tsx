import fs from "fs";
import path from "path";
import Link from "next/link";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si";
import ScrollToTopButton from "./ScrollToTopButton"; // Client-side scroll-to-top button

// Define TypeScript interfaces
interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  id: string;
  icon: keyof typeof iconMap;
  url: string;
}

// Map icon strings to components
const iconMap = {
  SiFacebook: SiFacebook,
  SiX: SiX,
  SiInstagram: SiInstagram,
  SiLinkedin: SiLinkedin
};

// Load content from JSON file with explicit typing
const filePath = path.join(process.cwd(), process.env.LOCALES_PATH || "locales/en.json");
const content: {
  colors: { primary: string; secondary: string; hover: string; footerBg: string; footerText: string };
  email: string;
  phone: string;
  address: string;
  labels: { quickLinks: string; contactUs: string; followUs: string };
  footerLinks: FooterLink[];
  socialLinks: SocialLink[];
  copyright: string;
} = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const Footer = () => {
  return (
    <footer className={`${content.colors.footerBg} ${content.colors.footerText} py-12 relative`}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Quick Links */}
        <div>
          <h3 className={`text-xl font-semibold mb-4 ${content.colors.primary}`}>{content.labels.quickLinks}</h3>
          <ul className="space-y-2">
            {content.footerLinks.map((link: FooterLink) => (
              <li key={link.label}>
                <Link href={link.href} className={content.colors.hover}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className={`text-xl font-semibold mb-4 ${content.colors.primary}`}>{content.labels.contactUs}</h3>
          <p>Email: <a href={`mailto:${content.email}`} className={content.colors.hover}>{content.email}</a></p>
          <p>Phone: <a href={`tel:${content.phone}`} className={content.colors.hover}>{content.phone}</a></p>
          <p>Address: {content.address}</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className={`text-xl font-semibold mb-4 ${content.colors.primary}`}>{content.labels.followUs}</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            {content.socialLinks.map((social: SocialLink) => {
              const IconComponent = iconMap[social.icon];
              return (
                <Link key={social.id} href={social.url} target="_blank" className={content.colors.hover}>
                  <IconComponent size={24} />
                </Link>
              );
            })}
          </div>
        </div>

      </div>

      {/* 
        Copyright text is loaded from the JSON file for easy customization. 
        However, as per the license, the "Powered by TishCommerce" link 
        to the GitHub repository must remain intact and visible.
      */}
      <div className="text-center text-sm mt-8">
        {content.copyright}  
        <span className="mx-1">|</span>  
        <Link href="https://github.com/tishonator/TishCommerce" target="_blank" className={content.colors.hover}>
          Powered by TishCommerce
        </Link>
      </div>

      {/* Scroll to Top Button (Client Component) */}
      <ScrollToTopButton />
    </footer>
  );
};

export default Footer;
