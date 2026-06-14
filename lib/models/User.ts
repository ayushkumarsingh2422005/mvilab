import { Schema, model, models, type InferSchemaType, type Types } from "mongoose";

export const USER_ROLES = ["admin", "student"] as const;
export type UserRole = (typeof USER_ROLES)[number];

const socialLinksSchema = new Schema(
  {
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    github: { type: String, trim: true },
    googleScholar: { type: String, trim: true },
    orcid: { type: String, trim: true },
    researchGate: { type: String, trim: true },
  },
  { _id: false },
);

const studentProfileSchema = new Schema(
  {
    avatarUrl: { type: String, trim: true },
    bio: { type: String, trim: true },
    phone: { type: String, trim: true },
    designation: { type: String, trim: true },
    department: { type: String, trim: true },
    researchInterests: { type: String, trim: true },
    website: { type: String, trim: true },
    socialLinks: { type: socialLinksSchema, default: () => ({}) },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: USER_ROLES, required: true },
    studentId: { type: String, unique: true, sparse: true, trim: true },
    slug: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    name: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    mustResetPassword: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    profile: { type: studentProfileSchema, default: () => ({}) },
  },
  { timestamps: true },
);

userSchema.index({ role: 1, createdAt: -1 });

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const User = models.User ?? model("User", userSchema);
