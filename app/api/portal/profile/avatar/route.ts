import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";
import { requireSession } from "@/lib/auth/api";
import { serializeStudentProfile } from "@/lib/student-profile";
import { saveAvatar } from "@/lib/uploads/avatar";

export async function POST(request: Request) {
  const auth = await requireSession("student");
  if (auth.error) return auth.error;

  try {
    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
    }

    const upload = await saveAvatar(auth.session.sub, file);
    if ("error" in upload) {
      return NextResponse.json({ error: upload.error }, { status: 400 });
    }

    await connectDb();
    const user = await User.findById(auth.session.sub);
    if (!user) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    user.set("profile.avatarUrl", upload.avatarUrl);
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
      avatarUrl: upload.avatarUrl,
      profile: serializeStudentProfile(profile),
    });
  } catch (error) {
    console.error("Avatar upload failed:", error);
    return NextResponse.json({ error: "Unable to upload image right now." }, { status: 500 });
  }
}
