import { connectDb } from "@/lib/db/mongoose";
import { PasswordResetToken } from "@/lib/models/PasswordResetToken";
import { ResearchPaper } from "@/lib/models/ResearchPaper";
import { User } from "@/lib/models/User";
import { removeAvatarFiles } from "@/lib/uploads/avatar";

export async function deleteManagedUser(userId: string, currentAdminId: string) {
  if (userId === currentAdminId) {
    return { error: "You cannot delete your own account." as const };
  }

  await connectDb();

  const user = await User.findById(userId);
  if (!user || (user.role !== "student" && user.role !== "admin")) {
    return { error: "User not found." as const };
  }

  if (user.role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      return { error: "Cannot delete the only administrator." as const };
    }

    const activeAdminCount = await User.countDocuments({ role: "admin", isActive: true });
    if (user.isActive && activeAdminCount <= 1) {
      return { error: "Cannot delete the last active administrator." as const };
    }
  }

  if (user.role === "student") {
    await removeAvatarFiles(userId);
    await ResearchPaper.updateMany({ students: user._id }, { $pull: { students: user._id } });
  }

  await PasswordResetToken.deleteMany({ userId: user._id });
  await User.findByIdAndDelete(userId);

  return {
    ok: true as const,
    role: user.role,
    email: user.email,
  };
}
