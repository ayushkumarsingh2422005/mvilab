import { NextResponse } from "next/server";
import type { SessionPayload } from "@/lib/auth/types";
import { getValidSession } from "@/lib/auth/session";

export async function requireSession(role?: SessionPayload["role"]) {
  const session = await getValidSession();
  if (!session) {
    return { error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  }

  if (role && session.role !== role) {
    return { error: NextResponse.json({ error: "Forbidden." }, { status: 403 }) };
  }

  return { session };
}
