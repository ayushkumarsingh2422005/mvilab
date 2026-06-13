import { HeroGallery } from "@/components/ui/HeroGallery";
import { siteContainerClass } from "@/lib/site-container";

export default function Home() {
  return (
    <>
      <HeroGallery />

      <main id="main-content" className="min-h-[60vh] py-10">
        <div className={siteContainerClass}>
          <h1 className="mb-5 text-[2.5rem] text-primary">Welcome to MVI Lab</h1>
          <p className="text-[1.1rem] leading-relaxed text-[#555]">
            Machine Vision and Intelligence Lab
          </p>
        </div>
      </main>
    </>
  );
}
