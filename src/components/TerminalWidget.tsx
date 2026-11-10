"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { toggleTheme } from "./ThemeToggle";

type Line = { kind: "in" | "out" | "err"; text: string };

export default function TerminalWidget() {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([{ kind: "out", text: "Type 'help' to see available commands." }]);
  const [value, setValue] = useState("");
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight }); }, [lines]);

  const run = (raw: string) => {
    const [cmd = "", ...args] = raw.trim().split(/\s+/);
    const out: Line[] = [{ kind: "in", text: raw }];
    const say = (t: string) => t.split("\n").forEach((x) => out.push({ kind: "out", text: x }));
    switch (cmd) {
      case "": break;
      case "help": say("help · whoami · ls projects · open <slug> · skills · contact · resume · theme · clear"); break;
      case "whoami": say(`${profile.name} — ${profile.title}, ${profile.headline}`); break;
      case "ls": say(projects.map((p) => p.slug).join("\n")); break;
      case "open": {
        const p = projects.find((x) => x.slug === args[0]);
        if (p) { say(`opening ${p.title}...`); setTimeout(() => router.push(`/projects/${p.slug}`), 350); }
        else out.push({ kind: "err", text: `open: no such project '${args[0] ?? ""}'. Try 'ls projects'.` });
        break;
      }
      case "skills": say("Python · Django · Flask · FastAPI · React · Next.js · LLM agents · PostgreSQL · Azure"); break;
      case "contact": say(`${profile.email}\n${profile.links.github}\n${profile.links.linkedin}`); break;
      case "resume": say("opening resume..."); setTimeout(() => router.push("/resume"), 350); break;
      case "theme": toggleTheme(); say("theme toggled"); break;
      case "clear": setLines([]); return;
      case "sudo": out.push({ kind: "err", text: "nice try." }); break;
      default: out.push({ kind: "err", text: `${cmd}: command not found. Try 'help'.` });
    }
    setLines((l) => [...l, ...out]);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-panel">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2">
        <span className="h-3 w-3 rounded-full bg-pink/70" />
        <span className="h-3 w-3 rounded-full bg-amber/70" />
        <span className="h-3 w-3 rounded-full bg-accent/70" />
        <span className="ml-3 font-mono text-xs text-dim">interactive shell</span>
      </div>
      <div ref={box} className="h-56 overflow-y-auto p-4 font-mono text-sm leading-6" onClick={() => document.getElementById("term-input")?.focus()}>
        {lines.map((l, i) => (
          <div key={i} className={l.kind === "in" ? "text-fg" : l.kind === "err" ? "text-pink" : "text-sky"}>
            {l.kind === "in" && <span className="text-accent">$ </span>}
            {l.text}
          </div>
        ))}
        <form onSubmit={(e) => { e.preventDefault(); run(value); setValue(""); }} className="flex">
          <span className="text-accent">$&nbsp;</span>
          <input id="term-input" value={value} onChange={(e) => setValue(e.target.value)} aria-label="Terminal input" autoComplete="off" spellCheck={false} className="flex-1 bg-transparent outline-none" />
        </form>
      </div>
    </div>
  );
}
