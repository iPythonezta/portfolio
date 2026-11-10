"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Muted looping preview that only plays while visible. */
export function LoopVideo({ src, poster, className = "" }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); },
      { threshold: 0.4 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);
  return (
    <video ref={ref} className={className} src={src} poster={poster} muted loop playsInline preload="none" aria-hidden="true" />
  );
}

/** Full demo with native controls. Source is only fetched when the user presses play. */
export function DemoVideo({ src, poster }: { src: string; poster: string }) {
  return (
    <video className="w-full rounded-md border border-line bg-black" src={src} poster={poster} controls playsInline preload="none" />
  );
}

export function ProjectFlow({ flow }: { flow: { label: string; detail: string }[] }) {
  const reduce = useReducedMotion();
  return (
    <ol className="flex flex-col gap-2 md:flex-row md:items-stretch md:gap-0">
      {flow.map((f, i) => (
        <motion.li
          key={f.label}
          className="flex flex-1 items-center md:flex-col md:items-stretch"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.09, duration: 0.4 }}
        >
          <div className="flex-1 rounded-md border border-line bg-panel px-3 py-3 md:mx-1">
            <div className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</div>
            <div className="mt-1 text-sm font-semibold">{f.label}</div>
            <div className="font-mono text-xs text-dim">{f.detail}</div>
          </div>
          {i < flow.length - 1 && <span className="px-2 font-mono text-dim md:hidden">↓</span>}
        </motion.li>
      ))}
    </ol>
  );
}

export function MiniFlow({ flow }: { flow: { label: string; detail: string }[] }) {
  const [on, setOn] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setOn((o) => (o + 1) % flow.length), 1100);
    return () => clearInterval(t);
  }, [flow.length, reduce]);
  return (
    <div className="flex h-full flex-col justify-center gap-1.5 p-5 font-mono text-xs" aria-hidden="true">
      {flow.map((f, i) => (
        <div key={f.label} className={`flex items-center gap-2 transition-colors duration-500 ${i === on ? "text-accent" : "text-dim"}`}>
          <span>{i === on ? "▸" : "·"}</span>
          <span>{f.label}</span>
          <span className="text-dim/60">// {f.detail}</span>
        </div>
      ))}
    </div>
  );
}
