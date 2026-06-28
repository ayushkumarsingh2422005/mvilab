import { z } from "zod";

export const heroSlideFieldsSchema = z.object({
  alt: z.string().trim().min(1, "Alt text is required.").max(200, "Alt text is too long."),
  sortOrder: z.number().int().min(0).max(9999).optional().default(0),
});

export const createHeroSlideSchema = heroSlideFieldsSchema;

export const updateHeroSlideSchema = heroSlideFieldsSchema.extend({
  isPublished: z.boolean().optional(),
});

export const heroSlideImageFromAssetSchema = z.object({
  variant: z.enum(["desktop", "mobile"]),
  assetPath: z.string().trim().min(1, "Choose an image from assets."),
});

export type HeroSlideInput = z.infer<typeof updateHeroSlideSchema>;

export function normalizeHeroSlideInput(input: HeroSlideInput) {
  return {
    alt: input.alt.trim(),
    sortOrder: input.sortOrder ?? 0,
    ...(input.isPublished !== undefined ? { isPublished: input.isPublished } : {}),
  };
}
