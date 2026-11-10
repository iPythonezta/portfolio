// Screenshot helper for visual QA. Usage: node scripts/shots.mjs <outDir>
import { chromium } from "playwright";
import path from "node:path";
import { mkdirSync } from "node:fs";

const out = process.argv[2] ?? "shots";
mkdirSync(out, { recursive: true });
const base = "http://localhost:3100";
const browser = await chromium.launch({ channel: "chrome" });

async function shoot(name, url, { width, height = 900, theme = "dark", full = true, wait = 1800 }) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  await ctx.addInitScript((t) => { try { localStorage.setItem("theme", t); } catch {} }, theme);
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(base + url, { waitUntil: "networkidle" });
  await page.waitForTimeout(wait);
  // scroll through to trigger reveal animations
  if (full) {
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 500) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(120); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: path.join(out, name + ".png"), fullPage: full });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  console.log(name, "errors:", errors.length ? errors.slice(0, 3) : "none", "h-overflow:", overflow);
  await ctx.close();
}

await shoot("home-desktop-dark", "/", { width: 1440 });
await shoot("home-mobile-dark", "/", { width: 390, height: 844 });
await shoot("home-desktop-light", "/", { width: 1440, theme: "light" });
await shoot("project-acord-desktop", "/projects/acord-form-filler", { width: 1440 });
await shoot("project-bigsearch-mobile", "/projects/bigsearch", { width: 390, height: 844 });
await shoot("resume", "/resume", { width: 1000, theme: "light" });
await browser.close();
