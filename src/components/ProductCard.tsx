import Image from "next/image";
import Link from "next/link";
import type { CountryCode, Locale } from "@/lib/i18n/config";
import { coverUrl } from "@/lib/coverUrl";
import { formatPrice, priceFor } from "@/lib/price";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  locale,
  country,
}: {
  product: Product;
  locale: Locale;
  country: CountryCode;
}) {
  const title = locale === "ar" ? product.title_ar : product.title_en;
  const description = locale === "ar" ? product.description_ar : product.description_en;
  const { amount, currency } = priceFor(product, country);
  const cover = coverUrl(product.cover_image_path);

  return (
    <Link
      href={`/${locale}/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink">
        {cover && (
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-semibold text-ink group-hover:text-brassDark">{title}</h3>
        <p className="line-clamp-2 flex-1 text-sm text-ink/70">{description}</p>
        <p className="pt-2 text-brassDark font-semibold">{formatPrice(amount, currency, locale)}</p>
      </div>
    </Link>
  );
}
