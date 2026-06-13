import { HeroGallery } from "@/components/ui/HeroGallery";
import { LabCapabilities } from "@/components/ui/LabCapabilities";
import { LabGroupPhoto } from "@/components/ui/LabGroupPhoto";
import { LatestNews } from "@/components/ui/LatestNews";
import { NewsTicker } from "@/components/ui/NewsTicker";
import { WelcomeSection } from "@/components/ui/WelcomeSection";

export default function Home() {
  return (
    <>
      <HeroGallery />
      <NewsTicker />

      <main id="main-content">
        <WelcomeSection />
        <LatestNews />
        <LabCapabilities />
        <LabGroupPhoto />
      </main>
    </>
  );
}
