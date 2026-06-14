import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { ensureDefaultAssetFolders, uploadAssetFile } from "@/lib/assets/mutations";

export async function POST(request: Request) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    await ensureDefaultAssetFolders();

    const formData = await request.formData();
    const path = (formData.get("path")?.toString() ?? "").trim();
    const files = formData.getAll("files").filter((entry): entry is File => entry instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "Choose at least one file to upload." }, { status: 400 });
    }

    const uploaded = [];
    const errors: string[] = [];

    for (const file of files) {
      const result = await uploadAssetFile(path, file);
      if ("error" in result) {
        errors.push(`${file.name}: ${result.error}`);
        continue;
      }

      uploaded.push(result.file);
    }

    if (uploaded.length === 0) {
      return NextResponse.json({ error: errors[0] ?? "Upload failed." }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      files: uploaded,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Asset upload failed:", error);
    return NextResponse.json({ error: "Unable to upload files right now." }, { status: 500 });
  }
}
