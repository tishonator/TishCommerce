import fs from "fs";
import path from "path";
import Link from "next/link";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si";
import ScrollToTopButton from "./ScrollToTopButton"; // Client-side scroll-to-top button

// Load content from JSON file
const filePath = path.join(process.cwd(), process.env.LOCALES_PATH || "locales/en.json");
const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// Map icon strings to components
const iconMap = {
  SiFacebook: SiFacebook,
  SiX: SiX,
  SiInstagram: SiInstagram,
  SiLinkedin: SiLinkedin
};

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 py-12 relative">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-red-600">Quick Links</h3>
          <ul className="space-y-2">
            {content.footerLinks.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="hover:text-red-600">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-red-600">Contact Us</h3>
          <p>Email: <a href={`mailto:${content.email}`} className="hover:text-red-600">{content.email}</a></p>
          <p>Phone: <a href={`tel:${content.phone}`} className="hover:text-red-600">{content.phone}</a></p>
          <p>Address: {content.address}</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-red-600">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            {content.socialLinks.map(({ id, icon, url }) => {
              const IconComponent = iconMap[icon as keyof typeof iconMap];
              return (
                <Link key={id} href={url} target="_blank" className="hover:text-red-600">
                  <IconComponent size={24} />
                </Link>
              );
            })}
          </div>
        </div>

      </div>

      {/* Copyright (JSON-based) with a Hardcoded GitHub Link */}
      <div className="text-center text-gray-400 text-sm mt-8">
        {content.copyright}  
        <span className="mx-1">|</span>  
        <Link href="https://github.com/tishonator/tishcommerce" target="_blank" className="hover:text-red-600">
          Powered by TishCommerce
        </Link>
      </div>

      {/* Scroll to Top Button (Client Component) */}
      <ScrollToTopButton />
    </footer>
  );
};

export default Footer;
