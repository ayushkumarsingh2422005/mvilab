"use client";

import type { ChaiBlock } from "@chaibuilder/sdk/types";
import { ChaiBuilderEditor } from "@chaibuilder/sdk";
import { loadWebBlocks } from "@chaibuilder/sdk/web-blocks";
import "@/lib/chaibuilder/setup";
import "@chaibuilder/sdk/styles";
import Link from "next/link";
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
  const [blocks, setBlocks] = useState<ChaiBlock[]>(initialBlocks);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(""), 3000);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#dce8eb] px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <Link
            href="/admin/news"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark hover:underline"
          >
            <HiOutlineArrowLeft size={16} aria-hidden />
            Back to news
          </Link>
          <p className="mt-1 mb-0 truncate text-sm font-semibold text-primary-dark">{title}</p>
          <p className="mt-0.5 mb-0 truncate font-mono text-xs text-[#667]">/news/{slug}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {status ? (
            <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
              {status}
            </span>
          ) : null}
          {error ? <span className="text-xs font-medium text-red-700">{error}</span> : null}
          {isPublished ? (
            <a
              href={`/news/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-xl border border-primary/25 px-3 py-2 text-sm font-semibold text-primary-dark transition hover:bg-primary-light"
            >
              <HiOutlineArrowTopRightOnSquare size={16} aria-hidden />
              Preview
            </a>
          ) : null}
        </div>
      </header>

      <div className="min-h-0 flex-1">
        <ChaiBuilderEditor
          blocks={blocks}
          autoSave
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
