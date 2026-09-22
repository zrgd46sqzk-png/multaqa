import { readFileSync, mkdirSync, unlinkSync, existsSync } from "node:fs";
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
const outDir = path.join(__dirname, "../../content/products");
mkdirSync(outDir, { recursive: true });

// All four products are Arabic-only now. The 3 "page" documents keep the
// A4 portrait magazine layout (RTL); the couple's game is a landscape
// slide deck, one question per slide.
const pageDocuments = [
  { slug: "ai-prompt-pack-productivity", title: "30 برومبت ذكاء اصطناعي للعمل والإنتاجية", html: promptsHtml() },
  { slug: "beginners-guide-to-ai", title: "دليل المبتدئين لاستخدام الذكاء الاصطناعي يوميًا", html: guideHtml() },
  { slug: "prompting-101-course", title: "أساسيات البرومبت: دورة عملية", html: courseHtml() },
  {
    slug: "professional-visual-prompts",
    title: "برومبتات احترافية لتوليد وتعديل الصور والفيديو",
    html: visualPromptsHtml(),
  },
];

const slideDocuments = [
  { slug: "netaarafu-aktar", title: "نتعرف اكثر", html: couplesHtml() },
  { slug: "jaraa-wa-sarahah", title: "جرأة وصراحة", html: dareAndHonestyHtml() },
  { slug: "kasr-al-rotine", title: "كسر الروتين", html: breakRoutineHtml() },
  { slug: "awal-maweed", title: "أول موعد", html: firstDateHtml() },
];

// The old bilingual English deck is retired in favor of "netaarafu-aktar".
const retiredSlug = "date-night-deck";
const retiredPath = path.join(outDir, `${retiredSlug}.pdf`);
if (existsSync(retiredPath)) unlinkSync(retiredPath);

function fullPage(title, bodyHtml, bodyClass) {
  return `<!doctype html>
  <html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>${css}</style>
  </head>
  <body class="${bodyClass}">${bodyHtml}</body>
  </html>`;
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage();

for (const doc of pageDocuments) {
  const html = fullPage(doc.title, doc.html, "rtl");
  await page.setContent(html, { waitUntil: "networkidle" });
  const outPath = path.join(outDir, `${doc.slug}.pdf`);
  await page.pdf({
    path: outPath,
    format: "A4",
    printBackground: true,
    margin: { top: "0", bottom: "0", left: "0", right: "0" },
  });
  console.log(`Wrote ${outPath}`);
}

for (const doc of slideDocuments) {
  const html = fullPage(doc.title, doc.html, "");
  await page.setContent(html, { waitUntil: "networkidle" });
  const outPath = path.join(outDir, `${doc.slug}.pdf`);
  await page.pdf({
    path: outPath,
    width: "1280px",
    height: "720px",
    printBackground: true,
    margin: { top: "0", bottom: "0", left: "0", right: "0" },
  });
  console.log(`Wrote ${outPath}`);
}

await browser.close();
