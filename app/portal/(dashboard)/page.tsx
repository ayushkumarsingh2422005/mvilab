import Link from "next/link";
import { DashboardPageHeader, DashboardWorkspace } from "@/components/dashboard/DashboardPage";
import { getValidSession } from "@/lib/auth/session";

export const metadata = {
  title: "Student Portal — MVI Lab",
};

export default async function StudentPortalPage() {
  const session = await getValidSession();

  return (
    <>
      <DashboardPageHeader
        title={`Welcome${session?.name ? `, ${session.name}` : ""}`}
        description="Your MVI Lab student portal workspace."
      />
      <DashboardWorkspace>
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-[#e0eaed] bg-white p-6 shadow-sm">
            <h2 className="m-0 text-lg font-bold text-primary-dark">Your details</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-medium text-[#667]">Student ID</dt>
                <dd className="mt-1 text-base font-semibold tracking-wide text-primary-dark">
                  {session?.studentId ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-[#667]">Email</dt>
                <dd className="mt-1">{session?.email}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-[#e0eaed] bg-white p-6 shadow-sm">
            <h2 className="m-0 text-lg font-bold text-primary-dark">Quick access</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/portal/papers" className="font-medium text-primary hover:text-primary-dark hover:underline">
                  View your research papers
                </Link>
              </li>
              <li>
                <Link href="/portal/profile" className="font-medium text-primary hover:text-primary-dark hover:underline">
                  Edit your profile
                </Link>
              </li>
              <li>
                <Link href="/notices" className="font-medium text-primary hover:text-primary-dark hover:underline">
                  View lab notices
                </Link>
              </li>
              <li>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:text-primary-dark hover:underline"
                >
                  Open public website
                </a>
              </li>
            </ul>
          </section>
        </div>
      </DashboardWorkspace>
    </>
  );
}
