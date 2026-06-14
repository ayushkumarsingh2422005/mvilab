import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";
import { requireSession } from "@/lib/auth/api";
import { updateStudentSlugSchema } from "@/lib/validations/update-student-slug";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateStudentSlugSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid slug." },
        { status: 400 },
      );
    }

    const { slug } = parsed.data;
    await connectDb();

    const student = await User.findOne({ _id: id, role: "student" });
    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    const slugTaken = await User.findOne({ slug, _id: { $ne: student._id } });
    if (slugTaken) {
      return NextResponse.json({ error: "This profile slug is already in use." }, { status: 409 });
    }

    student.slug = slug;
    await student.save();

    return NextResponse.json({
      ok: true,
      student: {
        id: student._id.toString(),
        slug: student.slug,
      },
    });
  } catch (error) {
    console.error("Update student slug failed:", error);
    return NextResponse.json({ error: "Unable to update slug right now." }, { status: 500 });
  }
}
