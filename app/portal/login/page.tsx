import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Student Login — MVI Lab",
};

export default function StudentLoginPage() {
  return (
    <AuthShell
      title="Student portal"
      subtitle="Sign in with your email and password. Your student ID was sent when your account was created."
    >
      <Suspense fallback={<p className="text-sm text-[#666]">Loading…</p>}>
        <LoginForm portal="student" />
      </Suspense>
    </AuthShell>
  );
}
