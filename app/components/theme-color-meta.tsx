"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

const LIGHT_COLOR = "#FAFAF8";
const DARK_COLOR = "#09090b";

export function ThemeColorMeta() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    meta.setAttribute(
      "content",
      resolvedTheme === "dark" ? DARK_COLOR : LIGHT_COLOR
    );
  }, [resolvedTheme]);

  return null;
}