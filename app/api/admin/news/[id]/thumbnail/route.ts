import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { resolveUploadImageAsset } from "@/lib/assets/resolve-image";
import { connectDb } from "@/lib/db/mongoose";
import { NewsArticle } from "@/lib/models/NewsArticle";
import { serializeNewsArticle } from "@/lib/news";
import { researchThumbnailFromAssetSchema } from "@/lib/validations/research-thumbnail";
import { removeNewsThumbnailFiles, saveNewsThumbnail } from "@/lib/uploads/news-thumbnail";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    await connectDb();

    const article = await NewsArticle.findById(id);
    if (!article) {
      return NextResponse.json({ error: "News article not found." }, { status: 404 });
    }

    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      const parsed = researchThumbnailFromAssetSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message ?? "Invalid asset selection." },
          { status: 400 },
        );
      }

      const asset = await resolveUploadImageAsset(parsed.data.assetPath);
      if ("error" in asset) {
        return NextResponse.json({ error: asset.error }, { status: 400 });
      }

      const previousUrl = article.thumbnailUrl ?? "";
      if (previousUrl.startsWith(`/uploads/news/articles/${id}.`)) {
        await removeNewsThumbnailFiles(id);
      }

      article.thumbnailUrl = asset.publicPath;
      await article.save();

      return NextResponse.json({
        ok: true,
        thumbnailUrl: asset.publicPath,
        article: serializeNewsArticle(article),
      });
    }

    const formData = await request.formData();
    const file = formData.get("thumbnail");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
    }

    const saved = await saveNewsThumbnail(id, file);
    if ("error" in saved) {
      return NextResponse.json({ error: saved.error }, { status: 400 });
    }

    article.thumbnailUrl = saved.thumbnailUrl;
    await article.save();

    return NextResponse.json({
      ok: true,
      thumbnailUrl: saved.thumbnailUrl,
      article: serializeNewsArticle(article),
    });
  } catch (error) {
    console.error("News thumbnail update failed:", error);
    return NextResponse.json({ error: "Unable to update thumbnail right now." }, { status: 500 });
  }
}
