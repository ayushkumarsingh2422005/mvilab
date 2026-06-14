"use client";

import { useRouter } from "next/navigation";

type LogoutButtonProps = {
  redirectTo: string;
  label?: string;
  className?: string;
};

export function LogoutButton({ redirectTo, label = "Sign out", className = "" }: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`rounded-xl border border-primary/25 px-4 py-2.5 text-sm font-semibold text-primary-dark transition hover:bg-primary-light ${className}`}
    >
      {label}
    </button>
  );
}
