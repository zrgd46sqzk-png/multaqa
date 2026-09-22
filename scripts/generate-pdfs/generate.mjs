import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "playwright";
import { promptsHtml } from "./content/prompts.mjs";
import { guideHtml } from "./content/guide.mjs";
import { courseHtml } from "./content/course.mjs";
import { couplesHtml } from "./content/couples.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const css = readFileSync(path.join(__dirname, "style.css"), "utf8");
const outDir = path.join(__dirname, "../../content/products");
mkdirSync(outDir, { recursive: true });

const documents = [
  { slug: "ai-prompt-pack-productivity", title: "30 AI Prompts for Work & Productivity", html: promptsHtml() },
  { slug: "beginners-guide-to-ai", title: "The Beginner's Guide to Using AI Every Day", html: guideHtml() },
  { slug: "prompting-101-course", title: "Prompting 101: A Practical Course", html: courseHtml() },
  { slug: "date-night-deck", title: "Date Night Deck: 80 Questions & Challenges", html: couplesHtml() },
];

function fullPage(title, bodyHtml) {
  return `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>${css}</style>
  </head>
  <body>${bodyHtml}</body>
  </html>`;
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage();

for (const doc of documents) {
  const html = fullPage(doc.title, doc.html);
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

await browser.close();
