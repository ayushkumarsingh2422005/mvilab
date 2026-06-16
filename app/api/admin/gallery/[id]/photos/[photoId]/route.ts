import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { connectDb } from "@/lib/db/mongoose";
import { GallerySection } from "@/lib/models/GallerySection";
import { serializeGallerySection } from "@/lib/gallery";
import { updateGalleryPhotoSchema } from "@/lib/validations/gallery";
import { isManagedGalleryPhotoPath, removeGalleryPhotoFiles } from "@/lib/uploads/gallery-photo";

type RouteContext = {
  params: Promise<{ id: string; photoId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const { id, photoId } = await context.params;
    const body = await request.json();
    const parsed = updateGalleryPhotoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid photo data." },
        { status: 400 },
      );
    }

    await connectDb();
    const section = await GallerySection.findById(id);
    if (!section) {
      return NextResponse.json({ error: "Gallery section not found." }, { status: 404 });
    }

    const photo = section.photos.id(photoId);
    if (!photo) {
      return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    }

    if (parsed.data.caption !== undefined) {
      photo.caption = parsed.data.caption.trim() || undefined;
    }

    if (parsed.data.sortOrder !== undefined) {
      photo.sortOrder = parsed.data.sortOrder;
    }

    section.markModified("photos");
    await section.save();

    return NextResponse.json({
      ok: true,
      section: serializeGallerySection(section),
    });
  } catch (error) {
    console.error("Update gallery photo failed:", error);
    return NextResponse.json({ error: "Unable to update photo right now." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const { id, photoId } = await context.params;
    await connectDb();

    const section = await GallerySection.findById(id);
    if (!section) {
      return NextResponse.json({ error: "Gallery section not found." }, { status: 404 });
    }

    const photo = section.photos.id(photoId);
    if (!photo) {
      return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    }

    if (isManagedGalleryPhotoPath(id, photoId, photo.imageUrl)) {
      await removeGalleryPhotoFiles(id, photoId);
    }

    section.photos.pull(photoId);
    section.markModified("photos");
    await section.save();

    return NextResponse.json({
      ok: true,
      section: serializeGallerySection(section),
    });
  } catch (error) {
    console.error("Delete gallery photo failed:", error);
    return NextResponse.json({ error: "Unable to delete photo right now." }, { status: 500 });
  }
}
