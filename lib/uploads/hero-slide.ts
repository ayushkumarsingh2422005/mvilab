import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { UPLOADS_ROOT } from "@/lib/assets/constants";

const HERO_DIR = path.join(UPLOADS_ROOT, "hero");
const MAX_BYTES = 8 * 1024 * 1024;

const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export type HeroImageVariant = "desktop" | "mobile";

export function getHeroSlidePublicPath(slideId: string, variant: HeroImageVariant, extension: string) {
  return `/uploads/hero/${slideId}/${variant}.${extension}`;
}

export function isManagedHeroSlidePath(slideId: string, variant: HeroImageVariant, imageUrl: string) {
  return imageUrl.startsWith(`/uploads/hero/${slideId}/${variant}.`);
}

export async function saveHeroSlideImage(slideId: string, variant: HeroImageVariant, file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "Use a JPG, PNG, or WebP image." as const };
  }

  if (file.size > MAX_BYTES) {
    return { error: "Image must be 8 MB or smaller." as const };
  }

  const extension = ALLOWED_TYPES.get(file.type)!;
  const slideDir = path.join(HERO_DIR, slideId);
  await mkdir(slideDir, { recursive: true });

  for (const ext of ALLOWED_TYPES.values()) {
    try {
      await unlink(path.join(slideDir, `${variant}.${ext}`));
    } catch {
      // previous file may not exist
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(slideDir, `${variant}.${extension}`), buffer);

  return { imageUrl: getHeroSlidePublicPath(slideId, variant, extension) };
}

export async function removeHeroSlideFiles(slideId: string) {
  const slideDir = path.join(HERO_DIR, slideId);

  for (const variant of ["desktop", "mobile"] as const) {
    for (const ext of ALLOWED_TYPES.values()) {
      try {
        await unlink(path.join(slideDir, `${variant}.${ext}`));
      } catch {
        // ignore missing files
      }
    }
  }
}
