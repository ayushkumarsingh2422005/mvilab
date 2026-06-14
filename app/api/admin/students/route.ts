import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";
import { requireSession } from "@/lib/auth/api";
import { generateStudentId } from "@/lib/auth/student-id";
import { createPasswordResetToken } from "@/lib/auth/reset-token";
import { generateTemporaryPassword, hashPassword } from "@/lib/auth/password";
import { WELCOME_TOKEN_TTL_MS } from "@/lib/auth/constants";
import { buildResetUrl, sendStudentWelcomeEmail } from "@/lib/email/brevo";
import { createStudentSchema } from "@/lib/validations/auth";

export async function GET() {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  await connectDb();
  const students = await User.find({ role: "student" })
    .sort({ createdAt: -1 })
    .select("name email studentId isActive mustResetPassword createdAt")
    .lean();

  return NextResponse.json({
    students: students.map((student) => ({
      id: student._id.toString(),
      name: student.name,
      email: student.email,
      studentId: student.studentId,
      isActive: student.isActive,
      mustResetPassword: student.mustResetPassword,
      createdAt: student.createdAt,
    })),
  });
}

export async function POST(request: Request) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = createStudentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request." },
        { status: 400 },
      );
    }

    const { name, email } = parsed.data;
    await connectDb();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }

    const studentId = await generateStudentId();
    const temporaryPassword = generateTemporaryPassword();
    const passwordHash = await hashPassword(temporaryPassword);

    const student = await User.create({
      email: email.toLowerCase(),
      name,
      role: "student",
      studentId,
      passwordHash,
      mustResetPassword: true,
      isActive: true,
      createdBy: auth.session.sub,
    });

    const rawToken = await createPasswordResetToken(student._id, WELCOME_TOKEN_TTL_MS);
    const resetUrl = buildResetUrl("student", rawToken);

    await sendStudentWelcomeEmail({
      to: student.email,
      name: student.name ?? student.email,
      studentId,
      resetUrl,
    });

    return NextResponse.json({
      ok: true,
      student: {
        id: student._id.toString(),
        name: student.name,
        email: student.email,
        studentId: student.studentId,
      },
    });
  } catch (error) {
    console.error("Create student failed:", error);
    return NextResponse.json({ error: "Unable to create student right now." }, { status: 500 });
  }
}
