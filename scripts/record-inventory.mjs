// Records a demo of the Inventory Management Tool running locally against SYNTHETIC data.
// Usage: node scripts/record-inventory.mjs <baseUrl> <outDir> [probe]
//   probe  -> only take screenshots of each page (to design the flow)
import { chromium } from "playwright";
import { mkdirSync, readdirSync, renameSync } from "node:fs";
import path from "node:path";

const [base = "http://127.0.0.1:8765", out = "inventory-rec", mode] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const probe = mode === "probe";

const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  ...(probe ? {} : { recordVideo: { dir: out, size: { width: 1280, height: 720 } } }),
});
const page = await ctx.newPage();
const pause = (ms) => page.waitForTimeout(ms);
const shot = async (n) => probe && page.screenshot({ path: path.join(out, n + ".png") });

async function slowScroll(dy, steps = 6) {
  for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, dy / steps); await pause(170); }
}
const nav = async (name) => { await page.getByRole("link", { name }).first().click().catch(() => page.getByText(name, { exact: true }).first().click()); await page.waitForLoadState("networkidle"); await pause(1400); };

// 1. login
await page.goto(base + "/login", { waitUntil: "networkidle" });
await pause(900);
await page.getByLabel("Email address").pressSequentially("admin@demo.shop", { delay: 55 });
await page.getByLabel("Password").pressSequentially("DemoPass!234", { delay: 55 });
await pause(300);
await page.getByRole("button", { name: /sign in|login|log in/i }).click();
await page.waitForLoadState("networkidle");
await pause(1800);

// 2. dashboard: reload so stats load with the stored token, then widen the range
await page.goto(base + "/", { waitUntil: "networkidle" });
await pause(1600);
await page.getByText(/^\s*30 days\s*$/i).first().click();
await pause(1800);
await slowScroll(260, 4);
await pause(1100);
await slowScroll(-260, 4);
await pause(700);
await shot("home");

// 3. inventory: search + scroll
await nav("Inventory");
await page.getByPlaceholder(/Search by name/i).pressSequentially("oil", { delay: 140 });
await pause(1500);
await shot("inventory");
await page.getByPlaceholder(/Search by name/i).fill("");
await pause(900);
await slowScroll(500, 5);
await pause(800);

// 4. checkout by barcode
await nav("Checkout");
for (const code of ["8901001", "8901003", "8901008"]) {
  await page.getByPlaceholder(/Enter barcode/i).pressSequentially(code, { delay: 70 });
  await page.getByRole("button", { name: /^\s*add\s*$/i }).click();
  await pause(900);
}
await page.getByLabel("Customer Name").pressSequentially("Walk-in customer", { delay: 50 });
await page.getByLabel("Customer Phone").pressSequentially("555-0142", { delay: 50 });
await pause(700);
await shot("checkout");
await page.getByRole("button", { name: /complete checkout/i }).click();
await pause(2800); // receipt
await shot("receipt");

// 5. orders + alerts
await nav("Orders");
await slowScroll(400, 4);
await pause(900);
await shot("orders");
await nav("Stock Alerts");
await pause(1800);
await shot("alerts");

await ctx.close();
await browser.close();
if (!probe) {
  const f = readdirSync(out).find((x) => x.endsWith(".webm"));
  if (f) renameSync(path.join(out, f), path.join(out, "inventory.webm"));
  console.log("recorded", path.join(out, "inventory.webm"));
}
