import Image from "next/image";
import Link from "next/link";
import type { IconType } from "react-icons";
import { FaBookOpen, FaBuildingColumns } from "react-icons/fa6";
import { HiEnvelope, HiGlobeAlt } from "react-icons/hi2";
import { SiGooglescholar, SiOrcid, SiPublons } from "react-icons/si";
import {
  aboutFounder,
  aboutHero,
  aboutMission,
  aboutMilestones,
  aboutPillars,
  aboutQuote,
  aboutStats,
  aboutStory,
  aboutVision,
} from "@/lib/about-lab";
import { site, siteLinks } from "@/lib/content";
import { siteContainerClass } from "@/lib/site-container";

const founderLinkIcons: Record<(typeof aboutFounder.links)[number]["id"], IconType> = {
  "google-scholar": SiGooglescholar,
  website: HiGlobeAlt,
  publons: SiPublons,
  orcid: SiOrcid,
  vidwan: FaBookOpen,
  nitjsr: FaBuildingColumns,
};

function FounderProfileLinks() {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
      <a
        href={`mailto:${aboutFounder.email}`}
        aria-label={`Email ${aboutFounder.name}`}
        title={aboutFounder.email}
        className="grid size-10 place-items-center rounded-full border border-primary/15 bg-white text-primary transition hover:border-primary/35 hover:bg-primary-light hover:text-primary-dark"
      >
        <HiEnvelope className="size-[1.15rem]" aria-hidden />
      </a>
      {aboutFounder.links.map((link) => {
        const Icon = founderLinkIcons[link.id];
        return (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            title={link.label}
            className="grid size-10 place-items-center rounded-full border border-primary/15 bg-white text-primary transition hover:border-primary/35 hover:bg-primary-light hover:text-primary-dark"
          >
            <Icon className="size-[1.15rem]" aria-hidden />
          </a>
        );
      })}
    </div>
  );
}

function VisionGridBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -left-24 top-8 size-72 rounded-full bg-accent/25 blur-3xl" />
      <div className="absolute -right-16 bottom-0 size-96 rounded-full bg-white/10 blur-3xl" />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.14] [mask-image:linear-gradient(to_right,black_0%,black_35%,rgba(0,0,0,0.45)_65%,transparent_100%)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="about-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#about-grid)" />
      </svg>
    </div>
  );
}

function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-primary-dark via-primary to-secondary pb-14 text-white sm:pb-20">
      <VisionGridBackdrop />
      <div className={`${siteContainerClass} relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12 lg:py-24`}>
        <div>
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.22em] text-accent sm:text-sm">
            {aboutHero.eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-tight">
            {aboutHero.titleLine1}
            <span className="mt-1 block bg-linear-to-r from-white via-accent to-primary-light bg-clip-text text-transparent">
              {aboutHero.titleLine2}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">{aboutHero.lead}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/research"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-dark shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Explore our research
            </Link>
            <a
              href={siteLinks.nit}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              NIT Jamshedpur
            </a>
          </div>
        </div>

        <div className="mx-auto hidden shrink-0 lg:mx-0 lg:block">
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-white/10 blur-2xl" aria-hidden />
            <div className="relative size-72 overflow-hidden rounded-full border-[3px] border-white/25 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.25)] xl:size-80">
              <Image
                src="/MVI-logo.png"
                alt={`${site.shortName} logo`}
                width={320}
                height={320}
                className="size-full rounded-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      <svg
        className="absolute bottom-0 left-0 z-10 block h-20 w-full sm:h-28 lg:h-32"
        viewBox="0 0 1440 112"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path fill="#f9f9f9" d="M0,112 L0,72 L1440,0 L1440,112 Z" />
      </svg>
    </section>
  );
}

