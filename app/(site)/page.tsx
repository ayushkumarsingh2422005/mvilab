import { HeroGallery } from "@/components/ui/HeroGallery";
import { LabCapabilities } from "@/components/ui/LabCapabilities";
import { LabGroupPhoto } from "@/components/ui/LabGroupPhoto";
import { LatestNews } from "@/components/ui/LatestNews";
import { NewsTicker } from "@/components/ui/NewsTicker";
import { WelcomeSection } from "@/components/ui/WelcomeSection";
import { getPublishedNewsArticles } from "@/lib/news";

export default async function Home() {
  const articles = await getPublishedNewsArticles(6);

  return (
    <>
      <HeroGallery />
      <NewsTicker articles={articles} />

      <main id="main-content">
        <WelcomeSection />
        <LatestNews articles={articles} />
        <LabCapabilities />
        <LabGroupPhoto />
      </main>
    </>
  );
}
