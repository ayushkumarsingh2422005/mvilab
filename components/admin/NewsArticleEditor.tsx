"use client";

import type { ChaiBlock } from "@chaibuilder/sdk/types";
import { ChaiBuilderEditor } from "@chaibuilder/sdk";
import { loadWebBlocks } from "@chaibuilder/sdk/web-blocks";
import "@/lib/chaibuilder/setup";
import { useChaiBuilderEditorStyles } from "@/lib/chaibuilder/use-chaibuilder-editor-styles";
import { useEffect, useState } from "react";
import { HiOutlineArrowLeft, HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";

loadWebBlocks();

type NewsArticleEditorProps = {
  articleId: string;
  title: string;
  slug: string;
  initialBlocks: ChaiBlock[];
  isPublished: boolean;
};

export function NewsArticleEditor({
  articleId,
  title,
  slug,
  initialBlocks,
  isPublished,
}: NewsArticleEditorProps) {
  useChaiBuilderEditorStyles();
  const [blocks, setBlocks] = useState<ChaiBlock[]>(initialBlocks);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setBlocks(initialBlocks);
  }, [articleId, initialBlocks]);

  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(""), 3000);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white">
      <header className="mvilab-editor-chrome flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#dce8eb] bg-white px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <a
            href="/admin/news"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#0d7c8c] hover:text-[#0a5f6b] hover:underline"
          >
            <HiOutlineArrowLeft size={16} aria-hidden />
            Back to news
          </a>
          <p className="mt-1 mb-0 truncate text-sm font-semibold text-[#0a5f6b]">{title}</p>
          <p className="mt-0.5 mb-0 truncate font-mono text-xs text-[#667]">/news/{slug}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {status ? (
            <span className="rounded-full bg-[#e0f2f5] px-3 py-1 text-xs font-semibold text-[#0a5f6b]">
              {status}
            </span>
          ) : null}
          {error ? <span className="text-xs font-medium text-red-700">{error}</span> : null}
          {isPublished ? (
            <a
              href={`/news/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-xl border border-[#0d7c8c]/25 px-3 py-2 text-sm font-semibold text-[#0a5f6b] transition hover:bg-[#e0f2f5]"
            >
              <HiOutlineArrowTopRightOnSquare size={16} aria-hidden />
              Preview
            </a>
          ) : null}
        </div>
      </header>

      <div className="min-h-0 flex-1">
        <ChaiBuilderEditor
          key={articleId}
          pageId={articleId}
          blocks={blocks}
          autoSave
          autoSaveActionsCount={3}
          onSave={async ({ blocks: nextBlocks }) => {
            setError("");

            try {
              const response = await fetch(`/api/admin/news/${articleId}/blocks`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ blocks: nextBlocks }),
              });
              const data = await response.json();

              if (!response.ok) {
                setError(data.error ?? "Save failed.");
                return new Error(data.error ?? "Save failed.");
              }

              setBlocks(nextBlocks);
              setStatus("Page saved.");
              return true;
            } catch {
              setError("Save failed.");
              return new Error("Save failed.");
            }
          }}
        />
      </div>
    </div>
  );
}
