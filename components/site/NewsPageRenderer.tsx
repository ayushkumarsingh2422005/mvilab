"use client";

import type { ChaiBlock } from "@chaibuilder/sdk/types";
import "@chaibuilder/sdk/styles";
import { loadWebBlocks } from "@chaibuilder/sdk/web-blocks";
import dynamic from "next/dynamic";

loadWebBlocks();

const RenderChaiBlocks = dynamic(
  () => import("@chaibuilder/sdk/render").then((mod) => mod.RenderChaiBlocks),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-[#667]">Loading page…</div>
    ),
  },
);

type NewsPageRendererProps = {
  blocks: ChaiBlock[];
};

export function NewsPageRenderer({ blocks }: NewsPageRendererProps) {
  if (!blocks.length) {
    return (
      <div className="rounded-xl border border-dashed border-[#dce8eb] bg-[#f7fbfc] px-6 py-12 text-center text-sm text-[#667]">
        This news page has no content yet.
      </div>
    );
  }

  return (
    <div className="news-page-content">
      <RenderChaiBlocks blocks={blocks} />
    </div>
  );
}
