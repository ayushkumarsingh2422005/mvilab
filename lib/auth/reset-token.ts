import { PasswordResetToken } from "@/lib/models/PasswordResetToken";
import { generateSecureToken, hashToken } from "@/lib/auth/password";
import type { Types } from "mongoose";

export async function createPasswordResetToken(userId: Types.ObjectId, ttlMs: number) {
  const rawToken = generateSecureToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + ttlMs);

  await PasswordResetToken.create({
    tokenHash,
    userId,
    expiresAt,
  });

  return rawToken;
}

export async function consumePasswordResetToken(rawToken: string) {
  const tokenHash = hashToken(rawToken);
  const record = await PasswordResetToken.findOne({
    tokenHash,
    usedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!record) return null;

  record.usedAt = new Date();
  await record.save();

  return record.userId;
}
