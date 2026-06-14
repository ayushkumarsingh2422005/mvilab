import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password — Admin Portal",
};

export default function AdminForgotPasswordPage() {
  return (
    <AuthShell title="Forgot password" subtitle="Enter your admin email to receive a reset link.">
      <ForgotPasswordForm portal="admin" />
    </AuthShell>
  );
}
