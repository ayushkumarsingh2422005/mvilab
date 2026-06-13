"use client";

import Link from "next/link";
import { useState } from "react";
import { formatNoticeListDate, notices, type Notice } from "@/lib/notices";
import { siteContainerClass } from "@/lib/site-container";

function NewsListItem({ notice }: { notice: Notice }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="border-b border-[#e4e4e4] last:border-b-0">
      <div className="grid grid-cols-1 gap-3 py-5 sm:grid-cols-[7.5rem_1fr_auto] sm:items-start sm:gap-6 sm:py-6">
        <time
          dateTime={notice.date}
          className="pt-0.5 text-[0.9rem] tabular-nums tracking-wide text-[#666] sm:text-[0.95rem]"
        >
          {formatNoticeListDate(notice.date)}
        </time>

        <div className="min-w-0">
          <p className="m-0 text-[0.95rem] leading-relaxed text-[#333] sm:text-[1rem]">
            {notice.excerpt}
          </p>
          {open ? (
            <p className="mt-3 mb-0 text-[0.9rem] leading-relaxed text-[#555]">{notice.body}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <Link
              href={`/notices#${notice.id}`}
              className="inline-flex text-[0.85rem] font-medium text-primary hover:text-primary-dark hover:underline"
            >
              Read full notice
            </Link>
            <span className="inline-flex w-fit border border-primary/35 px-2.5 py-0.5 text-[0.72rem] font-semibold uppercase tracking-wide text-primary-dark">
              {notice.category}
            </span>
            {notice.isNew ? (
              <span className="inline-flex w-fit border border-primary bg-primary px-2.5 py-0.5 text-[0.72rem] font-semibold uppercase tracking-wide text-white">
                New
              </span>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center self-start border border-primary/25 bg-white text-[1.35rem] leading-none text-primary transition-colors hover:border-primary hover:bg-primary-light sm:mt-0.5"
          aria-expanded={open}
          aria-label={open ? "Collapse notice" : "Expand notice"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "−" : "+"}
        </button>
      </div>
    </li>
  );
}

export function LatestNews() {
  return (
    <section className="bg-[#f9f9f9] py-10 sm:py-14" aria-labelledby="latest-news-heading">
      <div className={siteContainerClass}>
        <div className="mb-8 border-b border-[#ececec] pb-6 text-center sm:mb-10">
          <p
            id="latest-news-heading"
            className="m-0 font-serif text-[1.05rem] italic text-primary sm:text-[1.15rem]"
          >
            — what&apos;s new
          </p>
          <p
            className="news-outline-title mx-auto mt-3 w-fit text-[clamp(2.25rem,5vw,3.75rem)] font-bold uppercase leading-none tracking-[0.14em]"
            aria-hidden="true"
          >
            NEWS
          </p>
        </div>

        <ul className="m-0 mx-auto max-w-4xl list-none p-0">
          {notices.map((notice) => (
            <NewsListItem key={notice.id} notice={notice} />
          ))}
        </ul>

        <div className="mx-auto mt-8 flex max-w-4xl justify-center sm:mt-10">
          <Link
            href="/notices"
            className="inline-flex items-center gap-1.5 text-[0.92rem] font-semibold text-primary transition-colors hover:text-primary-dark hover:underline"
          >
            View all notices
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
