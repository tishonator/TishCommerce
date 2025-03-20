import HomepageBanner from "./components/homepage/HomepageBanner";
import type { Metadata } from "next";
import { getLocalization } from "./utils/getLocalization";

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
    </main>
  );
}
