/** Allow only same-origin relative paths (blocks //evil.com and backslash tricks). */
export function getSafeRedirectPath(next: string | null | undefined, fallback: string) {
  if (!next || typeof next !== "string") return fallback;

  const path = next.trim();
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return fallback;
  }

  return path;
}
