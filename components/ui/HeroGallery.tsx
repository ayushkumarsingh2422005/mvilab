"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { heroImages, type HeroSlide } from "@/lib/hero-images";

const NAV_BTN_CLASS =
  "pointer-events-auto flex size-12 cursor-pointer items-center justify-center rounded-xl border border-white/30 bg-primary/90 text-white shadow-[0_4px_14px_rgba(10,95,107,0.35)] backdrop-blur-sm transition hover:border-white/50 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40 max-sm:size-10 max-sm:rounded-lg max-sm:shadow-[0_2px_10px_rgba(10,95,107,0.3)]";

const SLIDE_MS = 700;

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getVisualIndex(positionIndex: number, totalSlides: number, extendedLength: number) {
  if (totalSlides <= 1) return 0;
  if (positionIndex === 0) return totalSlides - 1;
  if (positionIndex === extendedLength - 1) return 0;
  return positionIndex - 1;
}

const HERO_DESKTOP_MIN_WIDTH = 1280;
const DESKTOP_IMAGE_SIZES = `(min-width: ${HERO_DESKTOP_MIN_WIDTH}px) 100vw, 0px`;
const MOBILE_IMAGE_SIZES = `(max-width: ${HERO_DESKTOP_MIN_WIDTH - 1}px) 100vw, 0px`;

function HeroSlideImage({ slide, priority }: { slide: HeroSlide; priority?: boolean }) {
  const desktopPosition = slide.desktopObjectPosition ?? "center center";
  const mobilePosition = slide.mobileObjectPosition ?? "center center";
  const loading = priority ? "eager" : "lazy";

  return (
    <>
      <Image
        src={slide.desktop}
        alt={slide.alt}
        fill
        priority={priority}
        loading={loading}
        sizes={DESKTOP_IMAGE_SIZES}
        className="hidden object-cover xl:block"
        style={{ objectPosition: desktopPosition }}
      />
      <Image
        src={slide.mobile}
        alt={slide.alt}
        fill
        priority={priority}
        loading={loading}
        sizes={MOBILE_IMAGE_SIZES}
        className="object-cover xl:hidden"
        style={{ objectPosition: mobilePosition }}
      />
    </>
  );
}

