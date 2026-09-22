import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import type { CategorySlug } from "@/lib/types";
import { getCategoryBySlug, getPublishedProducts } from "@/lib/data";
import { getCountry } from "@/lib/country";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ProductCard } from "@/components/ProductCard";

const VALID_SLUGS: CategorySlug[] = ["ai_products", "courses", "couple_games"];

export default async function CategoryPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale) || !VALID_SLUGS.includes(params.slug as CategorySlug)) notFound();
  const locale = params.locale as Locale;
  const slug = params.slug as CategorySlug;
  const dict = getDictionary(locale);
  const country = getCountry(locale);

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const products = await getPublishedProducts(slug);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">{locale === "ar" ? category.name_ar : category.name_en}</h1>
      {products.length === 0 ? (
        <p className="text-ink/60">—</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} country={country} />
          ))}
        </div>
      )}
    </div>
  );
}
