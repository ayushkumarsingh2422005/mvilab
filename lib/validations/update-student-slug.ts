import { z } from "zod";
import { studentSlugSchema } from "@/lib/validations/student-slug";

export const updateStudentSlugSchema = z.object({
  slug: studentSlugSchema,
});

export type UpdateStudentSlugInput = z.infer<typeof updateStudentSlugSchema>;
