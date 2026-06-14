import type { ChaiBlock } from "@chaibuilder/sdk/types";
import { connectDb } from "@/lib/db/mongoose";
import { NewsArticle } from "@/lib/models/NewsArticle";
import type { NewsCategory } from "@/lib/news-categories";

export type { NewsCategory };

export type NewsArticleItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: NewsCategory;
  publishedAt: string;
  isPublished: boolean;
  isNew: boolean;
  thumbnailUrl?: string;
  blocks: ChaiBlock[];
  createdAt: string;
  updatedAt: string;
};

type NewsDoc = {
  _id: { toString(): string };
  title: string;
  slug: string;
  excerpt: string;
  category: NewsCategory;
  publishedAt?: Date | string | null;
  isPublished: boolean;
  isNew: boolean;
  thumbnailUrl?: string | null;
  blocks?: ChaiBlock[] | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
};

function toIsoString(value: Date | string | undefined | null) {
  if (!value) return new Date().toISOString();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export function serializeNewsArticle(article: NewsDoc): NewsArticleItem {
  return {
    id: article._id.toString(),
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    category: article.category,
    publishedAt: toIsoString(article.publishedAt),
    isPublished: article.isPublished,
    isNew: article.isNew,
    thumbnailUrl: article.thumbnailUrl ?? undefined,
    blocks: Array.isArray(article.blocks) ? article.blocks : [],
    createdAt: toIsoString(article.createdAt),
    updatedAt: toIsoString(article.updatedAt ?? article.createdAt),
  };
}

export async function getAllNewsArticles() {
  await connectDb();
  const articles = await NewsArticle.find().sort({ publishedAt: -1, createdAt: -1 }).lean();
  return articles.map((article) => serializeNewsArticle(article as NewsDoc));
}

export async function getPublishedNewsArticles(limit?: number) {
  await connectDb();
  let query = NewsArticle.find({ isPublished: true }).sort({ publishedAt: -1, createdAt: -1 });
  if (limit) {
    query = query.limit(limit);
  }

  const articles = await query.lean();
  return articles.map((article) => serializeNewsArticle(article as NewsDoc));
}

export async function getNewsArticleById(id: string) {
  await connectDb();
  const article = await NewsArticle.findById(id).lean();
  if (!article) return null;
  return serializeNewsArticle(article as NewsDoc);
}

export async function getPublishedNewsArticleBySlug(slug: string) {
  await connectDb();
  const article = await NewsArticle.findOne({ slug, isPublished: true }).lean();
  if (!article) return null;
  return serializeNewsArticle(article as NewsDoc);
}

export function formatNewsDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatNewsListDate(date: string) {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

export function getTickerNewsArticles(articles: NewsArticleItem[]) {
  const highlighted = articles.filter((article) => article.isNew);
  return highlighted.length > 0 ? highlighted : articles.slice(0, 3);
}
