import Link from "next/link";
import Image from "next/image";
import type { ResearchPaperItem } from "@/lib/research-papers";
import type { SocialLinks, StudentProfileResponse } from "@/lib/student-profile";
import { ResearchPaperList } from "@/components/portal/ResearchPaperList";

const socialFields: { key: keyof SocialLinks; label: string; placeholder: string }[] = [
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/..." },
  { key: "github", label: "GitHub", placeholder: "https://github.com/..." },
  { key: "googleScholar", label: "Google Scholar", placeholder: "https://scholar.google.com/..." },
  { key: "orcid", label: "ORCID", placeholder: "https://orcid.org/..." },
  { key: "researchGate", label: "ResearchGate", placeholder: "https://researchgate.net/..." },
  { key: "twitter", label: "X (Twitter)", placeholder: "https://x.com/..." },
];

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#e0eaed] bg-white p-6 shadow-sm">
      <h2 className="m-0 text-lg font-bold text-primary-dark">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DetailRow({ label, value, href }: { label: string; value?: string; href?: string }) {
  if (!value) return null;

  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-[#667]">{label}</dt>
      <dd className="mt-1 mb-0 text-sm text-[#333]">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

type StudentProfileViewProps = {
  profile: StudentProfileResponse;
  papers?: ResearchPaperItem[];
  isActive?: boolean;
  backHref?: string;
  backLabel?: string;
};

export function StudentProfileView({
  profile,
  papers = [],
  isActive,
  backHref,
  backLabel = "Back to students",
}: StudentProfileViewProps) {
  const { profile: data } = profile;
  const socialEntries = socialFields
    .map(({ key, label }) => ({ label, url: data.socialLinks[key] }))
    .filter((entry) => entry.url);

  return (
    <div className="space-y-5">
      {backHref ? (
        <Link href={backHref} className="inline-flex text-sm font-medium text-primary hover:text-primary-dark hover:underline">
          ← {backLabel}
        </Link>
      ) : null}

      <ProfileSection title="Overview">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-[#e0eaed] bg-[#f7fbfc]">
            {data.avatarUrl ? (
              <Image src={data.avatarUrl} alt="" fill className="object-cover" sizes="112px" unoptimized />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-primary">
                {(profile.name ?? profile.email).charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <dl className="grid flex-1 gap-4 sm:grid-cols-2">
            <DetailRow label="Name" value={profile.name} />
            <DetailRow label="Student ID" value={profile.studentId} />
            <DetailRow label="Email" value={profile.email} />
            <DetailRow label="Phone" value={data.phone} />
            <DetailRow label="Designation" value={data.designation} />
            <DetailRow label="Department" value={data.department} />
            <DetailRow label="Website" value={data.website} href={data.website} />
            {typeof isActive === "boolean" ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[#667]">Account status</dt>
                <dd className="mt-1 mb-0">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${
                      isActive ? "bg-primary-light text-primary-dark" : "bg-[#f3f4f4] text-[#666]"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        {data.bio ? (
          <div className="mt-5 border-t border-[#ececec] pt-5">
            <h3 className="m-0 text-sm font-semibold text-primary-dark">About</h3>
            <p className="mt-2 mb-0 whitespace-pre-wrap text-sm leading-relaxed text-[#444]">{data.bio}</p>
          </div>
        ) : null}

        {data.researchInterests ? (
          <div className="mt-5 border-t border-[#ececec] pt-5">
            <h3 className="m-0 text-sm font-semibold text-primary-dark">Research interests</h3>
            <p className="mt-2 mb-0 whitespace-pre-wrap text-sm leading-relaxed text-[#444]">{data.researchInterests}</p>
          </div>
        ) : null}
      </ProfileSection>

      {socialEntries.length > 0 ? (
        <ProfileSection title="Social & academic links">
          <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
            {socialEntries.map((entry) => (
              <li key={entry.label}>
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:text-primary-dark hover:underline"
                >
                  {entry.label}
                </a>
              </li>
            ))}
          </ul>
        </ProfileSection>
      ) : null}

      <ResearchPaperList
        papers={papers}
        emptyMessage="No research papers linked to this student yet."
      />
    </div>
  );
}
