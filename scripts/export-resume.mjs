// Exports every resume variant to public/:
//   Huzaifa-Azhar-Resume.pdf / -Resume-Photo.pdf   (2-page resume)
//   Huzaifa-Azhar-CV.pdf     / -CV-Photo.pdf       (full CV)
// The phone number is passed only via the RESUME_PHONE env var for this run, so it never lives in the repo
// or in the deployed site.   Usage (after `npm run build`):
//   RESUME_PHONE="+92 ..." node scripts/export-resume.mjs
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const port = 3101;
const VARIANTS = [
  { query: "", file: "Huzaifa-Azhar-Resume.pdf" },
  { query: "?photo=1", file: "Huzaifa-Azhar-Resume-Photo.pdf" },
  { query: "?v=full", file: "Huzaifa-Azhar-CV.pdf" },
  { query: "?v=full&photo=1", file: "Huzaifa-Azhar-CV-Photo.pdf" },
];

const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
  env: { ...process.env },
  stdio: "ignore",
});
const stop = () => server.kill();
process.on("exit", stop);

for (let i = 0; i < 60; i++) {
  try { if ((await fetch(`http://localhost:${port}/resume`)).ok) break; } catch {}
  await new Promise((r) => setTimeout(r, 500));
}

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
await page.emulateMedia({ media: "print" });
for (const v of VARIANTS) {
  await page.goto(`http://localhost:${port}/resume${v.query}`, { waitUntil: "networkidle" });
  await page.pdf({
    path: `public/${v.file}`,
    format: "A4",
    printBackground: true,
    margin: { top: "14mm", right: "14mm", bottom: "14mm", left: "14mm" },
  });
  console.log("wrote", v.file);
}
await browser.close();
stop();
console.log(process.env.RESUME_PHONE ? "(with phone)" : "(no phone)");
