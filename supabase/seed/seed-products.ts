// Uploads the launch catalog's deliverable files + cover images to
// Supabase Storage and inserts/updates their product rows. Run with
// `npm run seed` after the database migration has been applied and
// .env.local has real Supabase credentials (including
// SUPABASE_SERVICE_ROLE_KEY).
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
const COVERS_DIR = path.join(__dirname, "../../content/covers");

// Standard prices. AI Digital Products and Courses are unified at one
// price point (set by the store owner); Couple Games have their own
// separate standard. New products should default to these unless told
// otherwise — don't invent one-off prices.
const AI_PRICE_AED = 32;
const AI_PRICE_EGP = 450;
const GAME_PRICE_AED = 24.99;
const GAME_PRICE_EGP = 351;

// All product names/descriptions are Arabic-only, in both the _en and _ar
// columns — the site UI (nav, buttons) stays bilingual, but the products
// themselves are an Arabic-only catalog.
const catalog = [
  {
    slug: "ai-prompt-pack-productivity",
    category: "ai_products",
    file: "ai-prompt-pack-productivity.pdf",
    cover: "ai-prompt-pack-productivity.jpg",
    title: "30 برومبت ذكاء اصطناعي للعمل والإنتاجية",
    description:
      "حزمة من 30 برومبت جاهز للنسخ واللصق لكتابة الإيميلات، تلخيص الاجتماعات، التخطيط، والبحث اليومي. كل برومبت مصمم لموقف محدد ومتكرر يواجهه أي شخص في عمله، مع نصيحة عملية لكل واحد لتحصل على أفضل نتيجة من أول محاولة.",
    price_aed: AI_PRICE_AED,
    price_egp: AI_PRICE_EGP,
  },
  {
    slug: "beginners-guide-to-ai",
    category: "ai_products",
    file: "beginners-guide-to-ai.pdf",
    cover: "beginners-guide-to-ai.jpg",
    title: "دليل المبتدئين لاستخدام الذكاء الاصطناعي يوميًا",
    description:
      "دليل عملي من 8 أقسام يشرح كيف تستخدم مساعد الذكاء الاصطناعي في حياتك اليومية بثقة — من فهم كيف يعمل فعليًا، إلى العادات التي تصنع فرقًا حقيقيًا في جودة إجاباته، وصولًا إلى قائمة تحقق عملية لأسبوعك الأول.",
    price_aed: AI_PRICE_AED,
    price_egp: AI_PRICE_EGP,
  },
  {
    slug: "prompting-101-course",
    category: "courses",
    file: "prompting-101-course.pdf",
    cover: "prompting-101-course.jpg",
    title: "أساسيات البرومبت: دورة عملية شاملة",
    description:
      "دورة شاملة من 10 وحدات (أكثر من 24 صفحة) تأخذك من الأساسيات إلى تقنيات متقدمة كسلاسل البرومبت وتقييم الإجابات. كل وحدة تتضمن شرحًا مفصلًا، مثالًا عمليًا كاملًا ببرومبت حقيقي ونموذج رد، وتمرينًا تطبيقيًا لترسيخ ما تعلمته.",
    price_aed: AI_PRICE_AED,
    price_egp: AI_PRICE_EGP,
  },
  {
    slug: "professional-visual-prompts",
    category: "ai_products",
    file: "professional-visual-prompts.pdf",
    cover: "professional-visual-prompts.jpg",
    title: "برومبتات احترافية لتوليد وتعديل الصور والفيديو",
    description:
      "أكثر من 30 برومبتًا بمواصفات استوديو حقيقية — إضاءة، عدسات، تدرجات لونية — لتوليد وتعديل الصور والفيديو بجودة استوديوهات الإنتاج. مقسّمة على 6 محاور: تصوير المنتجات، البورتريه والأزياء، المشاهد السينمائية، تعديل الصور، وتوليد وتحرير الفيديو.",
    price_aed: AI_PRICE_AED,
    price_egp: AI_PRICE_EGP,
  },
  {
    slug: "netaarafu-aktar",
    category: "couple_games",
    file: "netaarafu-aktar.pdf",
    cover: "netaarafu-aktar.jpg",
    title: "نتعرف اكثر",
    description:
      "40 سؤالًا مصممة لتقرّب بينكما أكثر — من ذكريات البدايات إلى الأحلام المشتركة. كل سؤال في شريحة واحدة بتصميم رومانسي أنيق، جاهزة للعرض على الهاتف أو الكمبيوتر في ليلة هادئة معًا.",
    price_aed: GAME_PRICE_AED,
    price_egp: GAME_PRICE_EGP,
  },
];

// The old bilingual English deck is retired — hide it rather than delete it.
const retiredSlugs = ["date-night-deck"];

async function main() {
  const { data: categories, error: categoriesError } = await supabase.from("categories").select("id, slug");
  if (categoriesError) throw categoriesError;
  const categoryIdBySlug = new Map((categories ?? []).map((c) => [c.slug, c.id]));

  for (const slug of retiredSlugs) {
    const { error } = await supabase.from("products").update({ status: "draft" }).eq("slug", slug);
    if (error) console.error(`Failed to retire ${slug}:`, error.message);
    else console.log(`Retired (set to draft): ${slug}`);
  }

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
          title_en: item.title,
          title_ar: item.title,
          description_en: item.description,
          description_ar: item.description,
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

    // Deliverable file
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

    // Cover image (public bucket) — storage path doubles as cover_image_path
    const coverPath = path.join(COVERS_DIR, item.cover);
    const coverBuffer = readFileSync(coverPath);
    const { error: coverUploadError } = await supabase.storage
      .from("product-covers")
      .upload(item.cover, coverBuffer, { contentType: "image/jpeg", upsert: true });
    if (coverUploadError) {
      console.error(`Failed to upload cover for ${item.slug}:`, coverUploadError.message);
    } else {
      const { error: coverColError } = await supabase
        .from("products")
        .update({ cover_image_path: item.cover })
        .eq("id", product.id);
      if (coverColError) console.error(`Failed to set cover_image_path for ${item.slug}:`, coverColError.message);
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
