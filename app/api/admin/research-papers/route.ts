import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { ResearchPaper } from "@/lib/models/ResearchPaper";
import { requireSession } from "@/lib/auth/api";
import { getAllResearchPapers, serializeResearchPaper } from "@/lib/research-papers";
import { validateStudentAuthorIds } from "@/lib/research-papers/relations";
import {
  createResearchPaperSchema,
  normalizeResearchPaperInput,
} from "@/lib/validations/research-paper";

export async function GET() {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  const papers = await getAllResearchPapers();
  return NextResponse.json({ ok: true, papers });
}

export async function POST(request: Request) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = createResearchPaperSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid paper data." },
        { status: 400 },
      );
    }

    const normalized = normalizeResearchPaperInput(parsed.data);
    await connectDb();

    const authors = await validateStudentAuthorIds(normalized.studentIds);
    if ("error" in authors) {
      return NextResponse.json({ error: authors.error }, { status: 400 });
    }

    const paper = await ResearchPaper.create({
      title: normalized.title,
      year: normalized.year,
      venue: normalized.venue,
      url: normalized.url,
      description: normalized.description,
      students: authors.studentObjectIds,
      createdBy: auth.session.sub,
    });

    await paper.populate("students", "name studentId slug email isActive role profile.designation profile.avatarUrl");

    return NextResponse.json({
      ok: true,
      paper: serializeResearchPaper(paper),
    });
  } catch (error) {
    console.error("Create research paper failed:", error);
    return NextResponse.json({ error: "Unable to create research paper right now." }, { status: 500 });
  }
}
