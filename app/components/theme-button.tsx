"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../providers";

export default function ThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="no-print fixed bottom-8 right-6 z-40 grid h-12 w-12 place-items-center rounded-full border border-line-strong bg-paper-raised text-ink shadow-lg transition-colors duration-300 hover:border-accent hover:text-accent"
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        aria-hidden="true"
        className={`transition-transform duration-700 ease-(--ease-out-expo) ${
          isDark ? "rotate-180" : ""
        }`}
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" />
      </svg>
    </button>
  );
}
