import Link from "next/link";
import { formatNewsDate, getPublishedNewsArticles } from "@/lib/news";
import { siteContainerClass } from "@/lib/site-container";

export const metadata = {
  title: "News — MVI Lab",
  description: "Recent news and updates from Machine Vision and Intelligence Lab",
};

export default async function NewsPage() {
  const articles = await getPublishedNewsArticles();

  return (
    <main id="main-content" className="min-h-[60vh] py-10">
      <div className={siteContainerClass}>
        <h1 className="mb-8 text-[2rem] text-primary">News</h1>

        {articles.length === 0 ? (
          <p className="text-[#667]">News articles will appear here once they are published.</p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {articles.map((article) => (
              <li
                key={article.id}
                className="rounded-xl border border-[#e8e8e8] bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-[0.82rem] font-medium text-[#777]">
                    {formatNewsDate(article.publishedAt)}
                  </span>
                  <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-[0.75rem] font-semibold text-primary-dark">
                    {article.category}
                  </span>
                  {article.isNew ? (
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-[0.75rem] font-semibold text-white">
                      New
                    </span>
                  ) : null}
                </div>
                <h2 className="m-0 text-[1.15rem] font-semibold text-[#222]">
                  <Link href={`/news/${article.slug}`} className="text-inherit no-underline hover:text-primary hover:underline">
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-2 mb-3 text-[0.95rem] leading-relaxed text-[#555]">{article.excerpt}</p>
                <Link
                  href={`/news/${article.slug}`}
                  className="text-sm font-semibold text-primary hover:text-primary-dark hover:underline"
                >
                  Read full article →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
