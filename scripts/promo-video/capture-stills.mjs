import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const framesDir = path.join(__dirname, "frames");
mkdirSync(framesDir, { recursive: true });

const css = readFileSync(path.join(__dirname, "../generate-pdfs/style.css"), "utf8");
const SITE = "https://multaqa-ruddy.vercel.app";

function cardHtml(rose, kicker, title, sub) {
  const cls = rose ? "thumb thumb-rose" : "thumb";
  return `<!doctype html>
  <html lang="ar" dir="rtl">
  <head><meta charset="utf-8" /><style>${css}
    body { margin:0; }
    .thumb { width: 1080px; height: 1920px; padding: 90px; }
  </style></head>
  <body class="rtl">
    <div class="${cls}">
      <div class="thumb-frame"></div>
      <div class="kicker">${kicker}</div>
      <h1 style="font-size:64px">${title}</h1>
      <p style="font-size:22px">${sub}</p>
      <div class="brand">ملتقى — Multaqa</div>
    </div>
  </body>
  </html>`;
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

// 1) Intro + closing cards (pure static render, no network)
const cardPage = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await cardPage.setContent(
  cardHtml(false, "ملتقى", "كل شي في مكان واحد", "منتجات رقمية، دورات، وألعاب للأزواج"),
  { waitUntil: "networkidle" }
);
await cardPage.screenshot({ path: path.join(framesDir, "00-intro.jpg"), type: "jpeg", quality: 92 });

await cardPage.setContent(cardHtml(true, "ملتقى", "تسوّق الآن", "12 منتجًا جاهزًا بالعربي"), {
  waitUntil: "networkidle",
});
await cardPage.screenshot({ path: path.join(framesDir, "99-closing.jpg"), type: "jpeg", quality: 92 });
await cardPage.close();

// 2) One reliable live screenshot of the real homepage (mobile layout)
const sitePage = await browser.newPage({
  viewport: { width: 430, height: 932 },
  ignoreHTTPSErrors: true,
});
for (let i = 0; i < 10; i++) {
  try {
    await sitePage.goto(`${SITE}/ar`, { waitUntil: "load", timeout: 20000 });
    await sitePage.waitForSelector("text=ملتقى", { timeout: 8000 });
    break;
  } catch {
    await sitePage.waitForTimeout(1500);
  }
}
await sitePage.waitForTimeout(500);
await sitePage.screenshot({ path: path.join(framesDir, "01-home.jpg"), type: "jpeg", quality: 92 });
await sitePage.close();

await browser.close();
console.log("Stills captured in", framesDir);
