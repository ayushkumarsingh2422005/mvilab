import path from "path";

export const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");
export const UPLOADS_PUBLIC_PREFIX = "/uploads";

/** Student avatars — browse and copy paths only; uploads happen in the portal. */
export const READONLY_FOLDERS = new Set(["avatars"]);

export const ROOT_FOLDER_LABELS: Record<string, string> = {
  avatars: "Student avatars (portal uploads)",
  research: "Research paper thumbnails",
  news: "News and notice images",
};

/** Default writable folders created for the asset library. */
export const DEFAULT_ASSET_FOLDERS = ["news"] as const;

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
