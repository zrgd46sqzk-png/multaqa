import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getProductBySlug } from "@/lib/data";
import { getCountry } from "@/lib/country";
import { coverUrl } from "@/lib/coverUrl";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatPrice, priceFor } from "@/lib/price";
import { SITE_URL } from "@/lib/constants";
import { ShareButton } from "@/components/ShareButton";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  const title = locale === "ar" ? product.title_ar : product.title_en;
  const description = locale === "ar" ? product.description_ar : product.description_en;
  const cover = coverUrl(product.cover_image_path);
  const url = `${SITE_URL}/${locale}/product/${product.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Multaqa — ملتقى",
      locale: locale === "ar" ? "ar_AR" : "en_US",
      images: cover ? [{ url: cover, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: cover ? [cover] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const country = getCountry(locale);

  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const title = locale === "ar" ? product.title_ar : product.title_en;
  const description = locale === "ar" ? product.description_ar : product.description_en;
  const { amount, currency } = priceFor(product, country);
  const cover = coverUrl(product.cover_image_path);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink">
        {cover && (
          <Image src={cover} alt={title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain" />
        )}
      </div>

      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="whitespace-pre-line text-ink/75">{description}</p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-ink/60">
            <span className="inline-block h-2 w-2 rounded-full bg-brass" />
            {dict.product.instantDownload}
          </div>
          <ShareButton title={title} url={`${SITE_URL}/${locale}/product/${product.slug}`} label={dict.product.share} copiedLabel={dict.product.shareCopied} />
        </div>

        <div className="mt-2 rounded-2xl border border-line bg-white p-6">
          <p className="text-sm text-ink/60">{dict.product.priceFrom}</p>
          <p className="text-3xl font-bold text-brassDark">{formatPrice(amount, currency, locale)}</p>
          <Link
            href={`/${locale}/checkout/${product.slug}`}
            className="mt-4 block rounded-full bg-ink px-6 py-3 text-center font-semibold text-sand hover:bg-ink/90"
          >
            {dict.product.buyNow}
          </Link>
        </div>
      </div>
    </div>
  );
}
