import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import { connectDb } from "@/lib/db/mongoose";
import { HeroSlide } from "@/lib/models/HeroSlide";
import { getAllHeroSlidesForAdmin, serializeHeroSlide } from "@/lib/hero-slides";
import { createHeroSlideSchema, normalizeHeroSlideInput } from "@/lib/validations/hero-slide";

export async function GET() {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  const slides = await getAllHeroSlidesForAdmin();
  return NextResponse.json({ ok: true, slides });
}

export async function POST(request: Request) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = createHeroSlideSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid hero slide data." },
        { status: 400 },
      );
    }

    await connectDb();

    const slide = await HeroSlide.create({
      ...normalizeHeroSlideInput(parsed.data),
      createdBy: auth.session.sub,
    });

    return NextResponse.json({
      ok: true,
      slide: serializeHeroSlide(slide),
    });
  } catch (error) {
    console.error("Create hero slide failed:", error);
    return NextResponse.json({ error: "Unable to create hero slide right now." }, { status: 500 });
  }
}
