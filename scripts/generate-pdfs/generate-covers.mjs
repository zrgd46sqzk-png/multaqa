import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "playwright";
import { promptsHtml } from "./content/prompts.mjs";
import { guideHtml } from "./content/guide.mjs";
import { courseHtml } from "./content/course.mjs";
import { couplesHtml } from "./content/couples.mjs";
import { visualPromptsHtml } from "./content/visualPrompts.mjs";
import { dareAndHonestyHtml } from "./content/dareAndHonesty.mjs";
import { breakRoutineHtml } from "./content/breakRoutine.mjs";
import { firstDateHtml } from "./content/firstDate.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const css = readFileSync(path.join(__dirname, "style.css"), "utf8");
const outDir = path.join(__dirname, "../../content/covers");
mkdirSync(outDir, { recursive: true });

// These covers are literal screenshots of each file's actual first
// page/slide (same markup used inside the real PDF) — not a separate
// redesign. "page" documents are portrait A4 covers; "slide" is the
// landscape 16:9 first slide of the game deck.
const items = [
  { slug: "ai-prompt-pack-productivity", type: "page", html: promptsHtml() },
  { slug: "beginners-guide-to-ai", type: "page", html: guideHtml() },
  { slug: "prompting-101-course", type: "page", html: courseHtml() },
  { slug: "professional-visual-prompts", type: "page", html: visualPromptsHtml() },
  { slug: "netaarafu-aktar", type: "slide", html: couplesHtml() },
  { slug: "jaraa-wa-sarahah", type: "slide", html: dareAndHonestyHtml() },
  { slug: "kasr-al-rotine", type: "slide", html: breakRoutineHtml() },
  { slug: "awal-maweed", type: "slide", html: firstDateHtml() },
];

function fullPage(bodyHtml, bodyClass) {
  return `<!doctype html>
  <html lang="ar" dir="rtl">
  <head><meta charset="utf-8" /><style>${css}</style></head>
  <body class="${bodyClass}" style="margin:0">${bodyHtml}</body>
  </html>`;
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

for (const item of items) {
  const viewport =
    item.type === "slide" ? { width: 1280, height: 720 } : { width: 1240, height: 1754 };
  const page = await browser.newPage({ viewport });
  const html = fullPage(item.html, item.type === "page" ? "rtl" : "");
  await page.setContent(html, { waitUntil: "networkidle" });
  const selector = item.type === "slide" ? ".slide" : ".cover";
  const el = await page.$(selector);
  const outPath = path.join(outDir, `${item.slug}.jpg`);
  await el.screenshot({ path: outPath, type: "jpeg", quality: 92 });
  console.log(`Wrote ${outPath} (${item.type})`);
  await page.close();
}

await browser.close();
