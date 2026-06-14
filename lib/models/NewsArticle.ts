import { Schema, model, models, type InferSchemaType, type Types } from "mongoose";

export const NEWS_CATEGORIES = ["General", "Research", "Events", "Admissions"] as const;

const newsArticleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    excerpt: { type: String, required: true, trim: true },
    category: { type: String, enum: NEWS_CATEGORIES, default: "General" },
    publishedAt: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    thumbnailUrl: { type: String, trim: true },
    blocks: { type: Schema.Types.Mixed, default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

newsArticleSchema.index({ slug: 1 }, { unique: true });
newsArticleSchema.index({ isPublished: 1, publishedAt: -1 });
newsArticleSchema.index({ createdAt: -1 });

export type NewsArticleDocument = InferSchemaType<typeof newsArticleSchema> & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const NewsArticle = models.NewsArticle ?? model("NewsArticle", newsArticleSchema);
