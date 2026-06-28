export type DashboardIconKey = "home" | "users" | "admins" | "editor" | "external" | "notices" | "profile" | "papers" | "assets" | "gallery" | "hero";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: DashboardIconKey;
  external?: boolean;
  exact?: boolean;
};

export const adminNavItems: DashboardNavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    exact: true,
    icon: "home",
  },
  {
    href: "/admin/students",
    label: "Students",
    icon: "users",
  },
  {
    href: "/admin/admins",
    label: "Admins",
    icon: "admins",
  },
  {
    href: "/admin/research-papers",
    label: "Research papers",
    icon: "papers",
  },
  {
    href: "/admin/assets",
    label: "Assets",
    icon: "assets",
  },
  {
    href: "/admin/news",
    label: "News",
    icon: "notices",
  },
  {
    href: "/admin/gallery",
    label: "Gallery",
    icon: "gallery",
  },
  {
    href: "/admin/hero",
    label: "Hero banner",
    icon: "hero",
  },
];

export const studentNavItems: DashboardNavItem[] = [
  {
    href: "/portal",
    label: "Dashboard",
    exact: true,
    icon: "home",
  },
  {
    href: "/portal/profile",
    label: "My profile",
    icon: "profile",
  },
  {
    href: "/portal/papers",
    label: "My papers",
    icon: "papers",
  },
  {
    href: "/news",
    label: "Lab news",
    icon: "notices",
  },
  {
    href: "/",
    label: "Public site",
    external: true,
    icon: "external",
  },
];
