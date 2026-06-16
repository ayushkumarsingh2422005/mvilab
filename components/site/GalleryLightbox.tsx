"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineXMark } from "react-icons/hi2";

export type GalleryLightboxPhoto = {
  id: string;
  imageUrl: string;
  caption?: string;
};

type GalleryLightboxProps = {
  photos: GalleryLightboxPhoto[];
  initialIndex: number;
  sectionTitle: string;
  onClose: () => void;
};

export function GalleryLightbox({ photos, initialIndex, sectionTitle, onClose }: GalleryLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const photo = photos[index];

  const goPrev = useCallback(() => {
    setIndex((current) => (current > 0 ? current - 1 : photos.length - 1));
  }, [photos.length]);

  const goNext = useCallback(() => {
    setIndex((current) => (current < photos.length - 1 ? current + 1 : 0));
  }, [photos.length]);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [goNext, goPrev, onClose]);

  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-black/90" role="dialog" aria-modal="true" aria-label={`${sectionTitle} photos`}>
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-white sm:px-6">
        <p className="m-0 min-w-0 truncate text-sm font-medium sm:text-base">
          {photo.caption ?? sectionTitle}
          <span className="ml-2 text-white/60">
            {index + 1} / {photos.length}
          </span>
        </p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-white/10 text-white transition hover:bg-white/20"
          aria-label="Close gallery viewer"
        >
          <HiOutlineXMark size={22} aria-hidden />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 sm:px-20">
        {photos.length > 1 ? (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-white/10 text-white transition hover:bg-white/20 sm:left-5 sm:size-12"
            aria-label="Previous photo"
          >
            <HiOutlineChevronLeft size={28} aria-hidden />
          </button>
        ) : null}

        <div className="relative h-full w-full max-h-[calc(100vh-11rem)] max-w-6xl">
          <Image
            src={photo.imageUrl}
            alt={photo.caption ?? sectionTitle}
            fill
            className="object-contain"
            sizes="100vw"
            unoptimized
            priority
          />
        </div>

        {photos.length > 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-white/10 text-white transition hover:bg-white/20 sm:right-5 sm:size-12"
            aria-label="Next photo"
          >
            <HiOutlineChevronRight size={28} aria-hidden />
          </button>
        ) : null}
      </div>

      {photos.length > 1 ? (
        <div className="border-t border-white/10 bg-black/40 px-3 py-3 sm:px-4">
          <ul className="m-0 flex list-none gap-2 overflow-x-auto p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {photos.map((item, itemIndex) => {
              const isActive = itemIndex === index;

              return (
                <li key={item.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setIndex(itemIndex)}
                    className={[
                      "relative block size-16 overflow-hidden rounded-md border-2 transition sm:size-20",
                      isActive ? "border-white ring-2 ring-white/40" : "border-transparent opacity-70 hover:opacity-100",
                    ].join(" ")}
                    aria-label={`View photo ${itemIndex + 1}`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
