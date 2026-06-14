import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";
import { ResearchPaper } from "@/lib/models/ResearchPaper";
import { requireSession } from "@/lib/auth/api";
import { serializeResearchPaper } from "@/lib/research-papers";
import {
  normalizeResearchPaperInput,
  updateResearchPaperSchema,
} from "@/lib/validations/research-paper";
import { removeResearchThumbnailFiles } from "@/lib/uploads/research-thumbnail";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateResearchPaperSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid paper data." },
        { status: 400 },
      );
    }

    const normalized = normalizeResearchPaperInput(parsed.data);
    await connectDb();

    const paper = await ResearchPaper.findById(id);
    if (!paper) {
      return NextResponse.json({ error: "Research paper not found." }, { status: 404 });
    }

    const students = await User.find({
      _id: { $in: normalized.studentIds },
      role: "student",
    }).select("_id");

    if (students.length !== normalized.studentIds.length) {
      return NextResponse.json({ error: "One or more selected students were not found." }, { status: 400 });
    }

    paper.title = normalized.title;
    paper.year = normalized.year;
    paper.venue = normalized.venue;
    paper.url = normalized.url;
    paper.description = normalized.description;
    paper.students = students.map((student) => student._id);
    await paper.save();
    await paper.populate("students", "name studentId slug email isActive role profile.designation profile.avatarUrl");

    return NextResponse.json({
      ok: true,
      paper: serializeResearchPaper(paper),
    });
  } catch (error) {
    console.error("Update research paper failed:", error);
    return NextResponse.json({ error: "Unable to update research paper right now." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    await connectDb();

    const paper = await ResearchPaper.findByIdAndDelete(id);
    if (!paper) {
      return NextResponse.json({ error: "Research paper not found." }, { status: 404 });
    }

    await removeResearchThumbnailFiles(id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete research paper failed:", error);
    return NextResponse.json({ error: "Unable to delete research paper right now." }, { status: 500 });
  }
}
