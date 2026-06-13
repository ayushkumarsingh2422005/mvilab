import Link from "next/link";
import { siteContainerClass } from "@/lib/site-container";

type SectionPageProps = {
  title: string;
  description: string;
};

export function SectionPage({ title, description }: SectionPageProps) {
  return (
    <main id="main-content" className="min-h-[50vh] py-10">
      <div className={siteContainerClass}>
        <Link href="/" className="text-[0.9rem] font-medium text-primary hover:text-primary-dark hover:underline">
          ← Back to home
        </Link>
        <h1 className="mt-4 mb-3 text-[2rem] text-primary">{title}</h1>
        <p className="m-0 max-w-2xl text-[1rem] leading-relaxed text-[#555]">{description}</p>
      </div>
    </main>
  );
}
