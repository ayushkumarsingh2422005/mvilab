import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { getResearchPapersForStudent } from "@/lib/research-papers";

export async function GET() {
  const auth = await requireSession("student");
  if (auth.error) return auth.error;

  const papers = await getResearchPapersForStudent(auth.session.sub);
  return NextResponse.json({ ok: true, papers });
}
