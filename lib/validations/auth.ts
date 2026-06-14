import { z } from "zod";
import { studentSlugSchema } from "@/lib/validations/student-slug";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  portal: z.enum(["admin", "student"]),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address."),
  portal: z.enum(["admin", "student"]),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is missing."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string().min(8, "Confirm your password."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export const createStudentSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.email("Enter a valid email address."),
  slug: studentSlugSchema,
});

export const createAdminSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.email("Enter a valid email address."),
});

export const setUserActiveSchema = z.object({
  isActive: z.boolean(),
});
