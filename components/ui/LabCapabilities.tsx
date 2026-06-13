import { labCapabilities, labCapabilitiesSection } from "@/lib/lab-capabilities";
import { siteContainerClass } from "@/lib/site-container";

function CapabilityCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: (typeof labCapabilities)[number]["icon"];
}) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-[#e8ecec] bg-primary-light/35 p-6 transition-[box-shadow,border-color] duration-300 hover:border-primary/15 hover:shadow-[0_8px_24px_rgba(13,124,140,0.12)] sm:p-8">
      <div className="mb-5 text-primary">
        <Icon className="size-10" aria-hidden="true" />
      </div>
      <h3 className="m-0 mb-3 text-xl font-bold text-[#222]">{title}</h3>
      <p className="m-0 text-sm leading-relaxed text-[#555]">{description}</p>
    </article>
  );
}

export function LabCapabilities() {
  const [first, second, third, fourth, fifth, sixth] = labCapabilities;

  return (
    <section className="bg-white py-10 sm:py-12" aria-labelledby="lab-capabilities-heading">
      <div className={siteContainerClass}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="mb-2 flex flex-col justify-center md:col-span-2 md:mb-0 md:pr-8">
            <h2
              id="lab-capabilities-heading"
              className="m-0 mb-4 text-[clamp(1.85rem,4vw,2.75rem)] font-bold tracking-tight text-[#222]"
            >
              {labCapabilitiesSection.title.split(" ").slice(0, 2).join(" ")}
              <br className="hidden md:block" />
              {labCapabilitiesSection.title.split(" ").slice(2).join(" ")}
            </h2>
            <p className="m-0 text-lg font-light text-[#666] sm:text-xl">
              {labCapabilitiesSection.subtitle}
            </p>
          </div>

          <CapabilityCard {...first} />

          <div className="hidden md:col-span-1 md:block" aria-hidden="true" />

          <CapabilityCard {...second} />
          <CapabilityCard {...third} />

          <CapabilityCard {...fourth} />
          <CapabilityCard {...fifth} />
          <CapabilityCard {...sixth} />
        </div>
      </div>
    </section>
  );
}
