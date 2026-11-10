// Records the LIVE PakWarera site (Discord OAuth) in two phases so credentials are never captured:
//   1. a visible, NON-recording Chrome window where the owner logs in with Discord
//   2. a fresh recording context that reuses the saved session and visits only the market pages
// Usage: node scripts/record-pakwarera.mjs <stateFile> <outDir> [probe]
//   If <stateFile> already exists the login phase is skipped (session cookies are reused).
//   probe -> screenshots only (no video), to choose pages / check for personal data.
import { chromium } from "playwright";
import { existsSync, mkdirSync, readdirSync, renameSync } from "node:fs";
import path from "node:path";

const [stateFile, out = "pw-rec", mode] = process.argv.slice(2);
const base = "https://pakwarera.azurewebsites.net";
mkdirSync(out, { recursive: true });
const probe = mode === "probe";

if (!existsSync(stateFile)) {
  const b = await chromium.launch({ channel: "chrome", headless: false });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(base + "/login");
  console.log("LOGIN_WINDOW_OPEN: please log in with Discord in the Chrome window (waiting up to 10 minutes)...");
  await page.waitForURL((u) => u.origin === base && !/^\/(login|auth)/.test(u.pathname), { timeout: 600000 });
  await page.waitForTimeout(2500);
  console.log("LOGIN_DETECTED:", new URL(page.url()).pathname);
  await ctx.storageState({ path: stateFile });
  await b.close();
}

const browser = await chromium.launch({ channel: "chrome" });

// The prediction models retrain after every restart; wait (without recording) until forecasts exist.
if (!probe) {
  const waitCtx = await browser.newContext({ viewport: { width: 1280, height: 720 }, storageState: stateFile });
  const wp = await waitCtx.newPage();
  for (let i = 0; i < 30; i++) {
    await wp.goto(base + "/trading/predictions", { waitUntil: "networkidle" }).catch(() => {});
    await wp.waitForTimeout(2500);
    const txt = await wp.locator("body").innerText();
    if (!/No predictions yet|fitting in background/i.test(txt)) { console.log("PREDICTIONS_READY after", i * 30, "s"); break; }
    console.log("waiting for predictions...", i);
    await wp.waitForTimeout(27000);
  }
  await waitCtx.close();
}

const ctx = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  storageState: stateFile,
  ...(probe ? {} : { recordVideo: { dir: out, size: { width: 1280, height: 720 } } }),
});
const page = await ctx.newPage();
const pause = (ms) => page.waitForTimeout(ms);
const scroll = async (dy, steps = 8) => { for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, dy / steps); await pause(170); } };

const pages = [
  ["dashboard", "/trading/dashboard", 700],
  ["market-depth", "/trading/market-depth", 500],
  ["analytics", "/trading/analytics", 700],
  ["predictions", "/trading/predictions", 700],
];
try {
  for (const [name, route, dy] of pages) {
    await page.goto(base + route, { waitUntil: "networkidle" }).catch(() => {});
    await pause(2200);
    const later = page.getByRole("button", { name: /maybe later/i });
    if (await later.isVisible().catch(() => false)) { await later.click(); await pause(700); }
    await pause(600);
    if (probe) { await page.screenshot({ path: path.join(out, name + ".png") }); continue; }
    await scroll(dy, 8);
    await pause(1300);
    await page.mouse.wheel(0, -3000);
    await pause(900);
  }
} finally {
  await ctx.close();
  await browser.close();
}
if (!probe) {
  const f = readdirSync(out).find((x) => x.endsWith(".webm"));
  if (f) renameSync(path.join(out, f), path.join(out, "pakwarera.webm"));
  console.log("recorded", path.join(out, "pakwarera.webm"));
}
