import { z } from "zod";

export const researchThumbnailFromAssetSchema = z.object({
  assetPath: z.string().trim().min(1, "Choose an image from assets."),
});
