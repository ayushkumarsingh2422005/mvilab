import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import type { DashboardNavItem } from "@/lib/dashboard-nav";

type DashboardFrameProps = {
  portalLabel: string;
  userName?: string;
  userMeta?: string;
  navItems: DashboardNavItem[];
  logoutRedirect: string;
  children: React.ReactNode;
};

export function DashboardFrame({
  portalLabel,
  userName,
  userMeta,
  navItems,
  logoutRedirect,
  children,
}: DashboardFrameProps) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#f3f7f8] lg:flex-row">
      <DashboardSidebar
        portalLabel={portalLabel}
        userName={userName}
        userMeta={userMeta}
        navItems={navItems}
        logoutRedirect={logoutRedirect}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}
