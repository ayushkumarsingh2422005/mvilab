import type { GallerySectionItem } from "@/lib/gallery";
import { GallerySectionPhotos } from "@/components/site/GallerySectionPhotos";
import { siteContainerClass } from "@/lib/site-container";

type PublicGalleryPageProps = {
  sections: GallerySectionItem[];
};

export function PublicGalleryPage({ sections }: PublicGalleryPageProps) {
  return (
    <main id="main-content" className="min-h-[60vh] py-10">
      <div className={siteContainerClass}>
        <header className="mb-8">
          <h1 className="m-0 text-[2rem] text-primary">Photo Gallery</h1>
          <p className="mt-2 mb-0 text-sm text-[#667] sm:text-base">
            A glimpse into various moments and events at MVI Lab.
          </p>
        </header>

        {sections.length === 0 ? (
          <p className="text-[#667]">Gallery photos will appear here once sections are published.</p>
        ) : (
          <div className="flex flex-col gap-12">
            {sections.map((section) => (
              <section key={section.id} id={section.slug} aria-labelledby={`gallery-${section.slug}`}>
                <div className="mb-5 border-b border-[#ececec] pb-4">
                  <h2 id={`gallery-${section.slug}`} className="m-0 text-[1.5rem] font-bold text-primary-dark">
                    {section.title}
                  </h2>
                  {section.description ? (
                    <p className="mt-2 mb-0 max-w-3xl text-sm leading-relaxed text-[#555]">{section.description}</p>
                  ) : null}
                </div>

                {section.photos.length === 0 ? (
                  <p className="text-sm text-[#667]">No photos in this section yet.</p>
                ) : (
                  <GallerySectionPhotos sectionTitle={section.title} photos={section.photos} />
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
