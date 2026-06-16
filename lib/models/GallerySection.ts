import { Schema, model, models, type InferSchemaType, type Types } from "mongoose";

const galleryPhotoSchema = new Schema(
  {
    imageUrl: { type: String, required: true, trim: true },
    caption: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: true },
);

const gallerySectionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    description: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    photos: { type: [galleryPhotoSchema], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

gallerySectionSchema.index({ isPublished: 1, sortOrder: 1, createdAt: -1 });

export type GalleryPhotoDocument = InferSchemaType<typeof galleryPhotoSchema> & {
  _id: Types.ObjectId;
};

export type GallerySectionDocument = InferSchemaType<typeof gallerySectionSchema> & {
  _id: Types.ObjectId;
  photos: GalleryPhotoDocument[];
  createdAt: Date;
  updatedAt: Date;
};

export const GallerySection = models.GallerySection ?? model("GallerySection", gallerySectionSchema);
