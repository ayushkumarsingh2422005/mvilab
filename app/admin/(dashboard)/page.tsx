import Link from "next/link";
import { DashboardPageHeader, DashboardWorkspace } from "@/components/dashboard/DashboardPage";

export const metadata = {
  title: "Admin Dashboard — MVI Lab",
};

export default function AdminDashboardPage() {
  return (
    <>
      <DashboardPageHeader
        title="Dashboard"
        description="Manage students, content, and lab portal settings."
      />
      <DashboardWorkspace>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/admin/students"
            className="rounded-2xl border border-[#e0eaed] bg-white p-6 no-underline shadow-sm transition hover:border-primary/25 hover:shadow-md"
          >
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-primary">Accounts</p>
            <h2 className="mt-2 mb-0 text-lg font-bold text-primary-dark">Students</h2>
            <p className="mt-2 mb-0 text-sm leading-relaxed text-[#667]">
              Create student accounts, view IDs, and send welcome emails.
            </p>
          </Link>

          <Link
            href="/admin/admins"
            className="rounded-2xl border border-[#e0eaed] bg-white p-6 no-underline shadow-sm transition hover:border-primary/25 hover:shadow-md"
          >
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-primary">Access</p>
            <h2 className="mt-2 mb-0 text-lg font-bold text-primary-dark">Admins</h2>
            <p className="mt-2 mb-0 text-sm leading-relaxed text-[#667]">
              Invite new administrators to the admin portal.
            </p>
          </Link>

          <Link
            href="/admin/research-papers"
            className="rounded-2xl border border-[#e0eaed] bg-white p-6 no-underline shadow-sm transition hover:border-primary/25 hover:shadow-md"
          >
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-primary">Publications</p>
            <h2 className="mt-2 mb-0 text-lg font-bold text-primary-dark">Research papers</h2>
            <p className="mt-2 mb-0 text-sm leading-relaxed text-[#667]">
              Manage publications and assign student authors.
            </p>
          </Link>

          <Link
            href="/admin/assets"
            className="rounded-2xl border border-[#e0eaed] bg-white p-6 no-underline shadow-sm transition hover:border-primary/25 hover:shadow-md"
          >
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-primary">Media</p>
            <h2 className="mt-2 mb-0 text-lg font-bold text-primary-dark">Asset manager</h2>
            <p className="mt-2 mb-0 text-sm leading-relaxed text-[#667]">
              Browse uploads, copy paths, and manage custom folders.
            </p>
          </Link>

          <Link
            href="/admin/news"
            className="rounded-2xl border border-[#e0eaed] bg-white p-6 no-underline shadow-sm transition hover:border-primary/25 hover:shadow-md"
          >
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-primary">Content</p>
            <h2 className="mt-2 mb-0 text-lg font-bold text-primary-dark">News</h2>
            <p className="mt-2 mb-0 text-sm leading-relaxed text-[#667]">
              Publish news articles with slugs and full visual page layouts.
            </p>
          </Link>

          <Link
            href="/admin/gallery"
            className="rounded-2xl border border-[#e0eaed] bg-white p-6 no-underline shadow-sm transition hover:border-primary/25 hover:shadow-md"
          >
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-primary">Media</p>
            <h2 className="mt-2 mb-0 text-lg font-bold text-primary-dark">Gallery</h2>
            <p className="mt-2 mb-0 text-sm leading-relaxed text-[#667]">
              Create titled sections and upload multiple photos for the public gallery page.
            </p>
          </Link>

          <Link
            href="/admin/hero"
            className="rounded-2xl border border-[#e0eaed] bg-white p-6 no-underline shadow-sm transition hover:border-primary/25 hover:shadow-md"
          >
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-primary">Homepage</p>
            <h2 className="mt-2 mb-0 text-lg font-bold text-primary-dark">Hero banner</h2>
            <p className="mt-2 mb-0 text-sm leading-relaxed text-[#667]">
              Upload desktop and mobile carousel images for the homepage banner.
            </p>
          </Link>

          <Link
            href="/editor"
            className="rounded-2xl border border-[#e0eaed] bg-white p-6 no-underline shadow-sm transition hover:border-primary/25 hover:shadow-md"
          >
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-primary">Content</p>
            <h2 className="mt-2 mb-0 text-lg font-bold text-primary-dark">Page editor</h2>
            <p className="mt-2 mb-0 text-sm leading-relaxed text-[#667]">
              Open the visual builder to update site pages.
            </p>
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-[#e0eaed] bg-white p-6 no-underline shadow-sm transition hover:border-primary/25 hover:shadow-md"
          >
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-primary">Website</p>
            <h2 className="mt-2 mb-0 text-lg font-bold text-primary-dark">Public site</h2>
            <p className="mt-2 mb-0 text-sm leading-relaxed text-[#667]">
              Preview the live MVI Lab website in a new tab.
            </p>
          </a>
        </div>
      </DashboardWorkspace>
    </>
  );
}
