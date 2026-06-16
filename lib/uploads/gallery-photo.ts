import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { UPLOADS_ROOT } from "@/lib/assets/constants";

const GALLERY_DIR = path.join(UPLOADS_ROOT, "gallery");
const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export function getGalleryPhotoPublicPath(sectionId: string, photoId: string, extension: string) {
  return `/uploads/gallery/${sectionId}/${photoId}.${extension}`;
}

export function isManagedGalleryPhotoPath(sectionId: string, photoId: string, imageUrl: string) {
  return imageUrl.startsWith(`/uploads/gallery/${sectionId}/${photoId}.`);
}

export async function saveGalleryPhoto(sectionId: string, photoId: string, file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "Use a JPG, PNG, or WebP image." as const };
  }

  if (file.size > MAX_BYTES) {
    return { error: "Image must be 5 MB or smaller." as const };
  }

  const extension = ALLOWED_TYPES.get(file.type)!;
  const sectionDir = path.join(GALLERY_DIR, sectionId);
  await mkdir(sectionDir, { recursive: true });

  for (const ext of ALLOWED_TYPES.values()) {
    try {
      await unlink(path.join(sectionDir, `${photoId}.${ext}`));
    } catch {
      // previous file may not exist
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(sectionDir, `${photoId}.${extension}`), buffer);

  return { imageUrl: getGalleryPhotoPublicPath(sectionId, photoId, extension) };
}

export async function removeGalleryPhotoFiles(sectionId: string, photoId: string) {
  const sectionDir = path.join(GALLERY_DIR, sectionId);

  for (const ext of ALLOWED_TYPES.values()) {
    try {
      await unlink(path.join(sectionDir, `${photoId}.${ext}`));
    } catch {
      // ignore missing files
    }
  }
}
