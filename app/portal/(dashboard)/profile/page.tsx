import { StudentProfileForm } from "@/components/portal/StudentProfileForm";
import { DashboardPageHeader, DashboardWorkspace } from "@/components/dashboard/DashboardPage";
import { connectDb } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";
import { getValidSession } from "@/lib/auth/session";
import { serializeStudentProfile } from "@/lib/student-profile";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Profile — MVI Lab Student Portal",
};

export default async function StudentProfilePage() {
  const session = await getValidSession();
  if (!session) redirect("/portal/login");

  await connectDb();
  const user = await User.findById(session.sub).select("name email studentId profile updatedAt").lean();
  if (!user) redirect("/portal/login");

  const initialProfile = serializeStudentProfile(user);

  return (
    <>
      <DashboardPageHeader
        title="My profile"
        description="Keep your lab profile and links up to date."
      />
      <DashboardWorkspace>
        <StudentProfileForm initialProfile={initialProfile} />
      </DashboardWorkspace>
    </>
  );
}
