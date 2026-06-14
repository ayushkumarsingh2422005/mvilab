import { siteContainerClass } from "@/lib/site-container";

type SectionPageProps = {
  title: string;
};

export function SectionPage({ title }: SectionPageProps) {
  return (
    <main id="main-content" className="min-h-[50vh] py-10">
      <div className={siteContainerClass}>
        <h1 className="m-0 text-[2rem] text-primary">{title}</h1>
      </div>
    </main>
  );
}
