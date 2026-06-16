"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryPhotoItem } from "@/lib/gallery";
import { GalleryLightbox } from "@/components/site/GalleryLightbox";

type GallerySectionPhotosProps = {
  sectionTitle: string;
  photos: GalleryPhotoItem[];
};

export function GallerySectionPhotos({ sectionTitle, photos }: GallerySectionPhotosProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {photos.map((photo, photoIndex) => (
          <li key={photo.id}>
            <button
              type="button"
              onClick={() => setActiveIndex(photoIndex)}
              className="group w-full cursor-pointer overflow-hidden rounded-xl border border-[#e8e8e8] bg-white p-0 text-left shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition hover:border-primary/25 hover:shadow-md"
            >
              <figure className="m-0">
                <div className="relative aspect-[4/3] w-full bg-[#f7fbfc]">
                  <Image
                    src={photo.imageUrl}
                    alt={photo.caption ?? sectionTitle}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                  />
                </div>
                {photo.caption ? (
                  <figcaption className="px-3 py-2 text-sm text-[#555]">{photo.caption}</figcaption>
                ) : null}
              </figure>
            </button>
          </li>
        ))}
      </ul>

      {activeIndex !== null ? (
        <GalleryLightbox
          photos={photos}
          initialIndex={activeIndex}
          sectionTitle={sectionTitle}
          onClose={() => setActiveIndex(null)}
        />
      ) : null}
    </>
  );
}
