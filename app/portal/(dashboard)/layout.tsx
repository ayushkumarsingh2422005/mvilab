import { redirect } from "next/navigation";
import { DashboardFrame } from "@/components/dashboard/DashboardFrame";
import { studentNavItems } from "@/lib/dashboard-nav";
import { getValidSession } from "@/lib/auth/session";

export default async function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getValidSession();
  if (!session || session.role !== "student") {
    redirect("/portal/login");
  }

  return (
    <DashboardFrame
      portalLabel="Student"
      userName={session.name ?? session.email}
      userMeta={session.studentId ?? session.email}
      navItems={studentNavItems}
      logoutRedirect="/portal/login"
    >
      {children}
    </DashboardFrame>
  );
}
