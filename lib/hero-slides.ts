import { connectDb } from "@/lib/db/mongoose";
import { HeroSlide } from "@/lib/models/HeroSlide";
import { DEFAULT_HERO_SLIDES, type HeroSlide as HeroSlideView } from "@/lib/hero-images";

export type HeroSlideItem = {
  id: string;
  alt: string;
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  desktopObjectPosition: string;
  mobileObjectPosition: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

type HeroSlideDoc = {
  _id: { toString(): string };
  alt: string;
  desktopImageUrl?: string | null;
  mobileImageUrl?: string | null;
  desktopObjectPosition?: string | null;
  mobileObjectPosition?: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
};

function toIsoString(value: Date | string | undefined | null) {
  if (!value) return new Date().toISOString();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export function serializeHeroSlide(slide: HeroSlideDoc): HeroSlideItem {
  return {
    id: slide._id.toString(),
    alt: slide.alt,
    desktopImageUrl: slide.desktopImageUrl ?? undefined,
    mobileImageUrl: slide.mobileImageUrl ?? undefined,
    desktopObjectPosition: slide.desktopObjectPosition?.trim() || "center center",
    mobileObjectPosition: slide.mobileObjectPosition?.trim() || "center center",
    sortOrder: slide.sortOrder ?? 0,
    isPublished: Boolean(slide.isPublished),
    createdAt: toIsoString(slide.createdAt),
    updatedAt: toIsoString(slide.updatedAt),
  };
}

export function toHeroSlideView(slide: HeroSlideItem): HeroSlideView | null {
  if (!slide.desktopImageUrl || !slide.mobileImageUrl) return null;

  return {
    id: slide.id,
    alt: slide.alt,
    desktop: slide.desktopImageUrl,
    mobile: slide.mobileImageUrl,
    desktopObjectPosition: slide.desktopObjectPosition,
    mobileObjectPosition: slide.mobileObjectPosition,
  };
}

export async function getAllHeroSlidesForAdmin() {
  await connectDb();
  const slides = await HeroSlide.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
  return slides.map((slide) => serializeHeroSlide(slide as HeroSlideDoc));
}

export async function getPublishedHeroSlidesForSite(): Promise<HeroSlideView[]> {
  await connectDb();
  const slides = await HeroSlide.find({ isPublished: true })
    .sort({ sortOrder: 1, createdAt: 1 })
    .lean();

  const views = slides
    .map((slide) => toHeroSlideView(serializeHeroSlide(slide as HeroSlideDoc)))
    .filter((slide): slide is HeroSlideView => slide !== null);

  return views.length > 0 ? views : DEFAULT_HERO_SLIDES;
}
