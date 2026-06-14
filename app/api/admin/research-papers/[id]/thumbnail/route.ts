import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { ResearchPaper } from "@/lib/models/ResearchPaper";
import { requireSession } from "@/lib/auth/api";
import { serializeResearchPaper } from "@/lib/research-papers";
import { saveResearchThumbnail } from "@/lib/uploads/research-thumbnail";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    const formData = await request.formData();
    const file = formData.get("thumbnail");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
    }

    await connectDb();
    const paper = await ResearchPaper.findById(id);
    if (!paper) {
      return NextResponse.json({ error: "Research paper not found." }, { status: 404 });
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
    console.error("Research thumbnail upload failed:", error);
    return NextResponse.json({ error: "Unable to upload thumbnail right now." }, { status: 500 });
  }
}
