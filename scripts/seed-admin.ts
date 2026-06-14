/**
 * Seed the first admin user into MongoDB.
 *
 * Usage:
 *   npm run seed:admin
 *
 * Required env:
 *   MONGODB_URI
 *   ADMIN_EMAIL
 *   ADMIN_PASSWORD
 *
 * Optional env:
 *   ADMIN_NAME (default: "MVI Lab Admin")
 */

import { loadEnvFiles } from "../lib/env/load-env";
import { connectDb } from "../lib/db/mongoose";
import { User } from "../lib/models/User";
import { hashPassword } from "../lib/auth/password";

loadEnvFiles();

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase() || "admin@mvilab.in";
  const password = process.env.ADMIN_PASSWORD || "change-me-now";
  const name = process.env.ADMIN_NAME?.trim() || "MVI Lab Admin";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
  }

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  }

  await connectDb();

  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role === "admin") {
      console.log(`Admin already exists for ${email}. No changes made.`);
      return;
    }

    throw new Error(`A non-admin user already exists for ${email}.`);
  }

  const passwordHash = await hashPassword(password);

  await User.create({
    email,
    name,
    role: "admin",
    passwordHash,
    isActive: true,
    mustResetPassword: false,
  });

  console.log(`Admin created successfully for ${email}.`);
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
