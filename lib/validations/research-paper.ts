import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .max(500, "URL is too long.")
  .refine((value) => value === "" || z.url().safeParse(value).success, {
    message: "Enter a valid URL (include https://).",
  })
  .optional()
  .or(z.literal(""));

const optionalText = (max: number, label: string) =>
  z.string().trim().max(max, `${label} is too long.`).optional().or(z.literal(""));

export const researchPaperFieldsSchema = z.object({
  title: z.string().trim().min(1, "Paper title is required.").max(300, "Title is too long."),
  year: z
    .number()
    .int("Year must be a whole number.")
    .min(1900, "Enter a valid year.")
    .max(new Date().getFullYear() + 1, "Enter a valid year.")
    .optional()
    .nullable(),
  venue: optionalText(300, "Venue"),
  url: optionalUrl,
  description: optionalText(2000, "Description"),
  studentIds: z
    .array(z.string().min(1))
    .min(1, "Select at least one student author.")
    .max(100, "Too many students selected."),
});

export const createResearchPaperSchema = researchPaperFieldsSchema;
export const updateResearchPaperSchema = researchPaperFieldsSchema;

export type ResearchPaperInput = z.infer<typeof researchPaperFieldsSchema>;

function emptyToUndefined(value: string | undefined) {
  if (value === undefined || value === "") return undefined;
  return value;
}

export function normalizeResearchPaperInput(input: ResearchPaperInput) {
  return {
    title: input.title.trim(),
    year: input.year ?? undefined,
    venue: emptyToUndefined(input.venue),
    url: emptyToUndefined(input.url),
    description: emptyToUndefined(input.description),
    studentIds: input.studentIds,
  };
}
