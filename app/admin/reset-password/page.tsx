import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata = {
  title: "Reset Password — Admin Portal",
};

export default function AdminResetPasswordPage() {
  return (
    <AuthShell title="Set a new password" subtitle="Choose a strong password with at least 8 characters.">
      <Suspense fallback={<p className="text-sm text-[#666]">Loading…</p>}>
        <ResetPasswordForm portal="admin" />
      </Suspense>
    </AuthShell>
  );
}
