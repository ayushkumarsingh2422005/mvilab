import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { deleteAssetEntry } from "@/lib/assets/mutations";
import { assetDeleteSchema } from "@/lib/validations/asset";

export async function DELETE(request: Request) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = assetDeleteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid delete request." },
        { status: 400 },
      );
    }

    const result = await deleteAssetEntry(parsed.data.path);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Asset delete failed:", error);
    return NextResponse.json({ error: "Unable to delete asset right now." }, { status: 500 });
  }
}
