export const STUDENT_DESIGNATIONS = [
  "BTech",
  "MTech",
  "PhD",
  "MSc",
  "BSc",
  "Research Scholar",
  "Postdoctoral Fellow",
] as const;

export type StudentDesignation = (typeof STUDENT_DESIGNATIONS)[number];

export function formatProfileSubtitle(designation?: string, department?: string) {
  return [designation, department].filter(Boolean).join(" · ");
}
