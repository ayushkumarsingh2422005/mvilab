import { connectDb } from "@/lib/db/mongoose";
import { PasswordResetToken } from "@/lib/models/PasswordResetToken";
import { User } from "@/lib/models/User";
import {
  detachStudentFromResearchPapers,
  getStudentDeleteBlockers,
  reassignUserCreatedContent,
} from "@/lib/research-papers/relations";
import { removeAvatarFiles } from "@/lib/uploads/avatar";
import type { UserRole } from "@/lib/models/User";

export type DeleteManagedUserResult =
  | { ok: true; role: UserRole; email: string }
  | { ok: false; error: string };

export async function deleteManagedUser(
  userId: string,
  currentAdminId: string,
): Promise<DeleteManagedUserResult> {
  if (userId === currentAdminId) {
    return { ok: false, error: "You cannot delete your own account." };
  }

  await connectDb();

  const user = await User.findById(userId);
  if (!user || (user.role !== "student" && user.role !== "admin")) {
    return { ok: false, error: "User not found." };
  }

  if (user.role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      return { ok: false, error: "Cannot delete the only administrator." };
    }

    const activeAdminCount = await User.countDocuments({ role: "admin", isActive: true });
    if (user.isActive && activeAdminCount <= 1) {
      return { ok: false, error: "Cannot delete the last active administrator." };
    }

    await reassignUserCreatedContent(userId, currentAdminId);
  }

  if (user.role === "student") {
    const blockers = await getStudentDeleteBlockers(userId);
    if (!blockers.ok) {
      return { ok: false, error: blockers.error };
    }

    await removeAvatarFiles(userId);
    await detachStudentFromResearchPapers(userId);
  }

  await PasswordResetToken.deleteMany({ userId: user._id });
  await User.findByIdAndDelete(userId);

  return {
    ok: true as const,
    role: user.role,
    email: user.email,
  };
}
