import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { connectDb } from "@/lib/db/mongoose";
import { NewsArticle } from "@/lib/models/NewsArticle";
import { getNewsArticlesForAdminList, serializeNewsArticle } from "@/lib/news";
import {
  createNewsArticleSchema,
  normalizeNewsArticleInput,
} from "@/lib/validations/news";

export async function GET() {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  const articles = await getNewsArticlesForAdminList();
  return NextResponse.json({ ok: true, articles });
}

export async function POST(request: Request) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = createNewsArticleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid news data." },
        { status: 400 },
      );
    }

    const normalized = normalizeNewsArticleInput(parsed.data);
    const { isNew, ...articleFields } = normalized;
    await connectDb();

    const existing = await NewsArticle.findOne({ slug: normalized.slug }).select("_id");
    if (existing) {
      return NextResponse.json({ error: "That slug is already in use." }, { status: 400 });
    }

    const article = await NewsArticle.create({
      ...articleFields,
      highlightAsNew: isNew,
      blocks: [],
      createdBy: auth.session.sub,
    });

    return NextResponse.json({
      ok: true,
      article: serializeNewsArticle(article),
    });
  } catch (error) {
    console.error("Create news article failed:", error);
    return NextResponse.json({ error: "Unable to create news article right now." }, { status: 500 });
  }
}
