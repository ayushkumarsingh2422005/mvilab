import Link from "next/link";
import { RiMegaphoneLine } from "react-icons/ri";
import { getTickerNotices, type Notice } from "@/lib/notices";

type NewsTickerProps = {
  notices?: Notice[];
};

export function NewsTicker({ notices }: NewsTickerProps) {
  const items = getTickerNotices(notices);
  const tickerText =
    items.length > 0
      ? items.map((notice) => notice.excerpt).join("   •   ")
      : "Latest lab notices and updates will be published here shortly.";
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
            <Link href="/notices">{scrollText}</Link>
          </p>
          <p className="ticker-content" aria-hidden="true">
            <Link href="/notices" tabIndex={-1}>
              {scrollText}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
