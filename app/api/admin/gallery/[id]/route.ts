import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { connectDb } from "@/lib/db/mongoose";
import { GallerySection } from "@/lib/models/GallerySection";
import { getGallerySectionById, serializeGallerySection } from "@/lib/gallery";
import {
  normalizeGallerySectionInput,
  updateGallerySectionSchema,
} from "@/lib/validations/gallery";
import { removeGalleryPhotoFiles, isManagedGalleryPhotoPath } from "@/lib/uploads/gallery-photo";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  const { id } = await context.params;
  const section = await getGallerySectionById(id);
  if (!section) {
    return NextResponse.json({ error: "Gallery section not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, section });
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateGallerySectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid gallery data." },
        { status: 400 },
      );
    }

    const normalized = normalizeGallerySectionInput(parsed.data);
    await connectDb();

    const section = await GallerySection.findById(id);
    if (!section) {
      return NextResponse.json({ error: "Gallery section not found." }, { status: 404 });
    }

    const slugOwner = await GallerySection.findOne({ slug: normalized.slug, _id: { $ne: id } }).select("_id");
    if (slugOwner) {
      return NextResponse.json({ error: "That slug is already in use." }, { status: 400 });
    }

    section.title = normalized.title;
    section.slug = normalized.slug;
    section.description = normalized.description;
    section.sortOrder = normalized.sortOrder;
    section.isPublished = normalized.isPublished;
    await section.save();

    return NextResponse.json({
      ok: true,
      section: serializeGallerySection(section),
    });
  } catch (error) {
    console.error("Update gallery section failed:", error);
    return NextResponse.json({ error: "Unable to update gallery section right now." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    await connectDb();

    const section = await GallerySection.findByIdAndDelete(id);
    if (!section) {
      return NextResponse.json({ error: "Gallery section not found." }, { status: 404 });
    }

    for (const photo of section.photos ?? []) {
      const photoId = photo._id.toString();
      if (isManagedGalleryPhotoPath(id, photoId, photo.imageUrl)) {
        await removeGalleryPhotoFiles(id, photoId);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete gallery section failed:", error);
    return NextResponse.json({ error: "Unable to delete gallery section right now." }, { status: 500 });
  }
}
