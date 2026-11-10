import Link from "next/link";
import type { Metadata } from "next";
import { profile, experience, education, certifications, languages, additionalProjects } from "@/content/profile";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";

export const metadata: Metadata = {
  title: "Resume | Huzaifa Azhar",
  description: "Resume and full CV of Huzaifa Azhar, Software Engineer (Python, AI & Automation).",
};

// The phone number is only rendered when RESUME_PHONE is set at request time, which only the
// local PDF export does (scripts/export-resume.mjs). force-dynamic keeps it out of the static build.
export const dynamic = "force-dynamic";

/*
  ATS notes (deliberate, both variants):
  - single column, no tables, no icons, no text in headers/footers
  - standard section headings, real <h1>/<h2>/<h3>/<ul>/<li> elements, selectable text
  - dates written as "Aug 2022 – Present" on the same line as the role they belong to
  - the optional photo is a plain <img> beside the name; all text stays real text
*/

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtRange = (range: string) =>
  range.replace(/(\d{2})\/(\d{4})/g, (_, m, y) => `${MONTHS[Number(m) - 1]} ${y}`).replace(/present/i, "Present");

const FULL_ORDER = [
  "smart-bus", "zerodevai", "bigsearch", "draftgenius", "pakwarera",
  "acord-form-filler", "fb-lead-radar", "x-automation-suite", "inventory-management-tool",
];
const SHORT_ORDER = ["smart-bus", "zerodevai", "bigsearch", "draftgenius", "pakwarera"];

const SKILL_LABELS: Record<string, string> = {
  languages: "Programming Languages",
  backend: "Backend",
  frontend: "Frontend",
  ai_ml: "AI / Machine Learning",
  automation: "Automation",
  data: "Databases & Data",
  cloud_devops: "Cloud & DevOps",
  practices: "Engineering Practices",
};

const PDF_FILES = {
  "short-0": "Huzaifa-Azhar-Resume.pdf",
  "short-1": "Huzaifa-Azhar-Resume-Photo.pdf",
  "full-0": "Huzaifa-Azhar-CV.pdf",
  "full-1": "Huzaifa-Azhar-CV-Photo.pdf",
} as const;

type Search = { v?: string; photo?: string };

