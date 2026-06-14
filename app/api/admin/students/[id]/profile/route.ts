import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";
import { requireSession } from "@/lib/auth/api";
import { serializeStudentProfile } from "@/lib/student-profile";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    await connectDb();

    const user = await User.findOne({ _id: id, role: "student" }).select(
      "name email studentId profile updatedAt isActive",
    );

    if (!user) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      profile: serializeStudentProfile(user),
      isActive: user.isActive,
    });
  } catch (error) {
    console.error("Fetch student profile failed:", error);
    return NextResponse.json({ error: "Unable to load student profile right now." }, { status: 500 });
  }
}
