// Records DraftGenius running locally (Flask :5000 + Vite :5173) with public cricket data.
// Usage: node scripts/record-draftgenius.mjs <outDir>
import { chromium } from "playwright";
import { mkdirSync, readdirSync, renameSync } from "node:fs";
import path from "node:path";

const out = process.argv[2] ?? "dg-rec";
mkdirSync(out, { recursive: true });
const base = "http://localhost:5173";

const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: out, size: { width: 1280, height: 720 } },
});
const page = await ctx.newPage();
const pause = (ms) => page.waitForTimeout(ms);
const scroll = async (dy, steps = 8) => { for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, dy / steps); await pause(160); } };

try {
  // 1. pick two franchises
  await page.goto(base, { waitUntil: "networkidle" });
  await pause(1800);
  await page.getByRole("button", { name: /Select Team A/ }).click();
  await pause(700);
  await page.getByText("Karachi Kings").click();
  await pause(600);
  await page.getByRole("button", { name: /Select Team B/ }).click();
  await pause(700);
  await page.getByText("Lahore Qalandars").click();
  await pause(1100);
  await page.getByRole("button").last().click();

  // 2. player pool (first load fits per-player models, can take a while)
  await page.waitForFunction(() => /Showing [1-9]\d* players/.test(document.body.innerText), null, { timeout: 60000 });
  await pause(1500);
  await scroll(500, 6);
  await pause(600);
  await page.getByRole("button", { name: "BAT", exact: true }).click().catch(() => {});
  await pause(1300);
  await page.getByRole("button", { name: "ALL", exact: true }).click().catch(() => {});
  await pause(800);
  await page.mouse.wheel(0, -2000);
  await pause(700);

  // 3. constraints, then run the genetic algorithm
  await page.getByRole("button", { name: /Generate XI/ }).click();
  await pause(2200);
  await scroll(350, 5);
  await pause(1200);
  await page.getByRole("button", { name: /Generate Fantasy XI/ }).click();

  // 4. live evolution + results
  await page.getByText("WAR ROOM").waitFor({ timeout: 120000 });
  await pause(3200);
  await scroll(500, 8);
  await pause(1600);
  await scroll(500, 8);
  await pause(1600);
  await scroll(500, 8);
  await pause(1800);
} finally {
  await ctx.close();
  await browser.close();
}
const f = readdirSync(out).find((x) => x.endsWith(".webm"));
if (f) renameSync(path.join(out, f), path.join(out, "draftgenius.webm"));
console.log("recorded", path.join(out, "draftgenius.webm"));