export default async function Resume({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const full = sp.v === "full";
  const photo = sp.photo === "1";
  const phone = process.env.RESUME_PHONE;
  const order = full ? FULL_ORDER : SHORT_ORDER;
  const ordered = order.map((s) => projects.find((p) => p.slug === s)).filter(Boolean) as typeof projects;
  const pdf = PDF_FILES[`${full ? "full" : "short"}-${photo ? 1 : 0}` as keyof typeof PDF_FILES];
  const href = (v: boolean, ph: boolean) => `/resume?${new URLSearchParams({ ...(v ? { v: "full" } : {}), ...(ph ? { photo: "1" } : {}) })}`;

  return (
    <div className="resume-root min-h-screen bg-neutral-200 py-6 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-4 flex max-w-[210mm] flex-wrap items-center justify-between gap-3 px-2 font-mono text-sm text-neutral-700">
        <Link href="/" className="hover:underline">← back to portfolio</Link>
        <div className="flex flex-wrap items-center gap-2">
          <Toggle options={[["2-page resume", href(false, photo), !full], ["Full CV", href(true, photo), full]]} />
          <Toggle options={[["No photo", href(full, false), !photo], ["With photo", href(full, true), photo]]} />
          <a href={`/${pdf}`} className="rounded bg-neutral-900 px-3 py-1.5 text-white">download PDF</a>
        </div>
      </div>

      <article className={`resume-page mx-auto w-full max-w-[210mm] bg-white px-[14mm] py-[12mm] ${full ? "text-[10pt] leading-[1.42]" : "text-[9.5pt] leading-[1.32]"} text-neutral-900 shadow-lg print:max-w-none print:px-0 print:py-0 print:shadow-none`}>
        <header className="flex items-start gap-5">
          <div className="flex-1">
            <h1 className="text-[22pt] font-extrabold leading-tight tracking-tight">{profile.name}</h1>
            <p className="text-[11.5pt] font-semibold text-neutral-700">
              {profile.title} | Python, AI &amp; Automation | Backend &amp; Full-Stack Developer
            </p>
            <p className="mt-1 text-[9.5pt] text-neutral-800">
              {profile.location} | {profile.email}{phone ? ` | ${phone}` : ""}
            </p>
            <p className="text-[9.5pt] text-neutral-800">
              LinkedIn: linkedin.com/in/huzaifa-azhar | GitHub: github.com/iPythonezta | Fiverr: fiverr.com/huzaifa_blogger
            </p>
          </div>
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/pfp.jpg" alt="Huzaifa Azhar" className="h-[30mm] w-[30mm] shrink-0 rounded-md object-cover" />
          )}
        </header>

        <Section title="Professional Summary">
          {full ? (
          <p>
            Software Engineer specialising in Python backends, AI agents and automation. Freelance developer since 2022
            with 90+ completed orders and a 4.9/5 average rating (Fiverr Level 2). Builds REST APIs with Django, Django
            REST Framework, Flask and FastAPI; React and TypeScript frontends; LLM-powered workflows on OpenAI and Azure
            OpenAI; and data pipelines on PostgreSQL, MySQL and SQLite. Experience includes an industry-sponsored smart
            bus-stop system (InLights, NSTP), a Microsoft Imagine Cup 2026 multi-agent platform, a search engine built
            from first principles, and production apps deployed to Azure with CI/CD. BE Software Engineering student at
            NUST (2024–2028).
          </p>
          ) : (
          <p>
            Software Engineer specialising in Python backends, AI agents and automation, with 90+ freelance orders
            delivered at a 4.9/5 rating since 2022. Builds Django/DRF, Flask and FastAPI APIs, React/TypeScript
            frontends and LLM workflows on OpenAI and Azure OpenAI. Led the backend of an industry-sponsored smart
            bus-stop system (InLights, NSTP) and built the coding agent for a Microsoft Imagine Cup 2026 platform.
            BE Software Engineering student at NUST (2024–2028).
          </p>
          )}
        </Section>

        <Section title="Technical Skills">
          <ul className="space-y-0.5">
            {skillGroups.map((g) => (
              <li key={g.key}><b>{SKILL_LABELS[g.key] ?? g.key}:</b> {g.items.join(", ")}</li>
            ))}
            {!full && <li><b>Spoken Languages:</b> {languages.join(", ")}</li>}
          </ul>
        </Section>

        <Section title="Professional Experience">
          {experience.map((e) => {
            // freelance: headline result + focus areas (the other generic points repeat the focus list)
            const pts = e.focus.length ? [e.points[0], ...e.focus] : e.points;
            const shortPts = e.focus.length ? [e.points[0], ...e.focus.filter((f) => /^(Backend|AI|Automation)/.test(f))] : e.points;
            return (
              <Entry key={e.role} title={e.role} meta={`${e.org} | ${fmtRange(e.when)}`}>
                <ul className="ml-4 list-disc space-y-0.5">
                  {(full ? pts : shortPts).map((pt) => <li key={pt}>{pt}</li>)}
                </ul>
              </Entry>
            );
          })}
        </Section>

        <Section title="Projects">
          {ordered.map((p) => (
            <Entry key={p.slug} title={p.title} meta={`${p.team ? p.team + " | " : ""}${p.year}`}>
              <p className="text-[9.5pt] text-neutral-700"><b>Technologies:</b> {(full ? p.stack : p.stack.slice(0, 7)).join(", ")}</p>
              <ul className="ml-4 mt-0.5 list-disc space-y-0.5">
                {(full ? p.resumeBullets : p.resumeBullets.slice(0, 3)).map((b) => <li key={b}>{b}</li>)}
              </ul>
              {full && p.links && p.links.length > 0 && (
                <p className="mt-0.5 text-[9pt] text-neutral-700">
                  {p.links.map((l) => `${l.label}: ${l.href.replace(/^https?:\/\//, "")}`).join(" | ")}
                </p>
              )}
            </Entry>
          ))}
        </Section>

        <Section title="Education">
          {education.map((ed) => (
            <Entry key={ed.degree} title={ed.degree} meta={`${ed.org} | ${fmtRange(ed.when)} (${ed.status})`}>
              <p><b>Relevant coursework:</b> {ed.coursework.map((c) => c.name).join(", ")}</p>
              {full && (
                <ul className="ml-4 list-disc space-y-0.5">
                  {ed.coursework.filter((c) => c.project).map((c) => <li key={c.name}>{c.name}: {c.applied}</li>)}
                </ul>
              )}
            </Entry>
          ))}
        </Section>

        <Section title="Certifications">
          {full ? (
            <ul className="ml-4 list-disc space-y-1">
              {certifications.map((c) => (
                <li key={c.name}>
                  <b>{c.name}</b> | {c.issuer} | {c.kind}
                  <div className="text-[9.5pt] text-neutral-700">{c.covers}</div>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="ml-4 list-disc space-y-0.5">
              {certifications.map((c) => <li key={c.name}>{c.name} | {c.issuer} | {c.kind}</li>)}
            </ul>
          )}
        </Section>

        <Section title="Additional Projects">
          {full ? (
            <ul className="ml-4 list-disc space-y-0.5">
              {additionalProjects.map((a) => (
                <li key={a.name}><b>{a.name}:</b> {a.desc}{a.href ? ` (${a.href.replace(/^https?:\/\//, "")})` : ""}</li>
              ))}
            </ul>
          ) : (
            <p>
              {FULL_ORDER.filter((s) => !SHORT_ORDER.includes(s)).map((s) => projects.find((p) => p.slug === s)?.title).join(", ")},
              BigCrawl, Jskibiddi and {additionalProjects.length - 2} more. Code and demos: github.com/iPythonezta
            </p>
          )}
        </Section>

        {full && (
          <Section title="Languages">
            <p>{languages.map((l) => `${l} (fluent)`).join(", ")}</p>
          </Section>
        )}
      </article>
    </div>
  );
}

function Toggle({ options }: { options: [string, string, boolean][] }) {
  return (
    <span className="inline-flex overflow-hidden rounded border border-neutral-400">
      {options.map(([label, href, active]) => (
        <Link key={label} href={href} className={`px-2.5 py-1 ${active ? "bg-neutral-900 text-white" : "bg-white hover:bg-neutral-100"}`}>
          {label}
        </Link>
      ))}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-3.5">
      <h2 className="mb-1.5 break-after-avoid border-b border-neutral-400 pb-0.5 text-[11pt] font-bold uppercase tracking-wide text-neutral-900">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Entry({ title, meta, children }: { title: string; meta: string; children: React.ReactNode }) {
  return (
    <div className="mb-2.5 break-inside-avoid">
      <h3 className="text-[10.5pt] font-bold">{title}</h3>
      <p className="text-[9.5pt] italic text-neutral-700">{meta}</p>
      {children}
    </div>
  );
}
