import { AdminManager } from "@/components/admin/AdminManager";
import { DashboardPageHeader, DashboardWorkspace } from "@/components/dashboard/DashboardPage";
import { connectDb } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";
import { getValidSession } from "@/lib/auth/session";

export const metadata = {
  title: "Admin Management — MVI Lab",
};

export default async function AdminManagementPage() {
  const session = await getValidSession();
  await connectDb();

  const admins = await User.find({ role: "admin" })
    .sort({ createdAt: -1 })
    .select("name email isActive mustResetPassword createdAt")
    .lean();

  const initialAdmins = admins.map((admin) => ({
    id: admin._id.toString(),
    name: admin.name ?? undefined,
    email: admin.email,
    isActive: admin.isActive,
    mustResetPassword: admin.mustResetPassword,
    createdAt: admin.createdAt.toISOString(),
    isCurrentUser: admin._id.toString() === session?.sub,
  }));

  return (
    <>
      <DashboardPageHeader
        title="Admin management"
        description="Only existing administrators can invite new admins to the portal."
      />
      <DashboardWorkspace>
        <AdminManager initialAdmins={initialAdmins} />
      </DashboardWorkspace>
    </>
  );
}
