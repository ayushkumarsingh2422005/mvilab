import Image from "next/image";
import Link from "next/link";
import { formatProfileSubtitle } from "@/lib/student-designations";
import type { PublicStudentListItem } from "@/lib/public-students";
import { siteContainerClass } from "@/lib/site-container";

type MemberDirectoryProps = {
  students: PublicStudentListItem[];
};

export function MemberDirectory({ students }: MemberDirectoryProps) {
  return (
    <main id="main-content" className="min-h-[50vh] py-10">
      <div className={siteContainerClass}>
        <h1 className="mb-8 text-[2rem] text-primary">Member</h1>

        {students.length === 0 ? (
          <p className="mt-8 text-[#667]">Member profiles will appear here once students are added.</p>
        ) : (
          <ul className="mt-8 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => (
              <li key={student.id}>
                <Link
                  href={`/student/${student.slug}`}
                  className="flex h-full flex-col rounded-2xl border border-[#e0eaed] bg-white p-5 no-underline shadow-sm transition hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#e0eaed] bg-[#f7fbfc]">
                      {student.avatarUrl ? (
                        <Image src={student.avatarUrl} alt="" fill className="object-cover" sizes="64px" unoptimized />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl font-bold text-primary">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="m-0 text-lg font-bold text-primary-dark">{student.name}</h2>
                      {formatProfileSubtitle(student.designation, student.department) ? (
                        <p className="mt-1 mb-0 text-sm text-[#667]">
                          {formatProfileSubtitle(student.designation, student.department)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  {student.researchInterests ? (
                    <p className="mt-4 mb-0 line-clamp-3 text-sm leading-relaxed text-[#555]">{student.researchInterests}</p>
                  ) : null}
                  <span className="mt-4 text-sm font-semibold text-primary">View profile →</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
