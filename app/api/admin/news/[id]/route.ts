import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { connectDb } from "@/lib/db/mongoose";
import { NewsArticle } from "@/lib/models/NewsArticle";
import { getNewsArticleById, serializeNewsArticle } from "@/lib/news";
import { removeNewsThumbnailFiles } from "@/lib/uploads/news-thumbnail";
import {
  normalizeNewsArticleInput,
  updateNewsArticleSchema,
} from "@/lib/validations/news";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  const { id } = await context.params;
  const article = await getNewsArticleById(id);
  if (!article) {
    return NextResponse.json({ error: "News article not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, article });
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateNewsArticleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid news data." },
        { status: 400 },
      );
    }

    const normalized = normalizeNewsArticleInput(parsed.data);
    await connectDb();

    const article = await NewsArticle.findById(id);
    if (!article) {
      return NextResponse.json({ error: "News article not found." }, { status: 404 });
    }

    const slugOwner = await NewsArticle.findOne({ slug: normalized.slug, _id: { $ne: id } }).select("_id");
    if (slugOwner) {
      return NextResponse.json({ error: "That slug is already in use." }, { status: 400 });
    }

    article.title = normalized.title;
    article.slug = normalized.slug;
    article.excerpt = normalized.excerpt;
    article.category = normalized.category;
    article.publishedAt = normalized.publishedAt;
    article.isPublished = normalized.isPublished;
    article.isNew = normalized.isNew;
    await article.save();

    return NextResponse.json({
      ok: true,
      article: serializeNewsArticle(article),
    });
  } catch (error) {
    console.error("Update news article failed:", error);
    return NextResponse.json({ error: "Unable to update news article right now." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    await connectDb();

    const article = await NewsArticle.findByIdAndDelete(id);
    if (!article) {
      return NextResponse.json({ error: "News article not found." }, { status: 404 });
    }

    await removeNewsThumbnailFiles(id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete news article failed:", error);
    return NextResponse.json({ error: "Unable to delete news article right now." }, { status: 500 });
  }
}
