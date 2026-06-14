import { notFound } from "next/navigation";
import { NewsArticleThumbnail } from "@/components/site/NewsArticleThumbnail";
import { NewsPageRenderer } from "@/components/site/NewsPageRenderer";
import { formatNewsDate, getPublishedNewsArticleBySlug } from "@/lib/news";
import { siteContainerClass } from "@/lib/site-container";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getPublishedNewsArticleBySlug(slug);

  if (!article) {
    return { title: "News — MVI Lab" };
  }

  return {
    title: `${article.title} — MVI Lab`,
    description: article.excerpt,
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getPublishedNewsArticleBySlug(slug);

  if (!article) notFound();

  return (
    <main id="main-content" className="py-10">
      <div className={siteContainerClass}>
        <header className="mb-8 max-w-4xl">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <time dateTime={article.publishedAt} className="text-sm font-medium text-[#777]">
              {formatNewsDate(article.publishedAt)}
            </time>
            <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary-dark">
              {article.category}
            </span>
            {article.isNew ? (
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-white">New</span>
            ) : null}
          </div>
          <h1 className="m-0 text-[2rem] font-bold text-primary-dark">{article.title}</h1>
          <p className="mt-3 mb-0 max-w-3xl text-base leading-relaxed text-[#555]">{article.excerpt}</p>
        </header>

        {article.thumbnailUrl ? (
          <div className="mb-8 max-w-4xl">
            <NewsArticleThumbnail
              thumbnailUrl={article.thumbnailUrl}
              title={article.title}
              className="w-full"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        ) : null}

        <NewsPageRenderer blocks={article.blocks} />
      </div>
    </main>
  );
}
