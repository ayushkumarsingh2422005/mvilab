"use client";

import { useEffect } from "react";

const STYLE_ID = "mvilab-chaibuilder-editor-styles";
const STYLE_HREF = "/chaibuilder.editor.css";
const ACTIVE_CLASS = "mvilab-chaibuilder-active";

export function useChaiBuilderEditorStyles() {
  useEffect(() => {
    let link = document.getElementById(STYLE_ID) as HTMLLinkElement | null;

    if (!link) {
      link = document.createElement("link");
      link.id = STYLE_ID;
      link.rel = "stylesheet";
      link.href = STYLE_HREF;
      document.head.appendChild(link);
    }

    document.documentElement.classList.add(ACTIVE_CLASS);

    return () => {
      document.getElementById(STYLE_ID)?.remove();
      document.documentElement.classList.remove(ACTIVE_CLASS);
    };
  }, []);
}
