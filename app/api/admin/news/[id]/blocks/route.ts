import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { connectDb } from "@/lib/db/mongoose";
import { NewsArticle } from "@/lib/models/NewsArticle";
import { serializeNewsArticle } from "@/lib/news";
import { updateNewsBlocksSchema } from "@/lib/validations/news";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateNewsBlocksSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid page content." },
        { status: 400 },
      );
    }

    await connectDb();
    const article = await NewsArticle.findById(id);
    if (!article) {
      return NextResponse.json({ error: "News article not found." }, { status: 404 });
    }

    article.blocks = parsed.data.blocks;
    await article.save();

    return NextResponse.json({
      ok: true,
      article: serializeNewsArticle(article),
    });
  } catch (error) {
    console.error("Update news blocks failed:", error);
    return NextResponse.json({ error: "Unable to save page content right now." }, { status: 500 });
  }
}
