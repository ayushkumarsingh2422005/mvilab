import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { ensureDefaultAssetFolders } from "@/lib/assets/mutations";
import { listUploadDirectory } from "@/lib/assets/list";

export async function GET(request: Request) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    await ensureDefaultAssetFolders();

    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path") ?? "";
    const result = await listUploadDirectory(path);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("Asset listing failed:", error);
    return NextResponse.json({ error: "Unable to load assets right now." }, { status: 500 });
  }
}
