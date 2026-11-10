# Portfolio — Huzaifa Azhar

Software Engineer (Python, AI & Automation). Built with Next.js 15 (App Router), TypeScript, Tailwind CSS and Framer Motion.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Structure

- `src/content/` — all copy: profile, projects, skills (edit these to change the site and the resume)
- `src/app/` — pages, including `/projects/[slug]` case studies and `/resume`
- `public/media/` — demo videos, loops and posters per project
- `scripts/` — local tooling used to record demos and export the resume PDFs (not used by the build)

## Resume

`/resume` renders the ATS-friendly resume. Query params: `?v=full` (full CV), `?photo=1` (include photo).
The phone number is only shown when `RESUME_PHONE` is set, and is intentionally not set in production.
PDFs are exported with `RESUME_PHONE="..." node scripts/export-resume.mjs` after a build.

## Deploy

Hosted on Vercel; every push to `main` deploys to production and other branches get preview URLs.
