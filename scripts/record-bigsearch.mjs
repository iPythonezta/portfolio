// Records the real BigSearchServer UI (localhost:5000) running on the sample-document index.
// Usage: node scripts/record-bigsearch.mjs <outDir>
import { chromium } from "playwright";
import { mkdirSync, readdirSync, renameSync } from "node:fs";
import path from "node:path";

const out = process.argv[2] ?? "bs-rec";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: out, size: { width: 1280, height: 720 } } });
const page = await ctx.newPage();
const pause = (ms) => page.waitForTimeout(ms);
const scroll = async (dy, steps = 8) => { for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, dy / steps); await pause(150); } };

async function search(text, { dwell = 1500, scrollBy = 700 } = {}) {
  const box = page.locator("input").first();
  await box.click();
  await box.fill("");
  await pause(300);
  await box.pressSequentially(text, { delay: 110 });
  await pause(dwell);               // let autocomplete show
  await page.keyboard.press("Enter");
  await pause(2200);
  await scroll(scrollBy, 8);
  await pause(900);
  await page.mouse.wheel(0, -4000);
  await pause(700);
}

try {
  await page.goto("http://localhost:5000/", { waitUntil: "networkidle" });
  await pause(1800);
  await search("python", { scrollBy: 900 });
  await search("protein structure", { scrollBy: 1100 });
  await search("machine learning", { scrollBy: 700 });
  await search("virus", { scrollBy: 900 });
  await pause(800);
} finally {
  await ctx.close();
  await browser.close();
}
const f = readdirSync(out).find((x) => x.endsWith(".webm"));
if (f) renameSync(path.join(out, f), path.join(out, "bigsearch.webm"));
console.log("recorded", path.join(out, "bigsearch.webm"));
