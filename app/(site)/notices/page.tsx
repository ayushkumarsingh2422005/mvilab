import { formatNoticeDate, notices } from "@/lib/notices";
import { siteContainerClass } from "@/lib/site-container";

export const metadata = {
  title: "Notices — MVI Lab",
  description: "Recent notices and updates from Machine Vision and Intelligence Lab",
};

export default function NoticesPage() {
  return (
    <main id="main-content" className="min-h-[60vh] py-10">
      <div className={siteContainerClass}>
        <h1 className="mb-8 text-[2rem] text-primary">Notices & Updates</h1>

        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {notices.map((notice) => (
            <li
              key={notice.id}
              id={notice.id}
              className="scroll-mt-24 rounded-xl border border-[#e8e8e8] bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-[0.82rem] font-medium text-[#777]">
                  {formatNoticeDate(notice.date)}
                </span>
                <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-[0.75rem] font-semibold text-primary-dark">
                  {notice.category}
                </span>
                {notice.isNew ? (
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-[0.75rem] font-semibold text-white">
                    New
                  </span>
                ) : null}
              </div>
              <h2 className="m-0 text-[1.15rem] font-semibold text-[#222]">{notice.title}</h2>
              <p className="mt-2 mb-0 text-[0.95rem] leading-relaxed text-[#555]">{notice.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
