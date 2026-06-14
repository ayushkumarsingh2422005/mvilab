import { ResearchPaperList } from "@/components/portal/ResearchPaperList";
import { DashboardPageHeader, DashboardWorkspace } from "@/components/dashboard/DashboardPage";
import { getValidSession } from "@/lib/auth/session";
import { getResearchPapersForStudent } from "@/lib/research-papers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Research Papers — MVI Lab Student Portal",
};

export default async function StudentResearchPapersPage() {
  const session = await getValidSession();
  if (!session) redirect("/portal/login");

  const papers = await getResearchPapersForStudent(session.sub);

  return (
    <>
      <DashboardPageHeader
        title="My research papers"
        description="Publications and papers associated with your account by the lab admin."
      />
      <DashboardWorkspace>
        <ResearchPaperList papers={papers} />
      </DashboardWorkspace>
    </>
  );
}
