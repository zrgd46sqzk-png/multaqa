// Uploads the launch catalog's deliverable files to Supabase Storage and
// inserts/updates their product rows. Run with `npm run seed` after the
// database migration has been applied and .env.local has real Supabase
// credentials (including SUPABASE_SERVICE_ROLE_KEY).
import { readFileSync } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Next.js conventionally keeps local secrets in .env.local (not .env);
// dotenv's default `import "dotenv/config"` only reads .env, so load the
// right file explicitly.
loadEnv({ path: path.join(__dirname, "../../.env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PRODUCTS_DIR = path.join(__dirname, "../../content/products");

const catalog = [
  {
    slug: "ai-prompt-pack-productivity",
    category: "ai_products",
    file: "ai-prompt-pack-productivity.pdf",
    title_en: "30 AI Prompts for Work & Productivity",
    title_ar: "30 برومبت ذكاء اصطناعي للعمل والإنتاجية",
    description_en:
      "A copy-paste pack of 30 prompts for email, meetings, planning, and research — each built for a specific, common situation, not a generic template.",
    description_ar:
      "حزمة من 30 برومبت جاهز للنسخ واللصق لكتابة الإيميلات، تلخيص الاجتماعات، التخطيط، والبحث — كل برومبت مصمم لموقف محدد ومتكرر، وليس قالبًا عامًا.",
    price_aed: 15,
    price_egp: 150,
  },
  {
    slug: "beginners-guide-to-ai",
    category: "ai_products",
    file: "beginners-guide-to-ai.pdf",
    title_en: "The Beginner's Guide to Using AI Every Day",
    title_ar: "دليل المبتدئين لاستخدام الذكاء الاصطناعي يوميًا",
    description_en:
      "A short, practical guide to getting real, everyday value out of an AI assistant — no hype, no technical background required.",
    description_ar:
      "دليل عملي وقصير لاستخدام مساعد الذكاء الاصطناعي في حياتك اليومية — بدون مبالغة وبدون الحاجة لخلفية تقنية.",
    price_aed: 20,
    price_egp: 200,
  },
  {
    slug: "prompting-101-course",
    category: "courses",
    file: "prompting-101-course.pdf",
    title_en: "Prompting 101: A Practical Course",
    title_ar: "أساسيات البرومبت: دورة عملية",
    description_en:
      "Five short modules that take you from typing random questions into a chat box to prompting deliberately — with an exercise after each one.",
    description_ar:
      "خمس وحدات قصيرة تأخذك من مجرد كتابة أسئلة عشوائية إلى صياغة برومبت مدروس بعناية — مع تمرين عملي بعد كل وحدة.",
    price_aed: 45,
    price_egp: 450,
  },
  {
    slug: "date-night-deck",
    category: "couple_games",
    file: "date-night-deck.pdf",
    title_en: "Date Night Deck: 80 Questions & Challenges",
    title_ar: "مجموعة ليلة الموعد: 80 سؤالًا وتحديًا",
    description_en:
      "Five rounds for couples — from icebreakers to deep questions, playful challenges, quick-fire choices, and shared memories.",
    description_ar:
      "خمس جولات من الأسئلة والتحديات للأزواج — من كسر الجليد إلى الأسئلة العميقة والتحديات الممتعة والاختيارات السريعة والذكريات المشتركة.",
    price_aed: 25,
    price_egp: 250,
  },
];

async function main() {
  const { data: categories, error: categoriesError } = await supabase.from("categories").select("id, slug");
  if (categoriesError) throw categoriesError;
  const categoryIdBySlug = new Map((categories ?? []).map((c) => [c.slug, c.id]));

  for (const item of catalog) {
    const categoryId = categoryIdBySlug.get(item.category);
    if (!categoryId) {
      console.warn(`Skipping ${item.slug}: category "${item.category}" not found (run the migration first)`);
      continue;
    }

    const { data: product, error: upsertError } = await supabase
      .from("products")
      .upsert(
        {
          slug: item.slug,
          category_id: categoryId,
          title_en: item.title_en,
          title_ar: item.title_ar,
          description_en: item.description_en,
          description_ar: item.description_ar,
          price_aed: item.price_aed,
          price_egp: item.price_egp,
          status: "published",
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (upsertError || !product) {
      console.error(`Failed to upsert ${item.slug}:`, upsertError?.message);
      continue;
    }

    const filePath = path.join(PRODUCTS_DIR, item.file);
    const fileBuffer = readFileSync(filePath);
    const storagePath = `${product.id}/${item.file}`;

    const { error: uploadError } = await supabase.storage
      .from("product-files")
      .upload(storagePath, fileBuffer, { contentType: "application/pdf", upsert: true });
    if (uploadError) {
      console.error(`Failed to upload file for ${item.slug}:`, uploadError.message);
      continue;
    }

    const { data: existingFile } = await supabase
      .from("product_files")
      .select("id")
      .eq("product_id", product.id)
      .maybeSingle();

    if (!existingFile) {
      const { error: fileRowError } = await supabase
        .from("product_files")
        .insert({ product_id: product.id, storage_path: storagePath, label: item.file });
      if (fileRowError) console.error(`Failed to insert product_files row for ${item.slug}:`, fileRowError.message);
    }

    console.log(`Seeded: ${item.slug}`);
  }
}

main()
  .then(() => {
    console.log("Done.");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
