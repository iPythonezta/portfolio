"use client";
import { useEffect, useState } from "react";

export function setTheme(t: "light" | "dark") {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem("theme", t); } catch {}
}
export function toggleTheme() {
  setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
}

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle light / dark theme"
      className="rounded border border-line px-2 py-1 font-mono text-xs text-dim transition hover:border-accent hover:text-accent"
    >
      {mounted ? "theme" : "theme"}
    </button>
  );
}
