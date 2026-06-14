import { z } from "zod";
import { NEWS_CATEGORIES } from "@/lib/news-categories";

export const newsSlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Slug must be at least 3 characters.")
  .max(80, "Slug is too long.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only.");

export const newsArticleFieldsSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200, "Title is too long."),
  slug: newsSlugSchema,
  excerpt: z.string().trim().min(1, "Excerpt is required.").max(500, "Excerpt is too long."),
  category: z.enum(NEWS_CATEGORIES),
  publishedAt: z.string().trim().optional().or(z.literal("")),
  isPublished: z.boolean().optional().default(false),
  isNew: z.boolean().optional().default(false),
});

export const createNewsArticleSchema = newsArticleFieldsSchema;
export const updateNewsArticleSchema = newsArticleFieldsSchema;

export const updateNewsSlugSchema = z.object({
  slug: newsSlugSchema,
});

export const updateNewsBlocksSchema = z.object({
  blocks: z.array(z.record(z.string(), z.unknown())).default([]),
});

export type NewsArticleInput = z.infer<typeof newsArticleFieldsSchema>;

export function normalizeNewsArticleInput(input: NewsArticleInput) {
  const publishedAt = input.publishedAt ? new Date(`${input.publishedAt}T12:00:00`) : new Date();

  return {
    title: input.title.trim(),
    slug: input.slug.trim().toLowerCase(),
    excerpt: input.excerpt.trim(),
    category: input.category,
    publishedAt: Number.isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
    isPublished: input.isPublished ?? false,
    isNew: input.isNew ?? false,
  };
}
