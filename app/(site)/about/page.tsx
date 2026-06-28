import { AboutLabPage } from "@/components/site/AboutLabPage";
import { site } from "@/lib/content";

export const metadata = {
  title: `About — ${site.shortName}`,
  description:
    "Learn about the Machine Vision and Intelligence Lab at NIT Jamshedpur — our mission, research culture, and community.",
};

export default function AboutPage() {
  return <AboutLabPage />;
}
