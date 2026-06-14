import Link from "next/link";
import { notFound } from "next/navigation";
import { StudentProfileView } from "@/components/portal/StudentProfileView";
import { DashboardPageHeader, DashboardWorkspace } from "@/components/dashboard/DashboardPage";
import { connectDb } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";
import { getResearchPapersForStudent } from "@/lib/research-papers";
import { serializeStudentProfile } from "@/lib/student-profile";

type AdminStudentProfilePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: AdminStudentProfilePageProps) {
  const { id } = await params;
  await connectDb();
  const user = await User.findOne({ _id: id, role: "student" }).select("name studentId");
  if (!user) return { title: "Student profile — MVI Lab Admin" };

  return {
    title: `${user.name ?? user.studentId ?? "Student"} — MVI Lab Admin`,
  };
}

export default async function AdminStudentProfilePage({ params }: AdminStudentProfilePageProps) {
  const { id } = await params;
  await connectDb();

  const user = await User.findOne({ _id: id, role: "student" })
    .select("name email studentId profile updatedAt isActive")
    .lean();

  if (!user) notFound();

  const profile = serializeStudentProfile(user);
  const papers = await getResearchPapersForStudent(id);

  return (
    <>
      <DashboardPageHeader
        title={profile.name ?? profile.studentId ?? "Student profile"}
        description={`Viewing profile for ${profile.email}`}
        action={
          <Link
            href="/admin/students"
            className="rounded-xl border border-primary/25 px-4 py-2 text-sm font-semibold text-primary-dark transition hover:bg-primary-light"
          >
            Back to students
          </Link>
        }
      />
      <DashboardWorkspace>
        <StudentProfileView profile={profile} papers={papers} isActive={user.isActive} />
      </DashboardWorkspace>
    </>
  );
}
