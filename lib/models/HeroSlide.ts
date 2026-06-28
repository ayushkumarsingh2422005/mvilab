import { Schema, model, models, type InferSchemaType, type Types } from "mongoose";

const heroSlideSchema = new Schema(
  {
    alt: { type: String, required: true, trim: true },
    desktopImageUrl: { type: String, trim: true },
    mobileImageUrl: { type: String, trim: true },
    desktopObjectPosition: { type: String, trim: true, default: "center center" },
    mobileObjectPosition: { type: String, trim: true, default: "center center" },
    sortOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

heroSlideSchema.index({ isPublished: 1, sortOrder: 1, createdAt: 1 });

export type HeroSlideDocument = InferSchemaType<typeof heroSlideSchema> & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const HeroSlide = models.HeroSlide ?? model("HeroSlide", heroSlideSchema);
