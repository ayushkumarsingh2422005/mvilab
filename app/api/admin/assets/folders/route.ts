import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { createUploadFolder, ensureDefaultAssetFolders } from "@/lib/assets/mutations";
import { assetFolderSchema } from "@/lib/validations/asset";

export async function POST(request: Request) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    await ensureDefaultAssetFolders();

    const body = await request.json();
    const parsed = assetFolderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid folder data." },
        { status: 400 },
      );
    }

    const result = await createUploadFolder(parsed.data.parentPath, parsed.data.name);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, folder: result.folder });
  } catch (error) {
    console.error("Asset folder create failed:", error);
    return NextResponse.json({ error: "Unable to create folder right now." }, { status: 500 });
  }
}
