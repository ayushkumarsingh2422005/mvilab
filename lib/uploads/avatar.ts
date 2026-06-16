import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { UPLOADS_ROOT } from "@/lib/assets/constants";

const AVATAR_DIR = path.join(UPLOADS_ROOT, "avatars");
const MAX_BYTES = 2 * 1024 * 1024;

const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export function getAvatarPublicPath(userId: string, extension: string) {
  return `/uploads/avatars/${userId}.${extension}`;
}

export async function saveAvatar(userId: string, file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "Use a JPG, PNG, or WebP image." as const };
  }

  if (file.size > MAX_BYTES) {
    return { error: "Image must be 2 MB or smaller." as const };
  }

  const extension = ALLOWED_TYPES.get(file.type)!;
  await mkdir(AVATAR_DIR, { recursive: true });

  for (const ext of ALLOWED_TYPES.values()) {
    const existing = path.join(AVATAR_DIR, `${userId}.${ext}`);
    try {
      await unlink(existing);
    } catch {
      // previous avatar may not exist
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${userId}.${extension}`;
  await writeFile(path.join(AVATAR_DIR, filename), buffer);

  return { avatarUrl: getAvatarPublicPath(userId, extension) };
}

export async function removeAvatarFiles(userId: string) {
  for (const ext of ALLOWED_TYPES.values()) {
    try {
      await unlink(path.join(AVATAR_DIR, `${userId}.${ext}`));
    } catch {
      // ignore missing files
    }
  }
}
