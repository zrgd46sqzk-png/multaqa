import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const css = readFileSync(path.join(__dirname, "style.css"), "utf8");
const outDir = path.join(__dirname, "../../content/covers");
mkdirSync(outDir, { recursive: true });

const covers = [
  {
    slug: "ai-prompt-pack-productivity",
    rose: false,
    kicker: "ملتقى · منتجات رقمية بالذكاء الاصطناعي",
    title: "30 برومبت ذكاء اصطناعي<br/>للعمل والإنتاجية",
    sub: "برومبتات جاهزة للنسخ واللصق للإيميلات، الاجتماعات، التخطيط والبحث.",
  },
  {
    slug: "beginners-guide-to-ai",
    rose: false,
    kicker: "ملتقى · منتجات رقمية بالذكاء الاصطناعي",
    title: "دليل المبتدئين<br/>لاستخدام الذكاء الاصطناعي يوميًا",
    sub: "دليل عملي وقصير للحصول على فائدة حقيقية ويومية من الذكاء الاصطناعي.",
  },
  {
    slug: "prompting-101-course",
    rose: false,
    kicker: "ملتقى · دورات",
    title: "أساسيات البرومبت<br/>دورة عملية شاملة",
    sub: "10 وحدات مع أمثلة عملية كاملة وتمارين — أكثر من 20 صفحة.",
  },
  {
    slug: "netaarafu-aktar",
    rose: true,
    kicker: "ملتقى · ألعاب للأزواج",
    title: "نتعرف اكثر",
    sub: "40 سؤالًا لتقربكما من بعض أكثر، سؤال واحد في كل شريحة.",
  },
];

function thumbPage(c) {
  const cls = c.rose ? "thumb thumb-rose" : "thumb";
  return `<!doctype html>
  <html lang="ar" dir="rtl">
  <head><meta charset="utf-8" /><style>${css}</style></head>
  <body class="rtl" style="margin:0">
    <div class="${cls}">
      <div class="thumb-frame"></div>
      <div class="kicker">${c.kicker}</div>
      <h1>${c.title}</h1>
      <p>${c.sub}</p>
      <div class="brand">ملتقى — Multaqa</div>
    </div>
  </body>
  </html>`;
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });

for (const c of covers) {
  await page.setContent(thumbPage(c), { waitUntil: "networkidle" });
  const outPath = path.join(outDir, `${c.slug}.jpg`);
  await page.screenshot({ path: outPath, type: "jpeg", quality: 90 });
  console.log(`Wrote ${outPath}`);
}

await browser.close();
