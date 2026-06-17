import Image from "next/image";
import { ResearchPaperList } from "@/components/portal/ResearchPaperList";
import type { PublicStudentProfile } from "@/lib/public-students";
import type { SocialLinks } from "@/lib/student-profile";
import { formatProfileSubtitle } from "@/lib/student-designations";
import { siteContainerClass } from "@/lib/site-container";

const socialFields: { key: keyof SocialLinks; label: string }[] = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
  { key: "googleScholar", label: "Google Scholar" },
  { key: "orcid", label: "ORCID" },
  { key: "researchGate", label: "ResearchGate" },
  { key: "twitter", label: "X" },
];

type PublicStudentProfilePageProps = {
  student: PublicStudentProfile;
};

export function PublicStudentProfilePage({ student }: PublicStudentProfilePageProps) {
  const { profile: data } = student.profile;
  const socialEntries = socialFields
    .map(({ key, label }) => ({ label, url: data.socialLinks[key] }))
    .filter((entry) => entry.url);

  return (
    <main id="main-content" className="py-10">
      <div className={`${siteContainerClass} space-y-6`}>
        <section className="overflow-hidden rounded-2xl border border-[#e0eaed] bg-white shadow-sm">
          <div className="mx-auto w-full max-w-xs border-b border-[#e8eef0] bg-[#f7fbfc] sm:max-w-sm">
            <div className="relative aspect-square w-full overflow-hidden">
              {data.avatarUrl ? (
                <Image
                  src={data.avatarUrl}
                  alt={student.profile.name ?? student.slug}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 80vw, 384px"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary-light text-6xl font-bold text-primary">
                  {(student.profile.name ?? student.slug).charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div className="min-w-0 text-center sm:text-left">
              <h1 className="m-0 text-[2rem] font-bold text-primary-dark">{student.profile.name ?? student.slug}</h1>
              {formatProfileSubtitle(data.designation, data.department) ? (
                <p className="mt-2 mb-0 text-base text-[#667]">
                  {formatProfileSubtitle(data.designation, data.department)}
                </p>
              ) : null}
              {data.website ? (
                <p className="mt-3 mb-0">
                  <a
                    href={data.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:text-primary-dark hover:underline"
                  >
                    {data.website}
                  </a>
                </p>
              ) : null}
            </div>

          {data.bio ? (
            <div className="mt-6 border-t border-[#ececec] pt-6">
              <h2 className="m-0 text-lg font-bold text-primary-dark">About</h2>
              <p className="mt-3 mb-0 whitespace-pre-wrap leading-relaxed text-[#444]">{data.bio}</p>
            </div>
          ) : null}

          {data.researchInterests ? (
            <div className="mt-6 border-t border-[#ececec] pt-6">
              <h2 className="m-0 text-lg font-bold text-primary-dark">Research interests</h2>
              <p className="mt-3 mb-0 whitespace-pre-wrap leading-relaxed text-[#444]">{data.researchInterests}</p>
            </div>
          ) : null}

          {socialEntries.length > 0 ? (
            <div className="mt-6 border-t border-[#ececec] pt-6">
              <h2 className="m-0 text-lg font-bold text-primary-dark">Links</h2>
              <ul className="mt-3 mb-0 grid list-none gap-2 p-0 sm:grid-cols-2">
                {socialEntries.map((entry) => (
                  <li key={entry.label}>
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:text-primary-dark hover:underline"
                    >
                      {entry.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <ResearchPaperList papers={student.papers} title="Publications" />
      </div>
    </main>
  );
}
