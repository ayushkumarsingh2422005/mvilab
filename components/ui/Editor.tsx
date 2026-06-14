"use client";

import { ChaiBuilderEditor } from "@chaibuilder/sdk";
import { loadWebBlocks } from "@chaibuilder/sdk/web-blocks";
import type { ChaiBlock } from "@chaibuilder/sdk/types";
import "@/lib/chaibuilder/setup";
import { useChaiBuilderEditorStyles } from "@/lib/chaibuilder/use-chaibuilder-editor-styles";
import { useState } from "react";

loadWebBlocks();

const STORAGE_KEY = "mvilab-editor-blocks";

function readSavedBlocks(): ChaiBlock[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as ChaiBlock[]) : [];
  } catch {
    return [];
  }
}

export function PageEditor() {
  useChaiBuilderEditorStyles();
  const [blocks, setBlocks] = useState<ChaiBlock[]>(readSavedBlocks);

  return (
    <ChaiBuilderEditor
      blocks={blocks}
      autoSave
      onSave={async ({ blocks: nextBlocks }) => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBlocks));
          setBlocks(nextBlocks);
          return true;
        } catch (error) {
          return error instanceof Error ? error : new Error("Save failed");
        }
      }}
    />
  );
}
