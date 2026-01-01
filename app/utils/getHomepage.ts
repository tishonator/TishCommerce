import homepageData from "../../configs/homepage.json";

// Define Homepage Settings Structure
export interface HomepageSettings {
  banner: {
    enabled: boolean;
  };
  recentProducts: {
    enabled: boolean;
    count: number;
  };
  brandStory: {
    enabled: boolean;
  };
  testimonials: {
    enabled: boolean;
  };
  newsletter: {
    enabled: boolean;
  };
  brands: {
    enabled: boolean;
  };
}

// Default Fallback
const defaultHomepageSettings: HomepageSettings = {
  banner: {
    enabled: true,
  },
  recentProducts: {
    enabled: true,
    count: 3,
  },
  brandStory: {
    enabled: true,
  },
  testimonials: {
    enabled: true,
  },
  newsletter: {
    enabled: true,
  },
  brands: {
    enabled: true,
  },
};

// Fetch Homepage Settings
// Now using direct import for compatibility with Vercel, Cloudflare, and Netlify
export const getHomepageSettings = (): HomepageSettings => {
  return homepageData as HomepageSettings;
};
