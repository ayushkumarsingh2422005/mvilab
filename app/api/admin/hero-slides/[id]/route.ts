import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { connectDb } from "@/lib/db/mongoose";
import { HeroSlide } from "@/lib/models/HeroSlide";
import { serializeHeroSlide } from "@/lib/hero-slides";
import { isManagedHeroSlidePath, removeHeroSlideFiles } from "@/lib/uploads/hero-slide";
import { normalizeHeroSlideInput, updateHeroSlideSchema } from "@/lib/validations/hero-slide";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateHeroSlideSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid hero slide data." },
        { status: 400 },
      );
    }

    await connectDb();

    const slide = await HeroSlide.findById(id);
    if (!slide) {
      return NextResponse.json({ error: "Hero slide not found." }, { status: 404 });
    }

    const normalized = normalizeHeroSlideInput(parsed.data);

    slide.alt = normalized.alt;
    slide.sortOrder = normalized.sortOrder;
    if (normalized.isPublished !== undefined) {
      if (normalized.isPublished) {
        const desktopUrl = slide.desktopImageUrl;
        const mobileUrl = slide.mobileImageUrl;
        if (!desktopUrl || !mobileUrl) {
          return NextResponse.json(
            { error: "Upload both desktop and mobile images before publishing this slide." },
            { status: 400 },
          );
        }
      }
      slide.isPublished = normalized.isPublished;
    }
    await slide.save();

    return NextResponse.json({
      ok: true,
      slide: serializeHeroSlide(slide),
    });
  } catch (error) {
    console.error("Update hero slide failed:", error);
    return NextResponse.json({ error: "Unable to update hero slide right now." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    await connectDb();

    const slide = await HeroSlide.findById(id);
    if (!slide) {
      return NextResponse.json({ error: "Hero slide not found." }, { status: 404 });
    }

    if (slide.desktopImageUrl && isManagedHeroSlidePath(id, "desktop", slide.desktopImageUrl)) {
      await removeHeroSlideFiles(id);
    } else if (slide.mobileImageUrl && isManagedHeroSlidePath(id, "mobile", slide.mobileImageUrl)) {
      await removeHeroSlideFiles(id);
    } else if (
      (slide.desktopImageUrl && slide.desktopImageUrl.startsWith(`/uploads/hero/${id}/`)) ||
      (slide.mobileImageUrl && slide.mobileImageUrl.startsWith(`/uploads/hero/${id}/`))
    ) {
      await removeHeroSlideFiles(id);
    }

    await slide.deleteOne();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete hero slide failed:", error);
    return NextResponse.json({ error: "Unable to delete hero slide right now." }, { status: 500 });
  }
}
