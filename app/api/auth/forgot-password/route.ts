import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";
import { enforceAuthRateLimit } from "@/lib/auth/rate-limit-auth";
import { createPasswordResetToken } from "@/lib/auth/reset-token";
import { RESET_TOKEN_TTL_MS } from "@/lib/auth/constants";
import { buildResetUrl, sendPasswordResetEmail } from "@/lib/email/brevo";
import { forgotPasswordSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  const limited = enforceAuthRateLimit(request, "forgotPassword");
  if (limited) return limited;

  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request." },
        { status: 400 },
      );
    }

    const { email, portal } = parsed.data;
    await connectDb();

    const role = portal === "admin" ? "admin" : "student";
    const user = await User.findOne({ email: email.toLowerCase(), role, isActive: true });

    // Always return success to avoid email enumeration.
    if (user) {
      const rawToken = await createPasswordResetToken(user._id, RESET_TOKEN_TTL_MS);
      const resetUrl = buildResetUrl(portal, rawToken);

      await sendPasswordResetEmail({
        to: user.email,
        name: user.name ?? user.email,
        resetUrl,
        portalLabel: portal === "admin" ? "admin portal" : "student portal",
      });
    }

    return NextResponse.json({
      ok: true,
      message: "If an account exists for that email, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password failed:", error);
    return NextResponse.json({ error: "Unable to process request right now." }, { status: 500 });
  }
}
