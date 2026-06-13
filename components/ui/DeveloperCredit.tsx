import Image from "next/image";
import { siteLinks } from "@/lib/content";

type DeveloperCreditProps = {
  className?: string;
  logoSize?: number;
};

export function DeveloperCredit({ className = "", logoSize = 24 }: DeveloperCreditProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[0.85rem] leading-none text-[#666] ${className}`}
    >
      Developed by{" "}
      <a
        href={siteLinks.digicraft}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 align-middle font-semibold leading-none text-primary-dark no-underline hover:underline"
      >
        <Image
          src={siteLinks.digicraftLogo}
          alt=""
          width={logoSize}
          height={logoSize}
          className="block shrink-0 rounded-full object-cover"
          style={{ width: logoSize, height: logoSize }}
        />
        DigiCraft
      </a>
    </span>
  );
}
