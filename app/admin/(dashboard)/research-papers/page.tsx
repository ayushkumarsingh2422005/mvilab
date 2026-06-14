import { ResearchPaperManager } from "@/components/admin/ResearchPaperManager";
import { DashboardPageHeader, DashboardWorkspace } from "@/components/dashboard/DashboardPage";
import { connectDb } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";
import { getAllResearchPapers } from "@/lib/research-papers";

export const metadata = {
  title: "Research Papers — MVI Lab Admin",
};

export default async function AdminResearchPapersPage() {
  await connectDb();

  const [papers, students] = await Promise.all([
    getAllResearchPapers(),
    User.find({ role: "student" })
      .sort({ name: 1, studentId: 1 })
      .select("name email studentId")
      .lean(),
  ]);

  const initialStudents = students.map((student) => ({
    id: student._id.toString(),
    name: student.name ?? undefined,
    email: student.email,
    studentId: student.studentId ?? undefined,
  }));

  return (
    <>
      <DashboardPageHeader
        title="Research papers"
        description="Create publications and assign student authors to each paper."
      />
      <DashboardWorkspace>
        <ResearchPaperManager initialPapers={papers} initialStudents={initialStudents} />
      </DashboardWorkspace>
    </>
  );
}
