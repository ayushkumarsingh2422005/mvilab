import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { UPLOADS_ROOT } from "@/lib/assets/constants";

const THUMBNAIL_DIR = path.join(UPLOADS_ROOT, "research");
const MAX_BYTES = 3 * 1024 * 1024;

const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export function getResearchThumbnailPublicPath(paperId: string, extension: string) {
  return `/uploads/research/${paperId}.${extension}`;
}

export async function saveResearchThumbnail(paperId: string, file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "Use a JPG, PNG, or WebP image." as const };
  }

  if (file.size > MAX_BYTES) {
    return { error: "Image must be 3 MB or smaller." as const };
  }

  const extension = ALLOWED_TYPES.get(file.type)!;
  await mkdir(THUMBNAIL_DIR, { recursive: true });

  for (const ext of ALLOWED_TYPES.values()) {
    try {
      await unlink(path.join(THUMBNAIL_DIR, `${paperId}.${ext}`));
    } catch {
      // previous thumbnail may not exist
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(THUMBNAIL_DIR, `${paperId}.${extension}`), buffer);

  return { thumbnailUrl: getResearchThumbnailPublicPath(paperId, extension) };
}

export async function removeResearchThumbnailFiles(paperId: string) {
  for (const ext of ALLOWED_TYPES.values()) {
    try {
      await unlink(path.join(THUMBNAIL_DIR, `${paperId}.${ext}`));
    } catch {
      // ignore missing files
    }
  }
}
