import Image from "next/image";
import Link from "next/link";
import { DeveloperCredit } from "./DeveloperCredit";
import { FontSizeControls } from "./FontSizeControls";
import { SiteNav } from "./SiteNav";
import { site, siteLinks, studentPortalPath } from "@/lib/content";
import { siteContainerClass } from "@/lib/site-container";

export function SiteHeader() {
  return (
    <header className="bg-white shadow-[0_1px_0_#e0e0e0]">
      <div className="border-b border-[#e8e8e8] bg-white text-[0.82rem] leading-tight max-sm:text-xs">
        <div className={`${siteContainerClass} flex min-h-7 flex-nowrap items-center justify-between gap-2.5 py-[5px] max-lg:min-h-[26px] max-lg:flex-wrap max-lg:gap-2 max-lg:py-1`}>
          <a
            href={siteLinks.official}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 cursor-pointer items-center font-semibold leading-none !text-[#1565c0] no-underline transition-colors hover:!text-[#0d47a1] max-lg:min-w-0 max-lg:flex-[0_1_auto] max-lg:text-[0.78rem] max-sm:text-xs"
          >
            MVI Lab Portal
          </a>

          <div className="ml-auto flex shrink-0 flex-nowrap items-center gap-2 leading-none max-lg:justify-end max-lg:gap-1.5 [&_a]:font-medium [&_a]:whitespace-nowrap [&_a]:text-primary-dark [&_a:hover]:underline">
            <DeveloperCredit
              className="m-0 whitespace-nowrap text-inherit max-lg:text-[0.78rem]"
              logoSize={20}
            />
            <span className="h-4 w-px shrink-0 bg-[#c5c5c5]" aria-hidden="true" />
            <FontSizeControls />
          </div>
        </div>
      </div>

      <div className="relative [--emblem-size:136px] [--emblem-spacer:142px] [--nav-height:48px] max-lg:[--emblem-size:112px] max-lg:[--emblem-spacer:120px] max-lg:[--nav-height:44px] max-sm:[--nav-height:40px]">
        <div className="relative z-[1] bg-white py-3 max-lg:pb-[18px] max-lg:pt-2.5">
          <div className={`${siteContainerClass} flex flex-wrap items-center justify-start gap-5 max-lg:flex-nowrap max-lg:items-start max-lg:gap-2.5`}>
            <div
              className="min-h-px w-[var(--emblem-spacer)] shrink-0 grow-0 basis-[var(--emblem-spacer)]"
              aria-hidden="true"
            />

            <div className="min-w-0 flex-[1_1_220px] max-lg:flex-1 max-lg:pt-1.5">
              <p className="m-0 hidden font-serif text-[clamp(1rem,2.2vw,1.35rem)] font-bold leading-tight text-primary lg:block">
                {site.title}
              </p>
              <p className="m-0 font-serif text-[1.1rem] font-bold leading-tight text-primary max-sm:text-[0.95rem] lg:hidden">
                {site.shortName}
              </p>
              <p className="mt-1 mb-0 hidden text-[0.92rem] font-medium text-[#222] lg:block">
                {site.subtitle}
              </p>
              <p className="mt-1 mb-0 text-[0.85rem] font-medium text-[#222] max-sm:text-[0.78rem] lg:hidden">
                {site.shortSubtitle}
              </p>
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-3.5 max-lg:hidden">
              <div className="flex items-center gap-2.5">
                <span
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-white"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-wide text-[#777]">
                    Contact
                  </span>
                  <a
                    href={`mailto:${site.contact}`}
                    className="break-all text-[0.92rem] font-bold tracking-wide !text-primary-dark hover:underline"
                  >
                    {site.contact}
                  </a>
                </div>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-blue px-[26px] py-2.5 text-[0.9rem] font-semibold text-white transition-[filter,transform] duration-150 hover:-translate-y-px hover:brightness-105"
              >
                Services
              </Link>
              <Link
                href={studentPortalPath}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-primary px-[26px] py-2.5 text-[0.9rem] font-semibold text-white transition-[filter,transform] duration-150 hover:-translate-y-px hover:brightness-105"
              >
                Portal
              </Link>
            </div>
          </div>
        </div>

        <div className={`${siteContainerClass} pointer-events-none absolute bottom-[var(--nav-height)] left-1/2 z-[200] h-0 -translate-x-1/2`}>
          <Link
            href="/"
            className="pointer-events-auto absolute bottom-0 left-0 translate-y-1/2 leading-none"
            aria-label="Home — MVI Lab"
          >
            <span className="grid size-[var(--emblem-size)] place-items-center rounded-full border-[5px] border-white bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_6px_20px_rgba(0,0,0,0.22)] max-lg:border-4">
              <Image
                src="/MVI-logo.png"
                alt=""
                width={126}
                height={126}
                className="!size-[126px] rounded-full object-contain max-lg:!size-[102px]"
                priority
              />
            </span>
          </Link>
        </div>

        <SiteNav />
      </div>
    </header>
  );
}
