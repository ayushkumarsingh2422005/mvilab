import { stat } from "fs/promises";
import { IMAGE_EXTENSIONS, UPLOADS_PUBLIC_PREFIX } from "@/lib/assets/constants";
import { getFileExtension, resolveUploadPath } from "@/lib/assets/paths";

export async function resolveUploadImageAsset(publicPath: string) {
  const trimmed = publicPath.trim();
  if (!trimmed.startsWith(`${UPLOADS_PUBLIC_PREFIX}/`)) {
    return { error: "Asset path must start with /uploads/." as const };
  }

  const relativePath = trimmed.slice(UPLOADS_PUBLIC_PREFIX.length + 1);
  const resolved = resolveUploadPath(relativePath);
  if ("error" in resolved) {
    return { error: resolved.error as string };
  }

  const extension = getFileExtension(relativePath.split("/").pop() ?? "");
  if (!IMAGE_EXTENSIONS.has(extension)) {
    return { error: "Choose an image file (JPG, PNG, WebP, GIF, or SVG)." as const };
  }

  try {
    const fileStat = await stat(resolved.absolutePath);
    if (!fileStat.isFile()) {
      return { error: "Asset not found." as const };
    }
  } catch {
    return { error: "Asset not found." as const };
  }

  return {
    publicPath: trimmed,
    relativePath: resolved.relativePath,
  };
}
