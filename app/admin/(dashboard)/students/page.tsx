import { StudentManager } from "@/components/admin/StudentManager";
import { DashboardPageHeader, DashboardWorkspace } from "@/components/dashboard/DashboardPage";
import { connectDb } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";

export const metadata = {
  title: "Manage Students — MVI Lab Admin",
};

export default async function AdminStudentsPage() {
  await connectDb();
  const students = await User.find({ role: "student" })
    .sort({ createdAt: -1 })
    .select("name email studentId slug isActive mustResetPassword createdAt")
    .lean();

  const initialStudents = students.map((student) => ({
    id: student._id.toString(),
    name: student.name ?? undefined,
    email: student.email,
    studentId: student.studentId ?? undefined,
    slug: student.slug ?? undefined,
    isActive: student.isActive,
    mustResetPassword: student.mustResetPassword,
    createdAt: student.createdAt.toISOString(),
  }));

  return (
    <>
      <DashboardPageHeader
        title="Students"
        description="Create student accounts with a public profile slug and manage portal access."
      />
      <DashboardWorkspace>
        <StudentManager initialStudents={initialStudents} />
      </DashboardWorkspace>
    </>
  );
}
