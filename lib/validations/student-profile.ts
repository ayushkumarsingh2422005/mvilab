import { z } from "zod";
import { STUDENT_DESIGNATIONS } from "@/lib/student-designations";

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

export const socialLinksSchema = z.object({
  linkedin: optionalUrl,
  twitter: optionalUrl,
  github: optionalUrl,
  googleScholar: optionalUrl,
  orcid: optionalUrl,
  researchGate: optionalUrl,
});

export const updateStudentProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(120, "Name is too long."),
  bio: optionalText(3000, "Bio"),
  phone: optionalText(30, "Phone"),
  designation: z
    .enum(STUDENT_DESIGNATIONS, { error: "Choose a valid designation." })
    .optional()
    .or(z.literal("")),
  department: optionalText(120, "Department"),
  researchInterests: optionalText(1000, "Research interests"),
  website: optionalUrl,
  socialLinks: socialLinksSchema.optional(),
});

export type UpdateStudentProfileInput = z.infer<typeof updateStudentProfileSchema>;

function emptyToUndefined(value: string | undefined) {
  if (value === undefined || value === "") return undefined;
  return value;
}

export function normalizeProfileInput(input: UpdateStudentProfileInput) {
  const social = input.socialLinks ?? {};

  return {
    name: input.name.trim(),
    profile: {
      bio: emptyToUndefined(input.bio),
      phone: emptyToUndefined(input.phone),
      designation: emptyToUndefined(input.designation),
      department: emptyToUndefined(input.department),
      researchInterests: emptyToUndefined(input.researchInterests),
      website: emptyToUndefined(input.website),
      socialLinks: {
        linkedin: emptyToUndefined(social.linkedin),
        twitter: emptyToUndefined(social.twitter),
        github: emptyToUndefined(social.github),
        googleScholar: emptyToUndefined(social.googleScholar),
        orcid: emptyToUndefined(social.orcid),
        researchGate: emptyToUndefined(social.researchGate),
      },
    },
  };
}
