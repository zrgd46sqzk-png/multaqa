import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../../content/video");
mkdirSync(outDir, { recursive: true });

const SITE = "https://multaqa-ruddy.vercel.app";
const VIEWPORT = { width: 430, height: 932 }; // iPhone-ish, triggers mobile layout

async function safeEvaluate(page, fn, arg) {
  for (let i = 0; i < 3; i++) {
    try {
      return await page.evaluate(fn, arg);
    } catch (err) {
      if (!String(err.message).includes("context was destroyed") || i === 2) throw err;
      await page.waitForTimeout(400);
    }
  }
}

async function overlay(page, text, sub, ms) {
  await safeEvaluate(
    page,
    ({ text, sub }) => {
      const el = document.createElement("div");
      el.id = "__promo_overlay";
      el.style.cssText = `
        position: fixed; inset: 0; z-index: 999999;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        background: rgba(20,17,15,0.82); color: #faf6f0; text-align: center; padding: 40px;
        font-family: 'Cairo', 'Segoe UI', sans-serif; opacity: 0; transition: opacity 0.5s ease;
      `;
      const h = document.createElement("div");
      h.textContent = text;
      h.style.cssText = "font-size: 30px; font-weight: 800; margin-bottom: 14px; line-height: 1.4;";
      const p = document.createElement("div");
      p.textContent = sub || "";
      p.style.cssText = "font-size: 16px; color: #d9a869; font-weight: 600;";
      el.appendChild(h);
      if (sub) el.appendChild(p);
      document.body.appendChild(el);
      requestAnimationFrame(() => (el.style.opacity = "1"));
    },
    { text, sub }
  );
  await page.waitForTimeout(ms);
}

async function removeOverlay(page) {
  await safeEvaluate(page, () => {
    const el = document.getElementById("__promo_overlay");
    if (el) {
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 500);
    }
  });
  await page.waitForTimeout(500);
}

async function gotoRetry(page, url, retries = 6) {
  for (let i = 0; i < retries; i++) {
    try {
      await page.goto(url, { waitUntil: "load", timeout: 30000 });
      await page.waitForSelector("text=ملتقى", { timeout: 8000 });
      return;
    } catch (err) {
      if (i === retries - 1) throw err;
      await page.waitForTimeout(2000);
    }
  }
}

async function smoothScroll(page, distance, steps, stepDelay) {
  const perStep = distance / steps;
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, perStep);
    await page.waitForTimeout(stepDelay);
  }
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

// Warm up the connection to the site on a throwaway, UNRECORDED page first.
// The proxy path in this sandbox is intermittently flaky, and a single
// page.goto() failure can take Chromium several seconds of internal
// retries before it gives up — all of which would otherwise be captured
// on camera. Looping here until it succeeds means the actual recorded
// navigation lands on an already-known-good path.
const warmupContext = await browser.newContext({ ignoreHTTPSErrors: true });
const warmupPage = await warmupContext.newPage();
for (let i = 0; i < 15; i++) {
  try {
    await warmupPage.goto(`${SITE}/ar`, { waitUntil: "load", timeout: 15000 });
    await warmupPage.waitForSelector("text=ملتقى", { timeout: 8000 });
    break;
  } catch {
    await warmupPage.waitForTimeout(1500);
  }
}
await warmupContext.close();

const context = await browser.newContext({
  viewport: VIEWPORT,
  recordVideo: { dir: outDir, size: VIEWPORT },
  locale: "ar-EG",
  ignoreHTTPSErrors: true,
});
const page = await context.newPage();

// 1) ONE real network navigation for the whole video — everything after
// this uses in-app link clicks (Next.js client-side routing), which stay
// on the already-loaded page and don't risk a fresh top-level navigation
// failing mid-recording and flashing the browser's own error page.
await gotoRetry(page, `${SITE}/ar`);
await page.waitForTimeout(600);
await overlay(page, "ملتقى", "كل شي في مكان واحد", 2200);
await removeOverlay(page);
await page.waitForTimeout(400);

// 2) Scroll through categories + products on the home page
await smoothScroll(page, 500, 14, 90);
await page.waitForTimeout(900);
await smoothScroll(page, 700, 16, 90);
await page.waitForTimeout(1000);

// 3) Click into a course product (client-side nav). Clicking by href via a
// direct DOM .click() call is far more reliable than clicking on visible
// text/coordinates — no risk of an overlapping element intercepting the
// pointer event, since this calls the anchor's own click handler directly.
async function settle(page) {
  await page.waitForLoadState("load").catch(() => {});
  await page.waitForTimeout(900);
}

async function clickHref(page, href) {
  await safeEvaluate(page, (href) => {
    const link = document.querySelector(`a[href="${href}"]`);
    link?.scrollIntoView({ block: "center" });
  }, href);
  await page.waitForTimeout(400);
  await safeEvaluate(page, (href) => {
    document.querySelector(`a[href="${href}"]`)?.click();
  }, href);
}

await clickHref(page, "/ar/product/ai-marketing-course");
await settle(page);
await smoothScroll(page, 300, 10, 90);
await page.waitForTimeout(1200);

// 4) Back to home via the logo, then into the couple's game category
await clickHref(page, "/ar");
await settle(page);
await clickHref(page, "/ar/category/couple_games");
await settle(page);
await smoothScroll(page, 300, 10, 90);
await page.waitForTimeout(800);

// 5) Open the romantic game product (visually distinct cover)
await clickHref(page, "/ar/product/netaarafu-aktar");
await settle(page);
await page.waitForTimeout(500);
await overlay(page, "منتجات رقمية، دورات، وألعاب للأزواج", "كلها بالعربي، جاهزة للتحميل فورًا", 2400);
await removeOverlay(page);
await page.waitForTimeout(400);

// 6) Closing CTA
await overlay(page, "تسوّق الآن", "ملتقى", 2400);

await context.close();
await browser.close();

console.log("Recording saved in", outDir);
