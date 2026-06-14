import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";
import { requireSession } from "@/lib/auth/api";
import { setUserActiveSchema } from "@/lib/validations/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireSession("admin");
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = setUserActiveSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request." },
        { status: 400 },
      );
    }

    const { isActive } = parsed.data;
    await connectDb();

    const user = await User.findById(id);
    if (!user || (user.role !== "student" && user.role !== "admin")) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.role === "admin") {
      if (user._id.toString() === auth.session.sub && !isActive) {
        return NextResponse.json({ error: "You cannot deactivate your own account." }, { status: 403 });
      }

      if (!isActive && user.isActive) {
        const activeAdminCount = await User.countDocuments({ role: "admin", isActive: true });
        if (activeAdminCount <= 1) {
          return NextResponse.json(
            { error: "Cannot deactivate the last active administrator." },
            { status: 400 },
          );
        }
      }
    }

    user.isActive = isActive;
    await user.save();

    return NextResponse.json({
      ok: true,
      user: {
        id: user._id.toString(),
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Update user status failed:", error);
    return NextResponse.json({ error: "Unable to update user status right now." }, { status: 500 });
  }
}