export function HeroGallery() {
  const totalSlides = heroImages.length;
  const isInfinite = totalSlides > 1;

  const extendedSlides = useMemo(
    () =>
      isInfinite
        ? [heroImages[totalSlides - 1], ...heroImages, heroImages[0]]
        : [...heroImages],
    [isInfinite, totalSlides],
  );

  const [positionIndex, setPositionIndex] = useState(isInfinite ? 1 : 0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [heroHeight, setHeroHeight] = useState<number | null>(null);

  const positionRef = useRef(positionIndex);
  const isAnimatingRef = useRef(false);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    positionRef.current = positionIndex;
  }, [positionIndex]);

  const visualIndex = getVisualIndex(positionIndex, totalSlides, extendedSlides.length);

  const snapToIndex = useCallback((index: number) => {
    setTransitionEnabled(false);
    positionRef.current = index;
    setPositionIndex(index);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitionEnabled(true);
        isAnimatingRef.current = false;
      });
    });
  }, []);

  const resetIfNeeded = useCallback(
    (index: number) => {
      if (!isInfinite) {
        isAnimatingRef.current = false;
        return;
      }

      if (index === extendedSlides.length - 1) {
        snapToIndex(1);
        return;
      }

      if (index === 0) {
        snapToIndex(extendedSlides.length - 2);
        return;
      }

      isAnimatingRef.current = false;
    },
    [extendedSlides.length, isInfinite, snapToIndex],
  );

  const goNext = useCallback(() => {
    if (!isInfinite || isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    setTransitionEnabled(true);

    const nextIndex = positionRef.current + 1;
    positionRef.current = nextIndex;
    setPositionIndex(nextIndex);

    if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    resetTimerRef.current = window.setTimeout(() => {
      resetIfNeeded(positionRef.current);
    }, SLIDE_MS + 50);
  }, [isInfinite, resetIfNeeded]);

  const goPrev = useCallback(() => {
    if (!isInfinite || isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    setTransitionEnabled(true);

    const nextIndex = positionRef.current - 1;
    positionRef.current = nextIndex;
    setPositionIndex(nextIndex);

    if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    resetTimerRef.current = window.setTimeout(() => {
      resetIfNeeded(positionRef.current);
    }, SLIDE_MS + 50);
  }, [isInfinite, resetIfNeeded]);

  const goToSlide = useCallback(
    (index: number) => {
      if (!isInfinite || isAnimatingRef.current) return;
      if (index === visualIndex) return;

      isAnimatingRef.current = true;
      setTransitionEnabled(true);

      const nextIndex = index + 1;
      positionRef.current = nextIndex;
      setPositionIndex(nextIndex);

      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => {
        resetIfNeeded(positionRef.current);
      }, SLIDE_MS + 50);
    },
    [isInfinite, resetIfNeeded, visualIndex],
  );

  const handleTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
      resetIfNeeded(positionRef.current);
    },
    [resetIfNeeded],
  );

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const syncHeight = () => {
      const header = document.querySelector("header");
      if (!header) return;

      const isDesktop = window.matchMedia(`(min-width: ${HERO_DESKTOP_MIN_WIDTH}px)`).matches;
      if (!isDesktop) {
        setHeroHeight(null);
        return;
      }

      setHeroHeight(Math.max(0, window.innerHeight - header.getBoundingClientRect().height));
    };

    syncHeight();

    const header = document.querySelector("header");
    const observer = header ? new ResizeObserver(syncHeight) : null;
    if (header && observer) observer.observe(header);

    window.addEventListener("resize", syncHeight);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", syncHeight);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        goNext();
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        goPrev();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  return (
    <section
      className="relative w-full overflow-hidden bg-primary-dark max-xl:aspect-[4/3] max-xl:!h-auto xl:min-h-[calc(100dvh-200px)]"
      style={heroHeight !== null ? { height: heroHeight } : undefined}
      aria-roledescription="carousel"
      aria-label="Hero gallery"
    >
      <div
        onTransitionEnd={handleTransitionEnd}
        className={`flex h-full flex-col ease-in-out ${transitionEnabled ? "transition-transform duration-700" : ""}`}
        style={{ transform: `translateY(-${positionIndex * 100}%)` }}
      >
        {extendedSlides.map((image, index) => (
          <div
            key={`${image.id}-${index}`}
            className="relative h-full w-full shrink-0 bg-primary-dark"
            aria-hidden={index !== positionIndex}
          >
            <HeroSlideImage slide={image} priority={index === 1 || (!isInfinite && index === 0)} />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary-dark/50 via-transparent to-primary/10" />
          </div>
        ))}
      </div>

      <div
        className="absolute top-1/2 left-3 z-40 flex -translate-y-1/2 flex-col gap-2 sm:left-5"
        aria-label="Slide indicators"
      >
        {heroImages.map((image, index) => {
          const active = index === visualIndex;
          return (
            <button
              key={image.id}
              type="button"
              onClick={() => goToSlide(index)}
              className={`pointer-events-auto rounded-xl transition-all max-sm:rounded-lg ${
                active
                  ? "h-12 w-2.5 bg-primary-light shadow-[0_0_0_1px_rgba(255,255,255,0.35)] ring-2 ring-white/25 max-sm:h-8 max-sm:w-2 max-sm:ring-1"
                  : "h-2.5 w-2.5 bg-white/45 hover:bg-primary-light/90 max-sm:h-2 max-sm:w-2"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={active ? "true" : undefined}
            />
          );
        })}
      </div>

      <div
        className="absolute right-4 bottom-4 z-40 flex flex-row gap-2 max-sm:right-3 max-sm:bottom-3 max-sm:gap-1.5 sm:right-6 sm:bottom-6"
        aria-label="Gallery navigation"
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={!isInfinite}
          className={NAV_BTN_CLASS}
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="size-5 max-sm:size-4" />
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!isInfinite}
          className={NAV_BTN_CLASS}
          aria-label="Next slide"
        >
          <ChevronRightIcon className="size-5 max-sm:size-4" />
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        Slide {visualIndex + 1} of {totalSlides}
      </p>
    </section>
  );
}
