import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";
import { enforceAuthRateLimit } from "@/lib/auth/rate-limit-auth";
import { AUTH_RATE_LIMITS, checkRateLimit, rateLimitResponse } from "@/lib/auth/rate-limit";
import { verifyPassword } from "@/lib/auth/password";
import {
  createSessionToken,
  roleMatchesPortal,
  setSessionCookie,
} from "@/lib/auth/session";
import { loginSchema } from "@/lib/validations/auth";
import { PORTAL_HOME } from "@/lib/auth/constants";

export async function POST(request: Request) {
  const limited = enforceAuthRateLimit(request, "login");
  if (limited) return limited;

  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request." },
        { status: 400 },
      );
    }

    const { email, password, portal } = parsed.data;
    const emailLimit = checkRateLimit({
      key: `login:email:${email.toLowerCase()}`,
      limit: AUTH_RATE_LIMITS.login.limit,
      windowMs: AUTH_RATE_LIMITS.login.windowMs,
    });
    if (!emailLimit.allowed) {
      return rateLimitResponse(emailLimit.retryAfterSec);
    }

    await connectDb();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (!roleMatchesPortal(user.role, portal)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await createSessionToken({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name ?? undefined,
      studentId: user.studentId ?? undefined,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      redirectTo: PORTAL_HOME[portal],
      user: {
        email: user.email,
        role: user.role,
        name: user.name,
        studentId: user.studentId,
        mustResetPassword: user.mustResetPassword,
      },
    });
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 500 });
  }
}
