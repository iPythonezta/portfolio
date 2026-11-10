import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import CodeBlock from "@/components/CodeBlock";
import { DemoVideo, ProjectFlow } from "@/components/media";
import { Chip, Reveal } from "@/components/ui";
import { getProject, projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  return p ? { title: `${p.title} | Huzaifa Azhar`, description: p.summary } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-28 sm:px-6">
        <Link href="/#projects" className="font-mono text-sm text-dim hover:text-accent">← cd ../projects</Link>

        <Reveal>
          <p className="mt-8 font-mono text-sm text-accent">{p.category} · {p.year}</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{p.title}</h1>
          <p className="mt-3 text-xl text-dim">{p.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-1.5">{p.stack.map((s) => <Chip key={s}>{s}</Chip>)}</div>
        </Reveal>

        {p.media && (
          <Reveal className="mt-10">
            <DemoVideo src={p.media.demo} poster={p.media.poster} />
            {p.note && <p className="mt-2 font-mono text-xs text-dim">note: {p.note}</p>}
          </Reveal>
        )}

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-lg border border-line bg-panel p-5">
              <h2 className="font-mono text-sm text-accent">// my role</h2>
              <p className="mt-2 text-sm leading-relaxed text-dim">{p.role}</p>
              {p.team && <p className="mt-2 font-mono text-xs text-dim">{p.team}</p>}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-lg border border-line bg-panel p-5">
              <h2 className="font-mono text-sm text-accent">// the problem</h2>
              <p className="mt-2 text-sm leading-relaxed text-dim">{p.problem}</p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-12">
          <h2 className="font-mono text-sm text-accent">// overview</h2>
          <p className="mt-3 text-lg leading-relaxed">{p.summary}</p>
        </Reveal>

        <Reveal className="mt-12">
          <h2 className="font-mono text-sm text-accent">// how it works</h2>
          <ol className="mt-4 space-y-3">
            {p.solution.map((s, i) => (
              <li key={i} className="flex gap-4 text-dim">
                <span className="font-mono text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="mt-12">
          <h2 className="mb-4 font-mono text-sm text-accent">// architecture</h2>
          <ProjectFlow flow={p.flow} />
        </div>

        <Reveal className="mt-12">
          <h2 className="mb-4 font-mono text-sm text-accent">// highlights</h2>
          <ul className="grid gap-3 sm:grid-cols-3">
            {p.highlights.map((h) => (
              <li key={h} className="rounded-lg border border-line bg-panel p-4 text-sm leading-relaxed text-dim">{h}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-12">
          <h2 className="mb-4 font-mono text-sm text-accent">// from the code</h2>
          <CodeBlock file={p.snippet.file} code={p.snippet.code} lang={p.snippet.lang} />
        </Reveal>

        {!p.media && p.note && <p className="mt-8 font-mono text-xs text-dim">note: {p.note}</p>}

        {p.links && (
          <div className="mt-10 flex flex-wrap gap-3 font-mono text-sm">
            {p.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="rounded border border-line px-4 py-2 transition hover:border-accent hover:text-accent">{l.label} ↗</a>
            ))}
          </div>
        )}

        <nav className="mt-16 grid grid-cols-2 gap-4 border-t border-line pt-8 font-mono text-sm" aria-label="Other projects">
          <Link href={`/projects/${prev.slug}`} className="text-dim hover:text-accent">← {prev.title}</Link>
          <Link href={`/projects/${next.slug}`} className="text-right text-dim hover:text-accent">{next.title} →</Link>
        </nav>
      </main>
    </>
  );
}
