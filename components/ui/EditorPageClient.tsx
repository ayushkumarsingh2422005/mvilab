"use client";

import dynamic from "next/dynamic";

const PageEditor = dynamic(
  () => import("@/components/ui/Editor").then((mod) => mod.PageEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-dvh items-center justify-center text-sm text-[#666]">
        Loading editor…
      </div>
    ),
  },
);

export function EditorPageClient() {
  return (
    <div className="h-dvh w-full overflow-hidden">
      <PageEditor />
    </div>
  );
}
