"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineDocumentText,
  HiOutlineHome,
  HiOutlinePencilSquare,
  HiOutlinePhoto,
  HiOutlineShieldCheck,
  HiOutlineUserCircle,
  HiOutlineUsers,
} from "react-icons/hi2";
import { RiMegaphoneLine } from "react-icons/ri";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { site } from "@/lib/content";
import type { DashboardIconKey, DashboardNavItem } from "@/lib/dashboard-nav";

const dashboardIcons: Record<DashboardIconKey, IconType> = {
  home: HiOutlineHome,
  users: HiOutlineUsers,
  admins: HiOutlineShieldCheck,
  editor: HiOutlinePencilSquare,
  external: HiOutlineArrowTopRightOnSquare,
  notices: RiMegaphoneLine,
  profile: HiOutlineUserCircle,
  papers: HiOutlineDocumentText,
  assets: HiOutlinePhoto,
  gallery: HiOutlinePhoto,
};

type DashboardSidebarProps = {
  portalLabel: string;
  userName?: string;
  userMeta?: string;
  navItems: DashboardNavItem[];
  logoutRedirect: string;
};

function isActive(pathname: string, item: DashboardNavItem) {
  if (item.external) return false;
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function DashboardSidebar({
  portalLabel,
  userName,
  userMeta,
  navItems,
  logoutRedirect,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-auto w-full shrink-0 flex-col border-b border-[#dce8eb] bg-white lg:h-full lg:w-[260px] lg:border-b-0 lg:border-r">
      <div className="border-b border-[#e8eef0] px-5 py-5">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <Image src="/MVI-logo.png" alt="" width={40} height={40} className="rounded-full" />
          <div className="min-w-0">
            <p className="m-0 truncate font-serif text-sm font-bold text-primary-dark">{site.shortName}</p>
            <p className="m-0 truncate text-[0.72rem] font-semibold uppercase tracking-wide text-primary">
              {portalLabel}
            </p>
          </div>
        </Link>
      </div>

      <nav className="min-h-0 flex-1 overflow-x-auto overflow-y-auto px-3 py-4 lg:overflow-x-hidden" aria-label="Dashboard navigation">
        <ul className="m-0 flex list-none gap-2 p-0 lg:block lg:space-y-1">
          {navItems.map((item) => {
            const active = isActive(pathname, item);
            const Icon = dashboardIcons[item.icon];
            const className = [
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium no-underline transition",
              active
                ? "bg-primary text-white shadow-sm"
                : "text-[#445] hover:bg-primary-light hover:text-primary-dark",
            ].join(" ");

            return (
              <li key={item.href} className="shrink-0 lg:shrink">
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
                    <Icon size={20} className={`shrink-0 ${active ? "text-white" : "text-primary"}`} aria-hidden />
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href} className={className} aria-current={active ? "page" : undefined}>
                    <Icon size={20} className={`shrink-0 ${active ? "text-white" : "text-primary"}`} aria-hidden />
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-[#e8eef0] px-4 py-4">
        <div className="mb-3 rounded-xl bg-[#f7fbfc] px-3 py-3">
          <p className="m-0 truncate text-sm font-semibold text-primary-dark">{userName ?? "User"}</p>
          {userMeta ? <p className="mt-0.5 mb-0 truncate text-xs text-[#667]">{userMeta}</p> : null}
        </div>
        <LogoutButton redirectTo={logoutRedirect} label="Sign out" className="w-full" />
      </div>
    </aside>
  );
}
