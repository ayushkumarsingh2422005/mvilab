import { z } from "zod";

export const assetFolderSchema = z.object({
  parentPath: z.string().optional().default(""),
  name: z
    .string()
    .trim()
    .min(1, "Folder name is required.")
    .max(64, "Folder name is too long."),
});

export const assetDeleteSchema = z.object({
  path: z.string().trim().min(1, "Asset path is required."),
});
