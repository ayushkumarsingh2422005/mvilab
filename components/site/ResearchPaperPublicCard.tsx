import Image from "next/image";
import Link from "next/link";
import { formatProfileSubtitle } from "@/lib/student-designations";
import type { ResearchPaperItem } from "@/lib/research-papers";

type ResearchPaperPublicCardProps = {
  paper: ResearchPaperItem;
  showAuthors?: boolean;
};

export function ResearchPaperPublicCard({ paper, showAuthors = true }: ResearchPaperPublicCardProps) {
  return (
    <article className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl border border-[#e0eaed] bg-[#f7fbfc] sm:w-56">
        {paper.thumbnailUrl ? (
          <Image
            src={paper.thumbnailUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 224px"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm font-medium text-[#667]">
            Research thumbnail
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="m-0 text-lg font-bold text-primary-dark">
          {paper.url ? (
            <a href={paper.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {paper.title}
            </a>
          ) : (
            paper.title
          )}
        </h2>
        <p className="mt-2 mb-0 text-sm text-[#667]">
          {[paper.venue, paper.year?.toString()].filter(Boolean).join(" · ")}
        </p>

        {showAuthors && paper.students.length > 0 ? (
          <div className="mt-4">
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-[#667]">Lab members</p>
            <ul className="mt-2 flex flex-wrap gap-2 p-0">
              {paper.students.map((student) => {
                const label = student.name ?? student.studentId ?? "Student";
                const subtitle = formatProfileSubtitle(student.designation, undefined);

                const content = (
                  <span className="flex items-center gap-2">
                    <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#e0eaed] bg-[#f7fbfc]">
                      {student.avatarUrl ? (
                        <Image src={student.avatarUrl} alt="" fill className="object-cover" sizes="36px" unoptimized />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-bold text-primary">
                          {label.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </span>
                    <span className="min-w-0 text-left">
                      <span className="block text-sm font-semibold text-primary-dark">{label}</span>
                      {subtitle ? <span className="block text-xs text-[#667]">{subtitle}</span> : null}
                    </span>
                  </span>
                );

                return (
                  <li key={student.id} className="list-none">
                    {student.slug ? (
                      <Link
                        href={`/student/${student.slug}`}
                        className="inline-flex rounded-xl border border-[#ececec] bg-[#fafcfd] px-3 py-2 no-underline transition hover:border-primary/25 hover:bg-primary-light/40"
                      >
                        {content}
                      </Link>
                    ) : (
                      <span className="inline-flex rounded-xl border border-[#ececec] bg-[#fafcfd] px-3 py-2">
                        {content}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {paper.description ? (
          <p className="mt-4 mb-0 whitespace-pre-wrap text-sm leading-relaxed text-[#555]">{paper.description}</p>
        ) : null}
      </div>
    </article>
  );
}
