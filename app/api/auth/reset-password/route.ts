import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";
import { enforceAuthRateLimit } from "@/lib/auth/rate-limit-auth";
import { consumePasswordResetToken } from "@/lib/auth/reset-token";
import { hashPassword } from "@/lib/auth/password";
import { resetPasswordSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  const limited = enforceAuthRateLimit(request, "resetPassword");
  if (limited) return limited;

  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request." },
        { status: 400 },
      );
    }

    const { token, password } = parsed.data;
    await connectDb();

    const userId = await consumePasswordResetToken(token);
    if (!userId) {
      return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    await User.findByIdAndUpdate(userId, {
      passwordHash,
      mustResetPassword: false,
    });

    return NextResponse.json({ ok: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Reset password failed:", error);
    return NextResponse.json({ error: "Unable to reset password right now." }, { status: 500 });
  }
}
