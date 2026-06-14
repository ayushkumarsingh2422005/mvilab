import { config } from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

/** Load `.env` then `.env.local` (same order as Next.js) for standalone scripts. */
export function loadEnvFiles() {
  const root = process.cwd();

  for (const file of [".env", ".env.local"]) {
    const filePath = resolve(root, file);
    if (existsSync(filePath)) {
      config({
        path: filePath,
        override: file === ".env.local",
        quiet: true,
      });
    }
  }
}
