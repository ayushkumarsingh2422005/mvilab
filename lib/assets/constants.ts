import path from "path";

function resolveUploadsRoot() {
  const custom = process.env.UPLOADS_DIR?.trim();
  if (custom) {
    return path.isAbsolute(custom) ? custom : path.join(process.cwd(), custom);
  }

  return path.join(process.cwd(), "public", "uploads");
}

export const UPLOADS_ROOT = resolveUploadsRoot();
export const UPLOADS_PUBLIC_PREFIX = "/uploads";

/** Student avatars — browse and copy paths only; uploads happen in the portal. */
export const READONLY_FOLDERS = new Set(["avatars"]);

export const ROOT_FOLDER_LABELS: Record<string, string> = {
  avatars: "Student avatars (portal uploads)",
  research: "Research paper thumbnails",
  gallery: "Gallery images",
  hero: "Homepage hero banners",
};

/** Default writable folders created for the asset library. */
export const DEFAULT_ASSET_FOLDERS = ["news", "gallery", "hero"] as const;

export const MAX_ASSET_BYTES = 10 * 1024 * 1024;

export const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

export const BLOCKED_EXTENSIONS = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".com",
  ".msi",
  ".sh",
  ".php",
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".jsx",
  ".html",
  ".htm",
]);
