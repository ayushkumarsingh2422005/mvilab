import Link from "next/link";
import { NewsArticleThumbnail } from "@/components/site/NewsArticleThumbnail";
import { formatNewsListDate, type NewsArticleListItem } from "@/lib/news";
import { siteContainerClass } from "@/lib/site-container";

function NewsListItem({ article }: { article: NewsArticleListItem }) {
  return (
    <li className="border-b border-[#e4e4e4] last:border-b-0">
      <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-start sm:py-6">
        <Link
          href={`/news/${article.slug}`}
          className="block shrink-0 sm:w-48"
          aria-label={`Read ${article.title}`}
        >
          <NewsArticleThumbnail
            thumbnailUrl={article.thumbnailUrl}
            title={article.title}
            className="w-full"
            sizes="(max-width: 640px) 100vw, 192px"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <time
            dateTime={article.publishedAt}
            className="block text-[0.9rem] tabular-nums tracking-wide text-[#666] sm:text-[0.95rem]"
          >
            {formatNewsListDate(article.publishedAt)}
          </time>

          <p className="mt-2 mb-0 text-[0.95rem] leading-relaxed text-[#333] sm:text-[1rem]">
            {article.excerpt}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <Link
              href={`/news/${article.slug}`}
              className="inline-flex text-[0.85rem] font-medium text-primary hover:text-primary-dark hover:underline"
            >
              Read full article
            </Link>
            <span className="inline-flex w-fit border border-primary/35 px-2.5 py-0.5 text-[0.72rem] font-semibold uppercase tracking-wide text-primary-dark">
              {article.category}
            </span>
            {article.isNew ? (
              <span className="inline-flex w-fit border border-primary bg-primary px-2.5 py-0.5 text-[0.72rem] font-semibold uppercase tracking-wide text-white">
                New
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}

type LatestNewsProps = {
  articles: NewsArticleListItem[];
};

export function LatestNews({ articles }: LatestNewsProps) {
  return (
    <section className="bg-[#f9f9f9] py-10 sm:py-14" aria-labelledby="latest-news-heading">
      <div className={siteContainerClass}>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-b border-[#ececec] pb-6 sm:mb-10">
          <p
            id="latest-news-heading"
            className="m-0 font-serif text-[1.05rem] italic text-primary sm:text-[1.15rem]"
          >
            — what&apos;s new
          </p>
          <p
            className="news-outline-title text-[clamp(2.25rem,5vw,3.75rem)] font-bold uppercase leading-none tracking-[0.14em]"
            aria-hidden="true"
          >
            NEWS
          </p>
        </div>

        <ul className="m-0 mx-auto max-w-4xl list-none p-0">
          {articles.map((article) => (
            <NewsListItem key={article.id} article={article} />
          ))}
        </ul>

        <div className="mx-auto mt-8 flex max-w-4xl justify-center sm:mt-10">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-[0.92rem] font-semibold text-primary transition-colors hover:text-primary-dark hover:underline"
          >
            View all news
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
