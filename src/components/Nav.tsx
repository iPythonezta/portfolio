"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import ThemeToggle, { toggleTheme } from "./ThemeToggle";

type Cmd = { label: string; hint: string; run: () => void };

export default function Nav() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const go = (hash: string) => {
    setOpen(false);
    if (location.pathname === "/") document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    else router.push("/" + hash);
  };

  const cmds: Cmd[] = useMemo(
    () => [
      { label: "Go to About", hint: "section", run: () => go("#about") },
      { label: "Go to Skills", hint: "section", run: () => go("#skills") },
      { label: "Go to Projects", hint: "section", run: () => go("#projects") },
      { label: "Go to Experience", hint: "section", run: () => go("#experience") },
      { label: "Go to Education", hint: "section", run: () => go("#education") },
      { label: "Go to Contact", hint: "section", run: () => go("#contact") },
      ...projects.map((p) => ({
        label: `Open ${p.title}`,
        hint: "project",
        run: () => { setOpen(false); router.push(`/projects/${p.slug}`); },
      })),
      { label: "Open resume", hint: "page", run: () => { setOpen(false); router.push("/resume"); } },
      { label: "Toggle light / dark theme", hint: "action", run: () => { toggleTheme(); setOpen(false); } },
      { label: "GitHub", hint: "link", run: () => window.open(profile.links.github, "_blank") },
      { label: "LinkedIn", hint: "link", run: () => window.open(profile.links.linkedin, "_blank") },
      { label: "Fiverr", hint: "link", run: () => window.open(profile.links.fiverr, "_blank") },
      { label: "Copy email address", hint: "action", run: () => { navigator.clipboard?.writeText(profile.email); setOpen(false); } },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const list = cmds.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { if (open) { setQ(""); setSel(0); setTimeout(() => input.current?.focus(), 30); } }, [open]);
  useEffect(() => setSel(0), [q]);

  return (
    <>
      <header className="no-print fixed inset-x-0 top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-mono text-sm font-semibold text-fg">
            <span className="text-accent">~/</span>huzaifa<span className="text-dim">.dev</span>
          </Link>
          <div className="hidden items-center gap-6 font-mono text-xs text-dim md:flex">
            {["about", "skills", "projects", "experience", "education", "contact"].map((s) => (
              <a key={s} href={`/#${s}`} className="transition hover:text-accent">{s}</a>
            ))}
            <Link href="/resume" className="transition hover:text-accent">resume</Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="rounded border border-line px-2 py-1 font-mono text-xs text-dim transition hover:border-accent hover:text-accent"
              aria-label="Open command palette"
            >
              <span className="hidden sm:inline">search </span>Ctrl K
            </button>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-24"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <div className="glow w-full max-w-lg overflow-hidden rounded-lg border border-line bg-panel" onClick={(e) => e.stopPropagation()}>
            <input
              ref={input}
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, list.length - 1)); }
                if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
                if (e.key === "Enter") list[sel]?.run();
              }}
              placeholder="Type a command or search..."
              className="w-full border-b border-line bg-transparent px-4 py-3 font-mono text-sm outline-none placeholder:text-dim"
            />
            <ul className="max-h-80 overflow-y-auto py-1">
              {list.length === 0 && <li className="px-4 py-3 font-mono text-sm text-dim">No matches</li>}
              {list.map((c, i) => (
                <li key={c.label}>
                  <button
                    onMouseEnter={() => setSel(i)}
                    onClick={c.run}
                    className={`flex w-full items-center justify-between px-4 py-2 text-left font-mono text-sm ${i === sel ? "bg-accent/10 text-accent" : "text-fg"}`}
                  >
                    {c.label}
                    <span className="text-xs text-dim">{c.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
