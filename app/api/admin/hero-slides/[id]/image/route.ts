import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { resolveUploadImageAsset } from "@/lib/assets/resolve-image";
import { connectDb } from "@/lib/db/mongoose";
import { HeroSlide } from "@/lib/models/HeroSlide";
import { serializeHeroSlide } from "@/lib/hero-slides";
import { saveHeroSlideImage, type HeroImageVariant } from "@/lib/uploads/hero-slide";
import { heroSlideImageFromAssetSchema } from "@/lib/validations/hero-slide";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseVariant(value: FormDataEntryValue | null): HeroImageVariant | null {
  return value === "desktop" || value === "mobile" ? value : null;
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    await connectDb();

    const slide = await HeroSlide.findById(id);
    if (!slide) {
      return NextResponse.json({ error: "Hero slide not found." }, { status: 404 });
    }

    const contentType = request.headers.get("content-type") ?? "";
    let variant: HeroImageVariant | null = null;
    let imageUrl = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      const parsed = heroSlideImageFromAssetSchema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message ?? "Invalid image selection." },
          { status: 400 },
        );
      }

      variant = parsed.data.variant;
      const asset = await resolveUploadImageAsset(parsed.data.assetPath);
      if ("error" in asset) {
        return NextResponse.json({ error: asset.error }, { status: 400 });
      }

      imageUrl = asset.publicPath;
    } else {
      const formData = await request.formData();
      variant = parseVariant(formData.get("variant"));
      const file = formData.get("image");

      if (!variant) {
        return NextResponse.json({ error: "Choose desktop or mobile image type." }, { status: 400 });
      }

      if (!(file instanceof File) || file.size === 0) {
        return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
      }

      const saved = await saveHeroSlideImage(id, variant, file);
      if ("error" in saved) {
        return NextResponse.json({ error: saved.error }, { status: 400 });
      }

      imageUrl = saved.imageUrl;
    }

    if (!variant) {
      return NextResponse.json({ error: "Choose desktop or mobile image type." }, { status: 400 });
    }

    if (variant === "desktop") {
      slide.desktopImageUrl = imageUrl;
    } else {
      slide.mobileImageUrl = imageUrl;
    }

    if (slide.isPublished && (!slide.desktopImageUrl || !slide.mobileImageUrl)) {
      slide.isPublished = false;
    }

    await slide.save();

    return NextResponse.json({
      ok: true,
      slide: serializeHeroSlide(slide),
    });
  } catch (error) {
    console.error("Upload hero slide image failed:", error);
    return NextResponse.json({ error: "Unable to upload hero image right now." }, { status: 500 });
  }
}
