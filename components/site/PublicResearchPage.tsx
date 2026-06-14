import type { ResearchPaperItem } from "@/lib/research-papers";
import { ResearchPaperPublicCard } from "@/components/site/ResearchPaperPublicCard";
import { siteContainerClass } from "@/lib/site-container";

type PublicResearchPageProps = {
  papers: ResearchPaperItem[];
};

export function PublicResearchPage({ papers }: PublicResearchPageProps) {
  return (
    <main id="main-content" className="min-h-[50vh] py-10">
      <div className={siteContainerClass}>
        <h1 className="mb-8 text-[2rem] text-primary">Research</h1>

        {papers.length === 0 ? (
          <p className="mt-8 text-[#667]">Research papers will appear here once they are published by the lab admin.</p>
        ) : (
          <ul className="mt-8 space-y-5 p-0">
            {papers.map((paper) => (
              <li key={paper.id} className="list-none rounded-2xl border border-[#e0eaed] bg-white p-5 shadow-sm sm:p-6">
                <ResearchPaperPublicCard paper={paper} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
