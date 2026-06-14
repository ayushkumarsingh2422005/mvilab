import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";
import { requireSession } from "@/lib/auth/api";
import { createPasswordResetToken } from "@/lib/auth/reset-token";
import { generateTemporaryPassword, hashPassword } from "@/lib/auth/password";
import { WELCOME_TOKEN_TTL_MS } from "@/lib/auth/constants";
import { buildResetUrl, sendAdminWelcomeEmail } from "@/lib/email/brevo";
import { createAdminSchema } from "@/lib/validations/auth";

export async function GET() {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  await connectDb();
  const admins = await User.find({ role: "admin" })
    .sort({ createdAt: -1 })
    .select("name email isActive mustResetPassword createdAt createdBy")
    .lean();

  return NextResponse.json({
    admins: admins.map((admin) => ({
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      isActive: admin.isActive,
      mustResetPassword: admin.mustResetPassword,
      createdAt: admin.createdAt,
      isCurrentUser: admin._id.toString() === auth.session.sub,
    })),
  });
}

export async function POST(request: Request) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = createAdminSchema.safeParse(body);

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

    const temporaryPassword = generateTemporaryPassword();
    const passwordHash = await hashPassword(temporaryPassword);

    const admin = await User.create({
      email: email.toLowerCase(),
      name,
      role: "admin",
      passwordHash,
      mustResetPassword: true,
      isActive: true,
      createdBy: auth.session.sub,
    });

    const rawToken = await createPasswordResetToken(admin._id, WELCOME_TOKEN_TTL_MS);
    const resetUrl = buildResetUrl("admin", rawToken);

    await sendAdminWelcomeEmail({
      to: admin.email,
      name: admin.name ?? admin.email,
      resetUrl,
    });

    return NextResponse.json({
      ok: true,
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Create admin failed:", error);
    return NextResponse.json({ error: "Unable to create admin right now." }, { status: 500 });
  }
}
