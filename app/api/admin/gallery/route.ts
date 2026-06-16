import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { connectDb } from "@/lib/db/mongoose";
import { GallerySection } from "@/lib/models/GallerySection";
import { getAllGallerySectionsForAdmin, serializeGallerySection } from "@/lib/gallery";
import {
  createGallerySectionSchema,
  normalizeGallerySectionInput,
} from "@/lib/validations/gallery";

export async function GET() {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  const sections = await getAllGallerySectionsForAdmin();
  return NextResponse.json({ ok: true, sections });
}

export async function POST(request: Request) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = createGallerySectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid gallery data." },
        { status: 400 },
      );
    }

    const normalized = normalizeGallerySectionInput(parsed.data);
    await connectDb();

    const existing = await GallerySection.findOne({ slug: normalized.slug }).select("_id");
    if (existing) {
      return NextResponse.json({ error: "That slug is already in use." }, { status: 400 });
    }

    const section = await GallerySection.create({
      ...normalized,
      photos: [],
      createdBy: auth.session.sub,
    });

    return NextResponse.json({
      ok: true,
      section: serializeGallerySection(section),
    });
  } catch (error) {
    console.error("Create gallery section failed:", error);
    return NextResponse.json({ error: "Unable to create gallery section right now." }, { status: 500 });
  }
}
