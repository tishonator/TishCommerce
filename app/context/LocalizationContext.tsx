"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Define Localization Structure
interface LocalizationData {
  labels: { [key: string]: string };
  menu: { label: string; href: string }[];
  footerLinks: { label: string; href: string }[];
  socialLinks: { id: string; icon: string; url: string }[];
  homepage: {
    banner: {
      title: string;
      subtitle: string;
      buttonText: string;
      imagePath: string;
      ctaLink: string;
    };
    brandStory: {
      title: string;
      description: string;
      buttonText: string;
      ctaLink: string;
    };
    newsletter: {
      title: string;
      description: string;
      placeholder: string;
      buttonText: string;
    };
  };
  about: {
    title: string;
    imagePath: string;
    content: string;
  };
  contactForm: {
    title: string;
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    buttonText: string;
    successMessage: string;
    errorMessage: string;
    captchaError: string;
  };
  email: string;
  phone: string;
  address: string;
  siteName: string;
  siteTagline: string;
  copyright: string;
}

// Create Context
const LocalizationContext = createContext<LocalizationData | null>(null);

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [localization, setLocalization] = useState<LocalizationData | null>(null);

  useEffect(() => {
    fetch("/api/localization")
      .then((res) => res.json())
      .then((data) => setLocalization(data))
      .catch(() => console.error("Failed to load localization"));
  }, []);

  if (!localization) {
    return <p className="text-center text-gray-600">Loading...</p>; // Show loading state while fetching
  }

  return <LocalizationContext.Provider value={localization}>{children}</LocalizationContext.Provider>;
}

// Hook for using localization data
export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useLocalization must be used within LocalizationProvider");
  }
  return context;
}
