"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

const SCRIPT: { kind: "cmd" | "out"; text: string }[] = [
  { kind: "cmd", text: "whoami" },
  { kind: "out", text: `${profile.name.toLowerCase().replace(" ", "-")}  //  ${profile.title}` },
  { kind: "cmd", text: "cat focus.txt" },
  { kind: "out", text: "Python · AI agents · Automation · Full-stack" },
  { kind: "cmd", text: "ls projects/ | wc -l" },
  { kind: "out", text: String(projects.length) },
  { kind: "cmd", text: "echo $FREELANCING_SINCE" },
  { kind: "out", text: "2022" },
];

export default function Hero() {
  const reduce = useReducedMotion();
  const [lineIdx, setLineIdx] = useState(0);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (reduce) { setLineIdx(SCRIPT.length); return; }
    if (lineIdx >= SCRIPT.length) return;
    const line = SCRIPT[lineIdx];
    const next = () => { setLineIdx((i) => i + 1); setChars(0); };
    if (line.kind === "out") {
      const t = setTimeout(next, 260);
      return () => clearTimeout(t);
    }
    if (chars < line.text.length) {
      const t = setTimeout(() => setChars((c) => c + 1), 38 + Math.random() * 35);
      return () => clearTimeout(t);
    }
    const t = setTimeout(next, 380);
    return () => clearTimeout(t);
  }, [lineIdx, chars, reduce]);

  const done = lineIdx >= SCRIPT.length;
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4 pb-16 pt-24 sm:px-6">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" aria-hidden />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <div className="glow scan relative overflow-hidden rounded-lg border border-line bg-panel/90">
            <div className="flex items-center gap-2 border-b border-line px-4 py-2">
              <span className="h-3 w-3 rounded-full bg-pink/70" />
              <span className="h-3 w-3 rounded-full bg-amber/70" />
              <span className="h-3 w-3 rounded-full bg-accent/70" />
              <span className="ml-3 font-mono text-xs text-dim">huzaifa@portfolio: ~</span>
            </div>
            <div className="min-h-[15rem] p-5 font-mono text-sm leading-7" aria-label="Terminal introduction">
              {SCRIPT.slice(0, lineIdx + 1).map((l, i) => {
                const typing = i === lineIdx && !done;
                const text = typing && l.kind === "cmd" ? l.text.slice(0, chars) : l.text;
                if (!text && !typing) return null;
                return l.kind === "cmd" ? (
                  <div key={i}>
                    <span className="text-accent">$</span> <span className={typing ? "caret" : ""}>{text}</span>
                  </div>
                ) : (
                  <div key={i} className="text-sky">{text}</div>
                );
              })}
              {done && (
                <div>
                  <span className="text-accent">$</span> <span className="caret" />
                </div>
              )}
            </div>
          </div>

          <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">{profile.name}</h1>
          <p className="mt-3 font-mono text-lg text-accent sm:text-xl">
            {profile.title} <span className="text-dim">—</span> {profile.headline}
          </p>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-dim">{profile.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3 font-mono text-sm">
            <a href="#projects" className="rounded bg-accent px-5 py-2.5 font-semibold text-bg transition hover:brightness-110">view projects</a>
            <Link href="/resume" className="rounded border border-line px-5 py-2.5 transition hover:border-accent hover:text-accent">resume</Link>
            <a href={profile.links.github} target="_blank" rel="noreferrer" className="rounded border border-line px-5 py-2.5 transition hover:border-accent hover:text-accent">github ↗</a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="glow overflow-hidden rounded-lg border border-line bg-panel">
            <div className="border-b border-line px-4 py-2 font-mono text-xs text-dim">profile.json</div>
            <div className="p-5">
              <Image src="/pfp.jpg" alt="Portrait of Huzaifa Azhar" width={400} height={400} priority className="aspect-square w-full rounded-md object-cover" />
              <pre className="mt-4 overflow-x-auto font-mono text-xs leading-6 text-dim">{`{
  "name": "${profile.name}",
  "role": "${profile.title}",
  "location": "${profile.location}",
  "education": "BE Software Eng, NUST",
  "stack": ["Python", "Django", "React", "LLMs"]
}`}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
