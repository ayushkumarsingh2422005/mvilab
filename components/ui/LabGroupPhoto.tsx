import Image from "next/image";
import { siteContainerClass } from "@/lib/site-container";

export function LabGroupPhoto() {
  return (
    <section className="bg-white py-8 sm:py-12" aria-label="MVI Lab community">
      <div className={`${siteContainerClass} flex justify-center`}>
        <Image
          src="/group%20photo.png"
          alt="Illustration of the MVI Lab community and team"
          width={1200}
          height={520}
          className="h-auto w-full max-w-5xl object-contain"
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
      </div>
    </section>
  );
}
