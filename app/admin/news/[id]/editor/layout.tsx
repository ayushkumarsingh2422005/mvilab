import { redirect } from "next/navigation";
import { getValidSession } from "@/lib/auth/session";

export default async function NewsEditorLayout({ children }: { children: React.ReactNode }) {
  const session = await getValidSession();
  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }

  return children;
}
