import { SignJWT, jwtVerify } from "jose";
import { SESSION_MAX_AGE_SECONDS } from "@/lib/auth/constants";
import type { SessionPayload } from "@/lib/auth/types";

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    return null;
  }
  return new TextEncoder().encode(secret);
}

function requireAuthSecret() {
  const secret = getAuthSecret();
  if (!secret) {
    throw new Error("AUTH_SECRET must be set and at least 32 characters.");
  }
  return secret;
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
    name: payload.name,
    studentId: payload.studentId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(requireAuthSecret());
}

/** Edge-safe — no Node/MongoDB imports. Use in middleware. */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  const secret = getAuthSecret();
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    if (payload.role !== "admin" && payload.role !== "student") return null;

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      name: typeof payload.name === "string" ? payload.name : undefined,
      studentId: typeof payload.studentId === "string" ? payload.studentId : undefined,
    };
  } catch {
    return null;
  }
}
