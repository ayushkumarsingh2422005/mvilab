import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password — Student Portal",
};

export default function StudentForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your student account email and we will send a secure reset link."
    >
      <ForgotPasswordForm portal="student" />
    </AuthShell>
  );
}
