import Link from "next/link";
import { profile, experience, education, certifications } from "@/content/profile";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { Chip, Counter, Reveal, SectionTitle } from "./ui";
import { LoopVideo, MiniFlow } from "./media";
import TerminalWidget from "./TerminalWidget";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6">
      <SectionTitle n="01" name="about" sub="Engineer first, tool-builder always." />
      <div className="grid gap-10 lg:grid-cols-2">
        <Reveal>
          <p className="text-lg leading-relaxed text-dim">{profile.summary}</p>
          <p className="mt-4 leading-relaxed text-dim">
            Most of what I build starts as a real problem someone is paying to solve: finding leads, filling forms, forecasting a
            market, keeping stock in order. I like the whole path from data model and API to a UI a non-technical person can
            use, and I package things so they run on the user's own machine when that is what they need.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {profile.stats.map((s) => (
              <div key={s.label} className="rounded-lg border border-line bg-panel p-4">
                <div className="font-mono text-3xl font-bold text-accent">
                  <Counter value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} plain={s.plain} />
                </div>
                <div className="mt-1 text-sm text-dim">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <TerminalWidget />
          <p className="mt-3 font-mono text-xs text-dim">↑ try: help, ls projects, open bigsearch</p>
        </Reveal>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6">
      <SectionTitle n="02" name="skills" sub="The toolbox, written as code." />
      <Reveal>
        <div className="overflow-hidden rounded-lg border border-line bg-panel">
          <div className="border-b border-line px-4 py-2 font-mono text-xs text-dim">skills.py</div>
          <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7">
            <code>
              <span className="text-pink">from</span> <span className="text-sky">huzaifa</span> <span className="text-pink">import</span> toolbox{"\n\n"}
              <span className="text-dim"># Everything below is used in the projects on this page.</span>
              {"\n"}
              {skillGroups.map((g) => (
                <span key={g.key}>
                  <span className="text-fg">{g.key}</span> <span className="text-pink">=</span> [
                  {g.items.map((it, i) => (
                    <span key={it}>
                      <span className="text-amber">&quot;{it}&quot;</span>
                      {i < g.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                  ]{"\n"}
                </span>
              ))}
            </code>
          </pre>
        </div>
      </Reveal>
    </section>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6">
      <SectionTitle n="03" name="projects" sub="Selected work: AI, systems and automation." />
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 0.08}>
            <Link href={`/projects/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-panel transition hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_10px_40px_-15px_rgb(var(--accent)/0.5)]">
              <div className="flex items-center gap-2 border-b border-line px-4 py-2 font-mono text-xs text-dim">
                <span className="text-accent">●</span> {p.slug}.py
                <span className="ml-auto">{p.category}</span>
              </div>
              <div className="aspect-[16/9] overflow-hidden border-b border-line bg-bg">
                {p.media ? (
                  <LoopVideo src={p.media.loop} poster={p.media.poster} className="h-full w-full object-cover object-top" />
                ) : (
                  <MiniFlow flow={p.flow} />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-xl font-bold group-hover:text-accent">{p.title}</h3>
                <p className="mt-1 text-sm text-dim">{p.tagline}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-dim">{p.summary}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.stack.slice(0, 6).map((s) => <Chip key={s}>{s}</Chip>)}
                </div>
                <div className="mt-4 font-mono text-xs text-accent">read case study →</div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const titleOf = (slug: string) => projects.find((p) => p.slug === slug)?.title ?? slug;

function ProjectLinks({ slugs, label }: { slugs: string[]; label: string }) {
  if (!slugs.length) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-xs text-dim">
      <span>{label}</span>
      {slugs.map((s) => (
        <Link key={s} href={`/projects/${s}`} className="rounded border border-line px-2 py-0.5 transition hover:border-accent hover:text-accent">
          {titleOf(s)}
        </Link>
      ))}
    </div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6">
      <SectionTitle n="04" name="experience" sub="Employment, freelance & team work" />
      <div className="relative border-l border-line pl-8">
        {experience.map((e, i) => (
          <Reveal key={e.role} delay={i * 0.06} className="relative pb-12 last:pb-0">
            <span className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-bg" />
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-xs text-accent">{e.when}</span>
              <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-dim">{e.kind}</span>
            </div>
            <h3 className="mt-1 text-xl font-semibold">{e.role}</h3>
            <div className="text-sm text-dim">{e.org}</div>

            {e.metrics.length > 0 && (
              <div className="mt-4 grid max-w-xl grid-cols-3 gap-3">
                {e.metrics.map((m) => (
                  <div key={m.label} className="rounded-lg border border-line bg-panel p-3">
                    <div className="font-mono text-xl font-bold text-accent">{m.value}</div>
                    <div className="text-xs text-dim">{m.label}</div>
                  </div>
                ))}
              </div>
            )}

            <ul className="mt-4 max-w-3xl space-y-1.5 text-sm leading-relaxed text-dim">
              {(e.focus.length ? e.focus : e.points).map((pt) => (
                <li key={pt} className="flex gap-2"><span className="text-accent">+</span>{pt}</li>
              ))}
            </ul>
            <ProjectLinks slugs={e.seeProjects} label="related work:" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section id="education" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6">
      <SectionTitle n="05" name="education" sub="Education & certifications" />
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          {education.map((ed) => (
            <Reveal key={ed.degree}>
              <div className="rounded-lg border border-line bg-panel p-5">
                <div className="font-mono text-xs text-accent">{ed.when}</div>
                <h3 className="mt-1 text-lg font-semibold">{ed.degree}</h3>
                <div className="text-sm text-dim">{ed.org}</div>
                <div className="mt-2 inline-block rounded border border-line px-2 py-0.5 font-mono text-xs text-dim">{ed.status}</div>
                <h4 className="mt-5 font-mono text-xs text-accent">// coursework → projects</h4>
                <ul className="mt-2 space-y-3">
                  {ed.coursework.map((c) => (
                    <li key={c.name} className="text-sm">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-dim">
                        {c.applied}
                        {c.project && (
                          <> · <Link href={`/projects/${c.project}`} className="text-sky underline-offset-4 hover:underline">view project</Link></>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <div>
          <h3 className="mb-4 font-mono text-sm text-accent">// certifications</h3>
          <ul className="space-y-3">
            {certifications.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.05}>
                <li className="rounded-lg border border-line bg-panel p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="font-semibold">{c.name}</div>
                    <div className="font-mono text-xs text-dim">{c.issuer} · {c.kind}</div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-dim"><span className="text-fg">Program covers:</span> {c.covers}</p>
                  <ProjectLinks slugs={c.appliedIn} label="related projects:" />
                  {"link" in c && c.link && (
                    <a href={c.link.href} target="_blank" rel="noreferrer" className="mt-3 inline-block font-mono text-xs text-sky hover:underline">{c.link.label} ↗</a>
                  )}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const rows = [
    ["email", profile.email, `mailto:${profile.email}`],
    ["github", "github.com/iPythonezta", profile.links.github],
    ["linkedin", "linkedin.com/in/huzaifa-azhar", profile.links.linkedin],
    ["fiverr", "fiverr.com/huzaifa_blogger", profile.links.fiverr],
  ];
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24 sm:px-6">
      <SectionTitle n="06" name="contact" sub="Have something worth building?" />
      <Reveal>
        <div className="glow overflow-hidden rounded-lg border border-line bg-panel">
          <div className="border-b border-line px-4 py-2 font-mono text-xs text-dim">contact.sh</div>
          <div className="space-y-2 p-6 font-mono text-sm">
            {rows.map(([k, label, href]) => (
              <div key={k} className="flex flex-wrap gap-x-3">
                <span className="w-20 text-dim">{k}</span>
                <a href={href} target={k === "email" ? undefined : "_blank"} rel="noreferrer" className="text-sky underline-offset-4 hover:text-accent hover:underline">{label}</a>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
      <footer className="mt-16 text-center font-mono text-xs text-dim">
        © {new Date().getFullYear()} {profile.name} · built with Next.js, Tailwind and Framer Motion
      </footer>
    </section>
  );
}
