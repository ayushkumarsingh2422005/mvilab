import { connectDb } from "@/lib/db/mongoose";
import { GallerySection } from "@/lib/models/GallerySection";

export type GalleryPhotoItem = {
  id: string;
  imageUrl: string;
  caption?: string;
  sortOrder: number;
};

export type GallerySectionItem = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  sortOrder: number;
  isPublished: boolean;
  photos: GalleryPhotoItem[];
  createdAt: string;
  updatedAt: string;
};

export type GallerySectionListItem = Omit<GallerySectionItem, "photos"> & {
  photoCount: number;
};

type GallerySectionDoc = {
  _id: { toString(): string };
  title: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  isPublished: boolean;
  photos?: Array<{
    _id: { toString(): string };
    imageUrl: string;
    caption?: string | null;
    sortOrder: number;
  }>;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
};

function toIsoString(value: Date | string | undefined | null) {
  if (!value) return new Date().toISOString();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function serializePhotos(photos: GallerySectionDoc["photos"]): GalleryPhotoItem[] {
  return (photos ?? [])
    .map((photo) => ({
      id: photo._id.toString(),
      imageUrl: photo.imageUrl,
      caption: photo.caption ?? undefined,
      sortOrder: photo.sortOrder ?? 0,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id));
}

export function serializeGallerySection(section: GallerySectionDoc): GallerySectionItem {
  return {
    id: section._id.toString(),
    title: section.title,
    slug: section.slug,
    description: section.description ?? undefined,
    sortOrder: section.sortOrder ?? 0,
    isPublished: section.isPublished,
    photos: serializePhotos(section.photos),
    createdAt: toIsoString(section.createdAt),
    updatedAt: toIsoString(section.updatedAt ?? section.createdAt),
  };
}

export function serializeGallerySectionList(section: GallerySectionDoc): GallerySectionListItem {
  const full = serializeGallerySection(section);
  return {
    id: full.id,
    title: full.title,
    slug: full.slug,
    description: full.description,
    sortOrder: full.sortOrder,
    isPublished: full.isPublished,
    photoCount: full.photos.length,
    createdAt: full.createdAt,
    updatedAt: full.updatedAt,
  };
}

export async function getGallerySectionsForAdmin() {
  await connectDb();
  const sections = await GallerySection.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
  return sections.map((section) => serializeGallerySectionList(section as GallerySectionDoc));
}

export async function getAllGallerySectionsForAdmin() {
  await connectDb();
  const sections = await GallerySection.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
  return sections.map((section) => serializeGallerySection(section as GallerySectionDoc));
}

export async function getGallerySectionById(id: string) {
  await connectDb();
  const section = await GallerySection.findById(id).lean();
  if (!section) return null;
  return serializeGallerySection(section as GallerySectionDoc);
}

export async function getPublishedGallerySections() {
  await connectDb();
  const sections = await GallerySection.find({ isPublished: true })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
  return sections.map((section) => serializeGallerySection(section as GallerySectionDoc));
}
