import Image from "next/image";
import { welcomeSection } from "@/lib/content";
import { siteContainerClass } from "@/lib/site-container";

export function WelcomeSection() {
  return (
    <section className="border-b border-[#ececec] bg-white py-10 sm:py-12" aria-labelledby="welcome-heading">
      <div className={`${siteContainerClass} grid items-center gap-8 lg:grid-cols-[minmax(260px,420px)_1fr] lg:gap-12`}>
        <div className="flex justify-center lg:justify-start">
          <Image
            src="/vector.png"
            alt=""
            width={640}
            height={480}
            className="h-auto w-full max-w-[420px] object-contain"
            priority
          />
        </div>

        <div>
          <h1
            id="welcome-heading"
            className="m-0 mb-4 font-serif text-[clamp(1.85rem,4vw,2.75rem)] font-bold leading-tight text-primary"
          >
            {welcomeSection.heading}
          </h1>
          <p className="m-0 mb-4 text-[1.15rem] font-medium text-primary-dark sm:text-[1.25rem]">
            {welcomeSection.lead}
          </p>
          <p className="m-0 max-w-2xl text-[1rem] leading-relaxed text-[#555] sm:text-[1.05rem]">
            {welcomeSection.body}
          </p>
        </div>
      </div>
    </section>
  );
}
