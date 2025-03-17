"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface LocalizationData {
  colors: { primary: string; secondary: string; hover: string; footerBg: string; footerText: string };
  labels: { [key: string]: string };
}

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
