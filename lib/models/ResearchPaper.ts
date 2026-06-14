import { Schema, model, models, type InferSchemaType, type Types } from "mongoose";

const researchPaperSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    year: { type: Number },
    venue: { type: String, trim: true },
    url: { type: String, trim: true },
    description: { type: String, trim: true },
    thumbnailUrl: { type: String, trim: true },
    students: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

researchPaperSchema.index({ students: 1, createdAt: -1 });
researchPaperSchema.index({ createdAt: -1 });

export type ResearchPaperDocument = InferSchemaType<typeof researchPaperSchema> & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const ResearchPaper = models.ResearchPaper ?? model("ResearchPaper", researchPaperSchema);
