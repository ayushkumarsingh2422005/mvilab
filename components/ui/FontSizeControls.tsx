"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "font-size-level";
const LEVELS = [0, 1, 2, 3] as const;
type FontLevel = (typeof LEVELS)[number];

function applyLevel(level: FontLevel) {
  document.documentElement.setAttribute("data-font-size-level", String(level));
  try {
    localStorage.setItem(STORAGE_KEY, String(level));
  } catch {
    /* ignore */
  }
}

function readStoredLevel(): FontLevel {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw !== null ? Number(raw) : 1;
    if (LEVELS.includes(parsed as FontLevel)) return parsed as FontLevel;
  } catch {
    /* ignore */
  }
  return 1;
}

function fontBtnClasses(active: boolean) {
  const shared =
    "min-h-5 cursor-pointer px-[5px] py-px text-[0.7rem] leading-tight disabled:cursor-not-allowed disabled:opacity-45";

  if (active) {
    return `${shared} border border-[#0d7c8c] bg-[#0d7c8c] font-semibold text-white hover:enabled:bg-[#0a5f6b] hover:enabled:border-[#0a5f6b]`;
  }

  return `${shared} border border-[#b0b0b0] bg-white text-[#333] hover:enabled:bg-[#f0f0f0]`;
}

export function FontSizeControls() {
  const [level, setLevel] = useState<FontLevel>(1);

  useEffect(() => {
    const stored = readStoredLevel();
    setLevel(stored);
    applyLevel(stored);
  }, []);

  const setAndApply = (next: FontLevel) => {
    setLevel(next);
    applyLevel(next);
  };

  return (
    <div className="inline-flex items-center gap-0.5 leading-none" role="group" aria-label="Font size">
      <button
        type="button"
        className={fontBtnClasses(level === 0)}
        aria-label="Decrease font size"
        aria-pressed={level === 0}
        disabled={level === 0}
        onClick={() => setAndApply(Math.max(0, level - 1) as FontLevel)}
      >
        A-
      </button>
      <button
        type="button"
        className={fontBtnClasses(level === 1)}
        aria-label="Default font size"
        aria-pressed={level === 1}
        onClick={() => setAndApply(1)}
      >
        A
      </button>
      <button
        type="button"
        className={fontBtnClasses(level >= 2)}
        aria-label="Increase font size"
        aria-pressed={level >= 2}
        disabled={level === 3}
        onClick={() => setAndApply(Math.min(3, level + 1) as FontLevel)}
      >
        A+
      </button>
    </div>
  );
}
