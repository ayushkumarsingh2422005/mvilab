import Link from "next/link";
import { RiMegaphoneLine } from "react-icons/ri";
import { getTickerNewsArticles, type NewsArticleListItem } from "@/lib/news";

type NewsTickerProps = {
  articles: NewsArticleListItem[];
};

export function NewsTicker({ articles }: NewsTickerProps) {
  const items = getTickerNewsArticles(articles);
  const tickerText =
    items.length > 0
      ? items.map((article) => article.excerpt).join("   •   ")
      : "Latest lab news and updates will be published here shortly.";
  const scrollText = `${tickerText}   •   ${tickerText}`;

  return (
    <section className="news-ticker" aria-label="Latest announcements">
      <div className="ticker-label">
        <RiMegaphoneLine className="ticker-icon" aria-hidden="true" />
        <span className="ticker-label-text">Updates</span>
      </div>
      <div className="ticker-track">
        <div className="ticker-scroll" aria-live="polite">
          <p className="ticker-content">
            <Link href="/news">{scrollText}</Link>
          </p>
          <p className="ticker-content" aria-hidden="true">
            <Link href="/news" tabIndex={-1}>
              {scrollText}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
