import Image from "next/image";

type NewsArticleThumbnailProps = {
  thumbnailUrl?: string;
  title: string;
  className?: string;
  sizes?: string;
};

export function NewsArticleThumbnail({
  thumbnailUrl,
  title,
  className = "w-full sm:w-56",
  sizes = "(max-width: 640px) 100vw, 224px",
}: NewsArticleThumbnailProps) {
  return (
    <div
      className={`relative aspect-video shrink-0 overflow-hidden rounded-xl border border-[#e0eaed] bg-[#f7fbfc] ${className}`}
    >
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt=""
          fill
          className="object-cover"
          sizes={sizes}
          unoptimized
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm font-medium text-[#667]">
          {title}
        </div>
      )}
    </div>
  );
}
