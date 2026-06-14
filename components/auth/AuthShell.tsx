import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/content";
import { siteContainerClass } from "@/lib/site-container";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
};

export function AuthShell({
  title,
  subtitle,
  children,
  backHref = "/",
  backLabel = "Back to site",
}: AuthShellProps) {
  return (
    <div className="min-h-dvh bg-linear-to-b from-primary-light/70 to-[#f9f9f9] py-10">
      <div className={`${siteContainerClass} max-w-md`}>
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-3 no-underline">
            <Image src="/MVI-logo.png" alt="" width={72} height={72} className="rounded-full" />
            <span className="font-serif text-lg font-bold text-primary">{site.shortName}</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-[#e6eef0] bg-white p-6 shadow-[0_10px_30px_rgba(13,124,140,0.08)] sm:p-8">
          <div className="mb-6">
            <h1 className="m-0 text-xl font-bold text-primary-dark">{title}</h1>
            <p className="mt-2 mb-0 text-sm leading-relaxed text-[#666]">{subtitle}</p>
          </div>
          {children}
        </div>

        <p className="mt-6 text-center text-sm">
          <Link href={backHref} className="font-medium text-primary hover:text-primary-dark hover:underline">
            {backLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
