"use client";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({ n, name, sub }: { n: string; name: string; sub?: string }) {
  return (
    <Reveal className="mb-10">
      <p className="font-mono text-sm text-accent">
        <span className="text-dim">{n}</span> // {name}
      </p>
      {sub && <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{sub}</h2>}
    </Reveal>
  );
}

export function Counter({ value, decimals = 0, suffix = "", plain = false }: { value: number; decimals?: number; suffix?: string; plain?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);
  useEffect(() => {
    if (!inView || reduce) { setShown(value); return; }
    const c = animate(0, value, { duration: 1.4, ease: "easeOut", onUpdate: (v) => setShown(v) });
    return () => c.stop();
  }, [inView, value, reduce]);
  const text = plain ? String(Math.round(shown)) : shown.toFixed(decimals);
  return <span ref={ref}>{text}{suffix}</span>;
}

export function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded border border-line bg-panel px-2 py-0.5 font-mono text-xs text-dim">{children}</span>;
}
