import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { ResearchPaper } from "@/lib/models/ResearchPaper";
import { requireSession } from "@/lib/auth/api";
import { resolveUploadImageAsset } from "@/lib/assets/resolve-image";
import { serializeResearchPaper } from "@/lib/research-papers";
import { researchThumbnailFromAssetSchema } from "@/lib/validations/research-thumbnail";
import { removeResearchThumbnailFiles, saveResearchThumbnail } from "@/lib/uploads/research-thumbnail";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getPaper(id: string) {
  await connectDb();
  return ResearchPaper.findById(id);
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    const paper = await getPaper(id);
    if (!paper) {
      return NextResponse.json({ error: "Research paper not found." }, { status: 404 });
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

      const previousUrl = paper.thumbnailUrl ?? "";
      if (previousUrl.startsWith(`/uploads/research/${id}.`)) {
        await removeResearchThumbnailFiles(id);
      }

      paper.thumbnailUrl = asset.publicPath;
      await paper.save();
      await paper.populate("students", "name studentId slug email isActive role profile.designation profile.avatarUrl");

      return NextResponse.json({
        ok: true,
        thumbnailUrl: asset.publicPath,
        paper: serializeResearchPaper(paper),
      });
    }

    const formData = await request.formData();
    const file = formData.get("thumbnail");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
    }

    const saved = await saveResearchThumbnail(id, file);
    if ("error" in saved) {
      return NextResponse.json({ error: saved.error }, { status: 400 });
    }

    paper.thumbnailUrl = saved.thumbnailUrl;
    await paper.save();
    await paper.populate("students", "name studentId slug email isActive role profile.designation profile.avatarUrl");

    return NextResponse.json({
      ok: true,
      thumbnailUrl: saved.thumbnailUrl,
      paper: serializeResearchPaper(paper),
    });
  } catch (error) {
    console.error("Research thumbnail update failed:", error);
    return NextResponse.json({ error: "Unable to update thumbnail right now." }, { status: 500 });
  }
}
