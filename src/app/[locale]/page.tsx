import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCategories, getPublishedProducts } from "@/lib/data";
import { getCountry } from "@/lib/country";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const country = getCountry(locale);

  const [categories, products] = await Promise.all([getCategories(), getPublishedProducts()]);

  return (
    <div className="flex flex-col gap-14">
      <section className="rounded-3xl bg-ink px-8 py-16 text-center text-sand sm:px-16">
        <h1 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">{dict.home.heroTitle}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sand/80">{dict.home.heroSubtitle}</p>
      </section>

      <section>
        <h2 className="mb-5 text-xl font-semibold">{dict.home.categoriesTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/category/${category.slug}`}
              className="rounded-2xl border border-line bg-white p-6 text-center font-medium hover:border-brass hover:text-brassDark"
            >
              {locale === "ar" ? category.name_ar : category.name_en}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-xl font-semibold">{dict.home.browse}</h2>
        {products.length === 0 ? (
          <p className="text-ink/60">—</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} country={country} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
