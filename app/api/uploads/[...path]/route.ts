import { readFile, stat } from "fs/promises";
import { NextResponse } from "next/server";
import { resolveUploadPath } from "@/lib/assets/paths";
import { getUploadContentType } from "@/lib/uploads/serve";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { path: segments } = await context.params;
  const resolved = resolveUploadPath(segments.join("/"));

  if ("error" in resolved) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const fileStat = await stat(resolved.absolutePath);
    if (!fileStat.isFile()) {
      return new NextResponse(null, { status: 404 });
    }

    const buffer = await readFile(resolved.absolutePath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": getUploadContentType(resolved.absolutePath),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
