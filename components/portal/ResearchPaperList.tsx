import type { ResearchPaperItem } from "@/lib/research-papers";
import { ResearchPaperPublicCard } from "@/components/site/ResearchPaperPublicCard";

type ResearchPaperListProps = {
  papers: ResearchPaperItem[];
  title?: string;
  emptyMessage?: string;
};

export function ResearchPaperList({
  papers,
  title = "Research papers",
  emptyMessage = "No research papers linked to your account yet.",
}: ResearchPaperListProps) {
  return (
    <section className="rounded-2xl border border-[#e0eaed] bg-white p-6 shadow-sm">
      <h2 className="m-0 text-lg font-bold text-primary-dark">{title}</h2>
      <div className="mt-4">
        {papers.length === 0 ? (
          <p className="m-0 text-sm text-[#667]">{emptyMessage}</p>
        ) : (
          <ul className="m-0 space-y-4 p-0">
            {papers.map((paper) => (
              <li key={paper.id} className="list-none rounded-xl border border-[#ececec] p-4">
                <ResearchPaperPublicCard paper={paper} showAuthors={false} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
