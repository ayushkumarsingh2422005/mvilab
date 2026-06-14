import { mkdir, readdir, rm, stat, writeFile } from "fs/promises";
import path from "path";
import {
  BLOCKED_EXTENSIONS,
  DEFAULT_ASSET_FOLDERS,
  MAX_ASSET_BYTES,
  UPLOADS_ROOT,
} from "@/lib/assets/constants";
import {
  getFileExtension,
  resolveUploadPath,
  sanitizeFileName,
  sanitizeFolderName,
} from "@/lib/assets/paths";
import { isWritablePath } from "@/lib/assets/access";

async function ensureUniqueFilePath(directory: string, filename: string) {
  const parsed = path.parse(filename);
  let candidate = filename;
  let counter = 1;

  while (true) {
    try {
      await stat(path.join(directory, candidate));
      candidate = `${parsed.name}-${counter}${parsed.ext}`;
      counter += 1;
    } catch {
      return candidate;
    }
  }
}

export async function createUploadFolder(parentPath: string, folderName: string) {
  if (!isWritablePath(parentPath)) {
    return { error: "The avatars folder cannot be modified here." as const };
  }

  const safeName = sanitizeFolderName(folderName);
  if (!safeName) {
    return { error: "Use letters, numbers, dots, dashes, or underscores for the folder name." as const };
  }

  const parent = resolveUploadPath(parentPath);
  if ("error" in parent) {
    return { error: parent.error as string };
  }

  let parentStat;
  try {
    parentStat = await stat(parent.absolutePath);
  } catch {
    return { error: "Parent folder not found." as const };
  }

  if (!parentStat.isDirectory()) {
    return { error: "Parent path is not a folder." as const };
  }

  const targetRelative = parent.relativePath ? `${parent.relativePath}/${safeName}` : safeName;
  const target = resolveUploadPath(targetRelative);
  if ("error" in target) {
    return { error: target.error as string };
  }

  try {
    const existing = await stat(target.absolutePath);
    if (existing.isDirectory()) {
      return { error: "A folder with that name already exists." as const };
    }
    return { error: "A file with that name already exists." as const };
  } catch {
    // folder does not exist yet
  }

  await mkdir(target.absolutePath, { recursive: false });

  return {
    folder: {
      name: safeName,
      path: target.relativePath,
      publicPath: target.publicPath,
    },
  };
}

export async function uploadAssetFile(directoryPath: string, file: File) {
  if (!isWritablePath(directoryPath)) {
    return { error: "Uploads are not allowed in the avatars folder." as const };
  }

  if (file.size > MAX_ASSET_BYTES) {
    return { error: "File must be 10 MB or smaller." as const };
  }

  const safeName = sanitizeFileName(file.name);
  if (!safeName) {
    return { error: "Invalid file name." as const };
  }

  const extension = getFileExtension(safeName);
  if (BLOCKED_EXTENSIONS.has(extension)) {
    return { error: "This file type is not allowed." as const };
  }

  const directory = resolveUploadPath(directoryPath);
  if ("error" in directory) {
    return { error: directory.error as string };
  }

  let directoryStat;
  try {
    directoryStat = await stat(directory.absolutePath);
  } catch {
    return { error: "Upload folder not found." as const };
  }

  if (!directoryStat.isDirectory()) {
    return { error: "Upload path is not a folder." as const };
  }

  const filename = await ensureUniqueFilePath(directory.absolutePath, safeName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(directory.absolutePath, filename), buffer);

  const relativePath = directory.relativePath ? `${directory.relativePath}/${filename}` : filename;
  const saved = resolveUploadPath(relativePath);
  if ("error" in saved) {
    return { error: saved.error as string };
  }

  return {
    file: {
      name: filename,
      path: saved.relativePath,
      publicPath: saved.publicPath,
      size: file.size,
    },
  };
}

export async function deleteAssetEntry(relativePath: string) {
  if (!isWritablePath(relativePath)) {
    return { error: "Student avatars cannot be deleted from here." as const };
  }

  const resolved = resolveUploadPath(relativePath);
  if ("error" in resolved) {
    return { error: resolved.error as string };
  }

  let entryStat;
  try {
    entryStat = await stat(resolved.absolutePath);
  } catch {
    return { error: "Asset not found." as const };
  }

  if (entryStat.isDirectory()) {
    const children = await readdir(resolved.absolutePath);
    const visibleChildren = children.filter((name) => !name.startsWith("."));
    if (visibleChildren.length > 0) {
      return { error: "Remove files inside this folder before deleting it." as const };
    }

    await rm(resolved.absolutePath, { recursive: false });
    return { ok: true as const };
  }

  await rm(resolved.absolutePath, { force: true });
  return { ok: true as const };
}

export async function ensureUploadsRoot() {
  await mkdir(UPLOADS_ROOT, { recursive: true });
}

export async function ensureDefaultAssetFolders() {
  await ensureUploadsRoot();

  for (const folder of DEFAULT_ASSET_FOLDERS) {
    await mkdir(path.join(UPLOADS_ROOT, folder), { recursive: true });
  }
}
