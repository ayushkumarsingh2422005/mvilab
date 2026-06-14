import { redirect } from "next/navigation";
import { DashboardFrame } from "@/components/dashboard/DashboardFrame";
import { adminNavItems } from "@/lib/dashboard-nav";
import { getValidSession } from "@/lib/auth/session";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getValidSession();
  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <DashboardFrame
      portalLabel="Admin"
      userName={session.name ?? session.email}
      userMeta={session.email}
      navItems={adminNavItems}
      logoutRedirect="/admin/login"
    >
      {children}
    </DashboardFrame>
  );
}
