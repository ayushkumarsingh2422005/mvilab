import { READONLY_FOLDERS, ROOT_FOLDER_LABELS } from "@/lib/assets/constants";
import { normalizeRelativePath } from "@/lib/assets/paths";

export function getReadonlyFolderKey(relativePath: string) {
  const normalized = normalizeRelativePath(relativePath);
  if (!normalized) return null;

  const [root] = normalized.split("/");
  return READONLY_FOLDERS.has(root) ? root : null;
}

export function isWritablePath(relativePath: string) {
  return getReadonlyFolderKey(relativePath) === null;
}

export function getFolderDescription(relativePath: string) {
  const normalized = normalizeRelativePath(relativePath);
  if (!normalized) return null;

  const [root] = normalized.split("/");
  if (root === "avatars") {
    return "Uploaded by students from the portal. View and copy paths only — uploads are managed in the student portal.";
  }

  return ROOT_FOLDER_LABELS[root] ?? null;
}
