import type { Metadata } from "next";
import { getLocalization } from "./utils/getLocalization";
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
  return (
    <main>
      <HomepageBanner />
      <RecentProducts />
      <BrandStory />
      <Testimonials />
      <NewsletterSignup />
      <Brands />
    </main>
  );
}
