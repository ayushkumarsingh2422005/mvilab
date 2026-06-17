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
          <ul className="mt-8 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {students.map((student) => (
              <li key={student.id}>
                <Link
                  href={`/student/${student.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e0eaed] bg-white no-underline shadow-sm transition hover:border-primary/30 hover:shadow-md"
                >
                  <div className="relative aspect-square w-full overflow-hidden border-b border-[#e8eef0] bg-[#f7fbfc]">
                    {student.avatarUrl ? (
                      <Image
                        src={student.avatarUrl}
                        alt={student.name}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary-light text-5xl font-bold text-primary">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="m-0 text-lg font-bold text-primary-dark">{student.name}</h2>
                    {formatProfileSubtitle(student.designation, student.department) ? (
                      <p className="mt-1.5 mb-0 text-sm text-[#667]">
                        {formatProfileSubtitle(student.designation, student.department)}
                      </p>
                    ) : null}
                    {student.researchInterests ? (
                      <p className="mt-3 mb-0 line-clamp-3 flex-1 text-sm leading-relaxed text-[#555]">
                        {student.researchInterests}
                      </p>
                    ) : (
                      <div className="flex-1" />
                    )}
                    <span className="mt-4 text-sm font-semibold text-primary">View profile →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
