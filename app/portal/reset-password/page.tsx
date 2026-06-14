import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata = {
  title: "Reset Password — Student Portal",
};

export default function StudentResetPasswordPage() {
  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password with at least 8 characters."
    >
      <Suspense fallback={<p className="text-sm text-[#666]">Loading…</p>}>
        <ResetPasswordForm portal="student" />
      </Suspense>
    </AuthShell>
  );
}
