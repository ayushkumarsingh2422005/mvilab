import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Admin Login — MVI Lab",
};

export default function AdminLoginPage() {
  return (
    <AuthShell
      title="Admin portal"
      subtitle="Sign in to manage students, content, and the page editor."
      backHref="/"
    >
      <Suspense fallback={<p className="text-sm text-[#666]">Loading…</p>}>
        <LoginForm portal="admin" />
      </Suspense>
    </AuthShell>
  );
}
