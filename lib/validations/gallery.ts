import { z } from "zod";

export const gallerySlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Slug must be at least 3 characters.")
  .max(80, "Slug is too long.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only.");

export const gallerySectionFieldsSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(120, "Title is too long."),
  slug: gallerySlugSchema,
  description: z.string().trim().max(500, "Description is too long.").optional().or(z.literal("")),
  sortOrder: z.number().int().min(0).max(9999).optional().default(0),
  isPublished: z.boolean().optional().default(false),
});

export const createGallerySectionSchema = gallerySectionFieldsSchema;
export const updateGallerySectionSchema = gallerySectionFieldsSchema;

export const galleryPhotoFromAssetSchema = z.object({
  assetPath: z.string().trim().min(1, "Choose an image from assets."),
  caption: z.string().trim().max(200, "Caption is too long.").optional().or(z.literal("")),
});

export const galleryPhotosFromAssetsSchema = z.object({
  assetPaths: z
    .array(z.string().trim().min(1, "Choose an image from assets."))
    .min(1, "Choose at least one image from assets.")
    .max(50, "You can add up to 50 images at a time."),
});

export const updateGalleryPhotoSchema = z.object({
  caption: z.string().trim().max(200, "Caption is too long.").optional().or(z.literal("")),
  sortOrder: z.number().int().min(0).max(9999).optional(),
});

export type GallerySectionInput = z.infer<typeof gallerySectionFieldsSchema>;

export function normalizeGallerySectionInput(input: GallerySectionInput) {
  return {
    title: input.title.trim(),
    slug: input.slug.trim().toLowerCase(),
    description: input.description?.trim() || undefined,
    sortOrder: input.sortOrder ?? 0,
    isPublished: input.isPublished ?? false,
  };
}
