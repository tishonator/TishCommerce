"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  menuItems: MenuItem[];
}

const MobileMenu = ({ menuItems }: MobileMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Burger Menu Button */}
      <button className="md:hidden text-gray-900 hover:text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation Menu */}
      <nav className={`absolute md:static top-16 left-0 w-full md:w-auto bg-gray-100 md:bg-transparent md:flex flex-col md:flex-row items-start md:items-center p-6 md:p-0 transition-all ${isMenuOpen ? "block" : "hidden"}`}>
        {menuItems.map(({ label, href }) => (
          <Link 
            key={label} 
            href={href} 
            className="px-4 py-2 block text-sm md:text-base text-gray-900 hover:text-gray-700" 
            onClick={() => setIsMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
};

export default MobileMenu;
