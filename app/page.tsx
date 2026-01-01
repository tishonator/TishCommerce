import type { Metadata } from "next";
import { getLocalization } from "./utils/getLocalization";
import { getHomepageSettings } from "./utils/getHomepage";
import HomepageBanner from "./components/homepage/HomepageBanner";
import RecentProducts from "./components/homepage/RecentProducts";
import BrandStory from "./components/homepage/BrandStory";
import Testimonials from "./components/homepage/Testimonials";
import NewsletterSignup from "./components/homepage/NewsletterSignup";
import Brands from "./components/homepage/Brands";

const localeData = getLocalization();

// Set page metadata
export const metadata: Metadata = {
  title: `${localeData.siteName}`,
  description: localeData.siteTagline,
};

export default function Home() {
  const homepageSettings = getHomepageSettings();

  return (
    <main>
      {homepageSettings.banner.enabled && <HomepageBanner />}
      {homepageSettings.recentProducts.enabled && (
        <RecentProducts count={homepageSettings.recentProducts.count} />
      )}
      {homepageSettings.brandStory.enabled && <BrandStory />}
      {homepageSettings.testimonials.enabled && <Testimonials />}
      {homepageSettings.newsletter.enabled && <NewsletterSignup />}
      {homepageSettings.brands.enabled && <Brands />}
    </main>
  );
}
