import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";
import { requireSession } from "@/lib/auth/api";
import { serializeStudentProfile } from "@/lib/student-profile";
import { normalizeProfileInput, updateStudentProfileSchema } from "@/lib/validations/student-profile";

export async function GET() {
  const auth = await requireSession("student");
  if (auth.error) return auth.error;

  await connectDb();
  const user = await User.findById(auth.session.sub).select("name email studentId profile updatedAt").lean();
  if (!user) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, profile: serializeStudentProfile(user) });
}

export async function PATCH(request: Request) {
  const auth = await requireSession("student");
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = updateStudentProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid profile data." },
        { status: 400 },
      );
    }

    await connectDb();
    const user = await User.findById(auth.session.sub);
    if (!user) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    const normalized = normalizeProfileInput(parsed.data);
    user.name = normalized.name;
    user.set("profile", {
      avatarUrl: user.profile?.avatarUrl,
      bio: normalized.profile.bio,
      phone: normalized.profile.phone,
      department: normalized.profile.department,
      designation: normalized.profile.designation,
      researchInterests: normalized.profile.researchInterests,
      website: normalized.profile.website,
      socialLinks: normalized.profile.socialLinks,
    });
    user.markModified("profile");

    await user.save();

    const profile = await User.findById(auth.session.sub)
      .select("name email studentId profile updatedAt")
      .lean();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      profile: serializeStudentProfile(profile),
    });
  } catch (error) {
    console.error("Update student profile failed:", error);
    return NextResponse.json({ error: "Unable to save profile right now." }, { status: 500 });
  }
}
