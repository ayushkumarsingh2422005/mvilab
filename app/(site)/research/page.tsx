import { PublicResearchPage } from "@/components/site/PublicResearchPage";
import { getPublicResearchPapers } from "@/lib/research-papers";

export const metadata = {
  title: "Research — MVI Lab",
  description: "Publications and research from MVI Lab students.",
};

export default async function ResearchPage() {
  const papers = await getPublicResearchPapers();
  return <PublicResearchPage papers={papers} />;
}
