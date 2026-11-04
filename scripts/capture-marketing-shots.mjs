/**
 * Capture clean office/field screenshots for the marketing site.
 * Usage: node scripts/capture-marketing-shots.mjs
 * Requires local server on :3000 and demo user (npm run db:seed:demo).
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const BASE = process.env.SHOT_BASE_URL ?? "http://127.0.0.1:3000";
const EMAIL = process.env.DEMO_EMAIL ?? "demo@metertron.local";
const PASSWORD = process.env.DEMO_PASSWORD ?? "demo-password-change-me";
const OUT = path.resolve("public/images/marketing/screenshots");
const CHROME =
  process.env.CHROME_PATH ??
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

fs.mkdirSync(OUT, { recursive: true });

async function hideChrome(page) {
  await page.addStyleTag({
    content: `nextjs-portal,[data-nextjs-toast],[data-nextjs-dev-overlay],#__next-build-watcher{display:none!important}`,
  });
}

async function shot(page, name) {
  await hideChrome(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, type: "png" });
  console.log("wrote", name);
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    defaultViewport: null,
    args: ["--hide-scrollbars", "--disable-gpu"],
  });

  try {
    const page = await browser.newPage();

    // Desktop office shots
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(`${BASE}/login`, { waitUntil: "networkidle2", timeout: 60000 });
    await page.type('input[name="email"], input[type="email"], #email, input[autocomplete="email"]', EMAIL, { delay: 10 });
    // Prefer labeled fields from the login form
    const emailBox = await page.$('input[type="email"]') ?? (await page.$('input[name="email"]'));
    const passBox = await page.$('input[type="password"]');
    if (!emailBox || !passBox) throw new Error("Login fields not found");
    await emailBox.click({ clickCount: 3 });
    await emailBox.type(EMAIL, { delay: 5 });
    await passBox.click({ clickCount: 3 });
    await passBox.type(PASSWORD, { delay: 5 });
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 }),
      page.click('button[type="submit"]'),
    ]);

    await page.goto(`${BASE}/office`, { waitUntil: "networkidle2", timeout: 60000 });
    await page.waitForSelector("h1", { timeout: 30000 });
    await shot(page, "office-dashboard.png");

    await page.goto(`${BASE}/office/review`, { waitUntil: "networkidle2", timeout: 60000 });
    await page.waitForSelector("h1", { timeout: 30000 });
    await shot(page, "office-review.png");

    await page.goto(`${BASE}/office/exports`, { waitUntil: "networkidle2", timeout: 60000 });
    await page.waitForSelector("h1", { timeout: 30000 });
    await shot(page, "office-exports.png");

    // Field mobile shots
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    await page.goto(`${BASE}/field`, { waitUntil: "networkidle2", timeout: 60000 });
    await page.waitForFunction(() => !document.body.innerText.includes("Loading your jobs"), { timeout: 30000 });
    await shot(page, "field-jobs.png");

    // Open or start a capture draft
    const openLink = await page.$('a[href^="/field/capture"]');
    if (openLink) {
      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle2" }), openLink.click()]);
    } else {
      const start = await page.$("button");
      // Prefer the primary start button by text
      const started = await page.evaluate(() => {
        const btn = [...document.querySelectorAll("button")].find((b) => /start a capture/i.test(b.textContent || ""));
        if (!btn) return false;
        btn.click();
        return true;
      });
      if (started) await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 });
      else await page.goto(`${BASE}/field/capture`, { waitUntil: "networkidle2", timeout: 60000 });
    }

    await page.waitForFunction(() => document.body.innerText.includes("Step"), { timeout: 30000 });
    // Fill a bit so the form looks alive
    await page.evaluate(() => {
      const selects = [...document.querySelectorAll("select")];
      if (selects[0]) {
        selects[0].value = "meter_only";
        selects[0].dispatchEvent(new Event("change", { bubbles: true }));
      }
      if (selects[1]) {
        selects[1].value = "domestic";
        selects[1].dispatchEvent(new Event("change", { bubbles: true }));
      }
      const company = [...document.querySelectorAll("input")].find((i) => /company/i.test(i.previousElementSibling?.textContent || i.labels?.[0]?.textContent || ""));
      const job = [...document.querySelectorAll("input")].find((i) => /job number/i.test(i.previousElementSibling?.textContent || i.labels?.[0]?.textContent || ""));
      if (company) {
        company.value = "Demo Contractor";
        company.dispatchEvent(new Event("input", { bubbles: true }));
      }
      if (job) {
        job.value = "J-2048";
        job.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
    await shot(page, "field-capture.png");

    // Photos step
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Photos");
      btn?.click();
    });
    await page.waitForFunction(() => document.body.innerText.includes("Photo of the"), { timeout: 15000 });
    await shot(page, "field-photos.png");
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
