import path from "path";
import { UPLOADS_PUBLIC_PREFIX, UPLOADS_ROOT } from "@/lib/assets/constants";

export function normalizeRelativePath(input: string) {
  return input
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .trim();
}

export function resolveUploadPath(relativePath: string) {
  const normalized = normalizeRelativePath(relativePath);
  const segments = normalized ? normalized.split("/").filter(Boolean) : [];

  for (const segment of segments) {
    if (segment === "." || segment === "..") {
      return { error: "Invalid path." as const };
    }
  }

  const absolutePath = path.join(UPLOADS_ROOT, ...segments);
  const resolvedRoot = path.resolve(UPLOADS_ROOT);
  const resolvedTarget = path.resolve(absolutePath);

  if (!resolvedTarget.startsWith(resolvedRoot)) {
    return { error: "Invalid path." as const };
  }

  const publicPath =
    segments.length === 0
      ? UPLOADS_PUBLIC_PREFIX
      : `${UPLOADS_PUBLIC_PREFIX}/${segments.join("/")}`;

  return {
    relativePath: segments.join("/"),
    absolutePath: resolvedTarget,
    publicPath,
  };
}

export function sanitizeFolderName(name: string) {
  const trimmed = name.trim().replace(/\\/g, "/");
  if (!trimmed || trimmed.includes("/") || trimmed.includes("..")) {
    return null;
  }

  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$/.test(trimmed)) {
    return null;
  }

  return trimmed;
}

export function sanitizeFileName(name: string) {
  const base = path.basename(name.trim().replace(/\\/g, "/"));
  if (!base || base === "." || base === "..") {
    return null;
  }

  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(base)) {
    return null;
  }

  return base;
}

export function getFileExtension(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  return ext || "";
}
