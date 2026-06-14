import { readdir, stat } from "fs/promises";
import path from "path";
import {
  IMAGE_EXTENSIONS,
  READONLY_FOLDERS,
  ROOT_FOLDER_LABELS,
  UPLOADS_PUBLIC_PREFIX,
} from "@/lib/assets/constants";
import { getFileExtension, resolveUploadPath } from "@/lib/assets/paths";
import { getFolderDescription, isWritablePath } from "@/lib/assets/access";

export type AssetEntry = {
  name: string;
  path: string;
  publicPath: string;
  kind: "file" | "folder";
  size?: number;
  modifiedAt?: string;
  isImage?: boolean;
  isSystemFolder?: boolean;
  description?: string;
};

export type AssetDirectoryListing = {
  path: string;
  publicPath: string;
  writable: boolean;
  description?: string;
  breadcrumbs: { label: string; path: string }[];
  entries: AssetEntry[];
};

function buildBreadcrumbs(relativePath: string) {
  const crumbs = [{ label: "uploads", path: "" }];
  if (!relativePath) return crumbs;

  const segments = relativePath.split("/");
  let current = "";

  for (const segment of segments) {
    current = current ? `${current}/${segment}` : segment;
    crumbs.push({ label: segment, path: current });
  }

  return crumbs;
}

export async function listUploadDirectory(relativePath = "") {
  const resolved = resolveUploadPath(relativePath);
  if ("error" in resolved) {
    return { error: resolved.error as string };
  }

  let directoryStat;
  try {
    directoryStat = await stat(resolved.absolutePath);
  } catch {
    return { error: "Folder not found." };
  }

  if (!directoryStat.isDirectory()) {
    return { error: "Not a folder." };
  }

  const dirents = await readdir(resolved.absolutePath, { withFileTypes: true });
  const entries: AssetEntry[] = [];

  for (const dirent of dirents) {
    if (dirent.name.startsWith(".")) continue;

    const entryRelativePath = resolved.relativePath
      ? `${resolved.relativePath}/${dirent.name}`
      : dirent.name;

    if (dirent.isDirectory()) {
      const folderLabel = !resolved.relativePath ? ROOT_FOLDER_LABELS[dirent.name] : undefined;
      const isReadonlyFolder = !resolved.relativePath && READONLY_FOLDERS.has(dirent.name);
      entries.push({
        name: dirent.name,
        path: entryRelativePath,
        publicPath: `${UPLOADS_PUBLIC_PREFIX}/${entryRelativePath}`,
        kind: "folder",
        isSystemFolder: isReadonlyFolder,
        description: folderLabel,
      });
      continue;
    }

    if (!dirent.isFile()) continue;

    const filePath = path.join(resolved.absolutePath, dirent.name);
    const fileStat = await stat(filePath);
    const extension = getFileExtension(dirent.name);

    entries.push({
      name: dirent.name,
      path: entryRelativePath,
      publicPath: `${UPLOADS_PUBLIC_PREFIX}/${entryRelativePath}`,
      kind: "file",
      size: fileStat.size,
      modifiedAt: fileStat.mtime.toISOString(),
      isImage: IMAGE_EXTENSIONS.has(extension),
    });
  }

  entries.sort((a, b) => {
    if (a.kind !== b.kind) {
      return a.kind === "folder" ? -1 : 1;
    }

    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });

  const listing: AssetDirectoryListing = {
    path: resolved.relativePath,
    publicPath: resolved.publicPath === UPLOADS_PUBLIC_PREFIX ? UPLOADS_PUBLIC_PREFIX : resolved.publicPath,
    writable: isWritablePath(resolved.relativePath),
    description: getFolderDescription(resolved.relativePath) ?? undefined,
    breadcrumbs: buildBreadcrumbs(resolved.relativePath),
    entries,
  };

  return { listing };
}
