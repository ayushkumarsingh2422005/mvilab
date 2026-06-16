import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { resolveUploadImageAsset } from "@/lib/assets/resolve-image";
import { connectDb } from "@/lib/db/mongoose";
import { GallerySection } from "@/lib/models/GallerySection";
import { serializeGallerySection } from "@/lib/gallery";
import { galleryPhotoFromAssetSchema, galleryPhotosFromAssetsSchema } from "@/lib/validations/gallery";
import { saveGalleryPhoto } from "@/lib/uploads/gallery-photo";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const MAX_PHOTOS_PER_REQUEST = 50;

function collectUploadFiles(formData: FormData) {
  const files = formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length > 0) return files;

  const singlePhoto = formData.get("photo");
  if (singlePhoto instanceof File && singlePhoto.size > 0) {
    return [singlePhoto];
  }

  return [];
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    await connectDb();

    const section = await GallerySection.findById(id);
    if (!section) {
      return NextResponse.json({ error: "Gallery section not found." }, { status: 404 });
    }

    const contentType = request.headers.get("content-type") ?? "";
    const errors: string[] = [];
    const newPhotos: {
      _id: Types.ObjectId;
      imageUrl: string;
      caption?: string;
      sortOrder: number;
    }[] = [];

    if (contentType.includes("application/json")) {
      const body = await request.json();
      const batchParsed = galleryPhotosFromAssetsSchema.safeParse(body);

      if (batchParsed.success) {
        if (batchParsed.data.assetPaths.length > MAX_PHOTOS_PER_REQUEST) {
          return NextResponse.json(
            { error: `You can add up to ${MAX_PHOTOS_PER_REQUEST} images at a time.` },
            { status: 400 },
          );
        }

        for (const assetPath of batchParsed.data.assetPaths) {
          const asset = await resolveUploadImageAsset(assetPath);
          if ("error" in asset) {
            errors.push(`${assetPath}: ${asset.error}`);
            continue;
          }

          newPhotos.push({
            _id: new Types.ObjectId(),
            imageUrl: asset.publicPath,
            sortOrder: section.photos.length + newPhotos.length,
          });
        }
      } else {
        const parsed = galleryPhotoFromAssetSchema.safeParse(body);

        if (!parsed.success) {
          return NextResponse.json(
            { error: parsed.error.issues[0]?.message ?? "Invalid asset selection." },
            { status: 400 },
          );
        }

        const asset = await resolveUploadImageAsset(parsed.data.assetPath);
        if ("error" in asset) {
          return NextResponse.json({ error: asset.error }, { status: 400 });
        }

        newPhotos.push({
          _id: new Types.ObjectId(),
          imageUrl: asset.publicPath,
          caption: parsed.data.caption?.trim() || undefined,
          sortOrder: section.photos.length,
        });
      }
    } else {
      const formData = await request.formData();
      const files = collectUploadFiles(formData);
      const captionValue = formData.get("caption");
      const sharedCaption =
        typeof captionValue === "string" && captionValue.trim() ? captionValue.trim() : undefined;

      if (files.length === 0) {
        return NextResponse.json({ error: "Choose at least one image to upload." }, { status: 400 });
      }

      if (files.length > MAX_PHOTOS_PER_REQUEST) {
        return NextResponse.json(
          { error: `You can upload up to ${MAX_PHOTOS_PER_REQUEST} images at a time.` },
          { status: 400 },
        );
      }

      for (const file of files) {
        const photoId = new Types.ObjectId();
        const photoIdString = photoId.toString();
        const saved = await saveGalleryPhoto(id, photoIdString, file);

        if ("error" in saved) {
          errors.push(`${file.name}: ${saved.error}`);
          continue;
        }

        newPhotos.push({
          _id: photoId,
          imageUrl: saved.imageUrl,
          caption: sharedCaption,
          sortOrder: section.photos.length + newPhotos.length,
        });
      }
    }

    if (newPhotos.length === 0) {
      return NextResponse.json(
        { error: errors[0] ?? "Unable to add photos right now." },
        { status: 400 },
      );
    }

    for (const photo of newPhotos) {
      section.photos.push(photo);
    }
    section.markModified("photos");
    await section.save();

    return NextResponse.json({
      ok: true,
      addedCount: newPhotos.length,
      errors: errors.length > 0 ? errors : undefined,
      section: serializeGallerySection(section),
    });
  } catch (error) {
    console.error("Add gallery photo failed:", error);
    return NextResponse.json({ error: "Unable to add photo right now." }, { status: 500 });
  }
}
