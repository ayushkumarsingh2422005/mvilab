import Image from "next/image";
import Link from "next/link";
import { DeveloperCredit } from "./DeveloperCredit";
import {
  footerContact,
  navLinks,
  site,
  siteLinks,
} from "@/lib/content";
import { siteContainerClass } from "@/lib/site-container";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.8 19.8 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0122 16.92z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 6l-10 7L2 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="relative m-0 mb-4 text-[0.95rem] font-semibold tracking-wide text-white after:mt-2 after:block after:h-0.5 after:w-8 after:rounded-full after:bg-primary-light/70 after:content-['']">
      {children}
    </h2>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-primary-light/20 bg-primary-dark text-primary-light">
      <div className={`${siteContainerClass} grid gap-10 py-10 md:grid-cols-2 md:py-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:gap-12`}>
        <div className="flex gap-4 md:col-span-2 lg:col-span-1">
          <Link
            href="/"
            className="grid size-[72px] shrink-0 place-items-center rounded-full border-[3px] border-white/20 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
            aria-label="Home — MVI Lab"
          >
            <Image
              src="/MVI-logo.png"
              alt=""
              width={58}
              height={58}
              className="size-[58px] rounded-full object-contain"
              loading="lazy"
            />
          </Link>
          <div className="min-w-0 pt-1">
            <p className="m-0 font-serif text-[1.15rem] font-bold leading-tight text-white">
              {site.shortName}
            </p>
            <p className="mt-1 mb-0 text-[0.88rem] font-medium leading-snug text-white/90">
              {site.title}
            </p>
            <p className="mt-3 mb-0 max-w-sm text-[0.88rem] leading-relaxed text-primary-light/90">
              {site.subtitle}. Advancing machine vision, intelligence systems, and applied
              research at NIT Jamshedpur.
            </p>
            <a
              href={siteLinks.official}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex text-[0.85rem] font-medium text-primary-light transition-colors hover:text-white hover:underline"
            >
              {siteLinks.official.replace("https://", "")}
            </a>
          </div>
        </div>

        <nav aria-label="Footer navigation">
          <FooterHeading>Quick Links</FooterHeading>
          <ul className="m-0 grid list-none gap-2.5 p-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[0.9rem] text-primary-light/95 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <FooterHeading>Get in Touch</FooterHeading>
          <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
            <li>
              <a
                href={footerContact.phoneHref}
                className="group inline-flex items-start gap-3 text-[0.9rem] text-primary-light/95 transition-colors hover:text-white"
              >
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-primary-light transition-colors group-hover:bg-white/20 group-hover:text-white">
                  <PhoneIcon className="size-4" />
                </span>
                <span className="pt-1.5 leading-snug">{footerContact.phone}</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${footerContact.email}`}
                className="group inline-flex items-start gap-3 text-[0.9rem] text-primary-light/95 transition-colors hover:text-white"
              >
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-primary-light transition-colors group-hover:bg-white/20 group-hover:text-white">
                  <MailIcon className="size-4" />
                </span>
                <span className="break-all pt-1.5 leading-snug">{footerContact.email}</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <FooterHeading>Address</FooterHeading>
          <a
            href={footerContact.mapHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-start gap-3 text-[0.9rem] leading-relaxed text-primary-light/95 transition-colors hover:text-white"
          >
            <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-primary-light transition-colors group-hover:bg-white/20 group-hover:text-white">
              <MapPinIcon className="size-4" />
            </span>
            <span className="pt-1.5">
              {footerContact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="mt-1.5 block text-[0.82rem] font-medium text-primary-light/90 group-hover:text-white group-hover:underline">
                View on map
              </span>
            </span>
          </a>
        </div>
      </div>

      <div className="border-t border-white/15 bg-black/10">
        <div
          className={`${siteContainerClass} flex flex-wrap items-center justify-between gap-3 py-4 text-[0.82rem] text-primary-light/80`}
        >
          <p className="m-0">
            © {year} {site.shortName}, NIT Jamshedpur. All rights reserved.
          </p>
          <DeveloperCredit
            className="m-0 text-primary-light/85 [&_a]:text-primary-light [&_a:hover]:text-white [&_a:hover]:no-underline"
            logoSize={18}
          />
        </div>
      </div>
    </footer>
  );
}