function AboutStory() {
  return (
    <section className="relative -mt-px bg-[#f9f9f9] py-14 sm:py-20" aria-labelledby="about-story-heading">
      <div className={`${siteContainerClass} grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]`}>
        <div>
          <p className="m-0 text-sm font-semibold uppercase tracking-widest text-primary">Our story</p>
          <h2
            id="about-story-heading"
            className="mt-3 mb-0 font-serif text-[clamp(1.85rem,4vw,2.75rem)] font-bold leading-tight text-primary-dark"
          >
            {aboutStory.heading}
          </h2>
          <div className="mt-6 space-y-4 text-[1rem] leading-relaxed text-[#555]">
            {aboutStory.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="m-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div
            className="absolute -inset-3 rounded-[2rem] bg-linear-to-br from-primary/20 via-accent/30 to-primary-light"
            style={{ transform: "rotate(-3deg)" }}
            aria-hidden
          />
          <div
            className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-[0_24px_60px_rgba(13,124,140,0.15)]"
            style={{ clipPath: "polygon(0 0, 100% 2%, 100% 100%, 0 98%)" }}
          >
            <Image
              src="/vector.png"
              alt="Illustration representing machine vision and intelligent systems"
              width={640}
              height={480}
              className="h-auto w-full object-contain p-6"
            />
          </div>
          <div className="absolute -bottom-5 -left-3 max-w-[220px] rounded-2xl bg-primary-dark px-5 py-4 text-white shadow-lg sm:-left-6">
            <p className="m-0 text-sm leading-snug font-medium">&ldquo;{aboutQuote.text}&rdquo;</p>
            <p className="mt-2 mb-0 text-xs uppercase tracking-wide text-accent">{aboutQuote.attribution}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutFounder() {
  return (
    <section className="bg-white py-14 sm:py-20" aria-labelledby="about-founder-heading">
      <div className={siteContainerClass}>
        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="relative mx-auto w-full max-w-sm lg:mx-0">
            <div
              className="absolute -inset-4 rounded-[2rem] bg-linear-to-br from-primary/15 to-accent/30"
              style={{ transform: "rotate(2deg)" }}
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-[1.75rem] bg-primary-light px-8 py-10 text-center shadow-[0_20px_50px_rgba(13,124,140,0.12)]">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[220px] overflow-hidden rounded-[1.25rem] border-4 border-white shadow-md sm:max-w-[260px]">
                <Image
                  src={aboutFounder.image}
                  alt={aboutFounder.imageAlt}
                  fill
                  loading="eager"
                  className="object-cover object-[center_15%]"
                  sizes="(max-width: 640px) 220px, 260px"
                />
              </div>
              <h2 id="about-founder-heading" className="mt-6 mb-0 font-serif text-2xl font-bold text-primary-dark">
                {aboutFounder.name}
              </h2>
              <p className="mt-2 mb-0 text-sm font-semibold text-primary">{aboutFounder.role}</p>
              <p className="mt-3 mb-0 text-sm leading-relaxed text-[#667]">{aboutFounder.department}</p>
              <p className="m-0 text-sm text-[#667]">{aboutFounder.affiliation}</p>
              <FounderProfileLinks />
            </div>
          </div>

          <div>
            <p className="m-0 text-sm font-semibold uppercase tracking-widest text-primary">Founder</p>
            <h3 className="mt-3 mb-0 font-serif text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight text-primary-dark">
              Leading vision with purpose
            </h3>
            <div className="mt-6 space-y-4 text-[1rem] leading-relaxed text-[#555]">
              {aboutFounder.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 28)} className="m-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutMissionVision() {
  return (
    <section className="py-14 sm:py-20" aria-label="Mission and vision">
      <div className={siteContainerClass}>
        <div className="relative grid gap-0 lg:grid-cols-2">
          <article className="relative z-10 overflow-hidden rounded-t-3xl bg-primary px-8 py-10 text-white lg:rounded-l-3xl lg:rounded-tr-none lg:py-14 lg:pl-12 lg:pr-16">
            <div className="absolute -right-8 -top-8 size-40 rounded-full bg-white/10 blur-2xl" aria-hidden />
            <p className="m-0 text-xs font-bold uppercase tracking-[0.2em] text-accent">{aboutMission.title}</p>
            <p className="relative mt-4 mb-0 max-w-md text-lg leading-relaxed sm:text-xl">{aboutMission.body}</p>
          </article>
          <article className="relative -mt-px overflow-hidden rounded-b-3xl bg-primary-light px-8 py-10 text-primary-dark lg:-ml-8 lg:mt-8 lg:rounded-r-3xl lg:rounded-bl-none lg:px-12 lg:py-14 lg:shadow-[0_20px_50px_rgba(13,124,140,0.12)]">
            <p className="m-0 text-xs font-bold uppercase tracking-[0.2em] text-primary">{aboutVision.title}</p>
            <p className="mt-4 mb-0 max-w-md text-lg leading-relaxed sm:text-xl">{aboutVision.body}</p>
          </article>
        </div>
      </div>
    </section>
  );
}

function AboutPillars() {
  return (
    <section className="bg-white py-14 sm:py-20" aria-labelledby="about-pillars-heading">
      <div className={siteContainerClass}>
        <div className="mb-10 max-w-2xl">
          <p className="m-0 text-sm font-semibold uppercase tracking-widest text-primary">How we work</p>
          <h2
            id="about-pillars-heading"
            className="mt-3 mb-0 font-serif text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-primary-dark"
          >
            Four lenses on intelligent vision
          </h2>
        </div>

        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:gap-6">
          {aboutPillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const layoutClass =
              index === 0
                ? "lg:col-span-2 lg:row-span-2"
                : index === 1
                  ? "lg:col-span-2 lg:row-span-1"
                  : index === 2
                    ? "lg:col-span-1 lg:row-span-1 lg:col-start-3 lg:row-start-2"
                    : "lg:col-span-1 lg:row-span-1 lg:col-start-4 lg:row-start-2";

            return (
              <li key={pillar.id} className={layoutClass}>
                <article
                  className={`group relative flex h-full min-h-[180px] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-linear-to-br ${pillar.accent} p-6 sm:p-8`}
                >
                  <div
                    className="absolute -right-6 -top-6 size-28 rounded-full bg-primary/10 transition duration-500 group-hover:scale-125"
                    aria-hidden
                  />
                  <div className="relative text-primary">
                    <Icon className="size-9 sm:size-10" aria-hidden />
                  </div>
                  <div className="relative mt-8">
                    <h3 className="m-0 text-xl font-bold text-primary-dark sm:text-2xl">{pillar.title}</h3>
                    <p className="mt-3 mb-0 text-sm leading-relaxed text-[#555] sm:text-base">{pillar.description}</p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function AboutTimeline() {
  return (
    <section className="overflow-hidden bg-[#f7fbfc] py-14 sm:py-20" aria-labelledby="about-journey-heading">
      <div className={siteContainerClass}>
        <h2 id="about-journey-heading" className="m-0 font-serif text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-primary-dark">
          Our journey
        </h2>
        <p className="mt-3 mb-0 max-w-xl text-[#667]">Milestones that shaped the lab — and where we are headed next.</p>

        <ol className="relative m-0 mt-12 list-none p-0">
          <div
            className="absolute left-4 top-0 hidden h-full w-px bg-linear-to-b from-primary via-accent to-primary-light sm:left-1/2 sm:block sm:-translate-x-1/2"
            aria-hidden
          />
          {aboutMilestones.map((item, index) => {
            const isLeft = index % 2 === 0;

            return (
              <li
                key={item.title}
                className={`relative mb-10 grid sm:grid-cols-2 sm:gap-10 ${index === aboutMilestones.length - 1 ? "mb-0" : ""}`}
              >
                <div className={`${isLeft ? "sm:pr-12 sm:text-right" : "sm:col-start-2 sm:pl-12"} pl-12 sm:pl-0`}>
                  <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    {item.year}
                  </span>
                  <h3 className="mt-3 mb-0 text-lg font-bold text-primary-dark">{item.title}</h3>
                  <p className="mt-2 mb-0 text-sm leading-relaxed text-[#555]">{item.detail}</p>
                </div>
                <span
                  className="absolute left-2.5 top-2 size-3 rounded-full border-2 border-white bg-primary shadow sm:left-1/2 sm:-translate-x-1/2"
                  aria-hidden
                />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function AboutStatsRibbon() {
  return (
    <section className="relative overflow-hidden bg-primary-dark py-12 text-white sm:py-16" aria-label="Lab highlights">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(168,220,230,0.15),transparent_50%),radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.08),transparent_45%)]" aria-hidden />
      <div className={`${siteContainerClass} relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4`}>
        {aboutStats.map((stat) => (
          <div key={stat.label} className="text-center sm:text-left">
            <p className="m-0 font-serif text-[clamp(2rem,4vw,2.75rem)] font-bold leading-none text-accent">
              {stat.value}
            </p>
            <p className="mt-2 mb-0 text-sm uppercase tracking-widest text-white/75">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutCommunity() {
  return (
    <section className="pb-16 pt-14 sm:pb-24 sm:pt-20" aria-label="Lab community">
      <div className={siteContainerClass}>
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="m-0 text-sm font-semibold uppercase tracking-widest text-primary">Community</p>
            <h2 className="mt-3 mb-0 font-serif text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-primary-dark">
              People who make {site.shortName} home
            </h2>
            <p className="mt-4 mb-0 max-w-md leading-relaxed text-[#555]">
              Students, researchers, and mentors — collaborating in a shared space where questions are encouraged and
              breakthroughs are celebrated together.
            </p>
            <Link
              href="/member"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark hover:underline"
            >
              View member profiles
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="relative">
            <div
              className="overflow-hidden rounded-[2rem] shadow-[0_20px_50px_rgba(13,124,140,0.18)]"
              style={{ clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0 100%)" }}
            >
              <Image
                src="/group%20photo.png"
                alt="MVI Lab team and community illustration"
                width={1200}
                height={520}
                className="h-auto w-full object-contain bg-primary-light/30"
                sizes="(max-width: 1024px) 100vw, 640px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutLabPage() {
  return (
    <main id="main-content">
      <AboutHero />
      <AboutStory />
      <AboutFounder />
      <AboutMissionVision />
      <AboutPillars />
      <AboutTimeline />
      <AboutStatsRibbon />
      <AboutCommunity />
    </main>
  );
}
