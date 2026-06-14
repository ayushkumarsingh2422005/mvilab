import { Schema, model, models, type InferSchemaType, type Types } from "mongoose";

export const USER_ROLES = ["admin", "student"] as const;
export type UserRole = (typeof USER_ROLES)[number];

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: USER_ROLES, required: true },
    studentId: { type: String, unique: true, sparse: true, trim: true },
    name: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    mustResetPassword: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
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
