import { cookies } from "next/headers";
import { connectDb } from "@/lib/db/mongoose";
import { User, type UserRole } from "@/lib/models/User";
import type { AuthPortal } from "@/lib/auth/constants";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/constants";
import { createSessionToken, verifySessionToken } from "@/lib/auth/jwt";
import type { SessionPayload } from "@/lib/auth/types";

export type { SessionPayload, UserRole } from "@/lib/auth/types";
export { createSessionToken, verifySessionToken } from "@/lib/auth/jwt";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** JWT + live DB check (isActive, role, email). Use for pages and APIs. */
export async function getValidSession(): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session) return null;

  await connectDb();
  const user = await User.findById(session.sub)
    .select("role isActive email name studentId")
    .lean();

  if (!user || !user.isActive) return null;
  if (user.role !== session.role || user.email !== session.email) return null;

  return {
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
    name: user.name ?? undefined,
    studentId: user.studentId ?? undefined,
  };
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function roleMatchesPortal(role: UserRole, portal: AuthPortal) {
  return (portal === "admin" && role === "admin") || (portal === "student" && role === "student");
}

export function getAppUrl() {
  return process.env.APP_URL ?? "http://localhost:3000";
}
