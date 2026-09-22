import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getCategories, getPublishedProducts } from "@/lib/data";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getPublishedProducts()]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({ url: `${SITE_URL}/${locale}`, changeFrequency: "daily", priority: 1 });
    for (const category of categories) {
      entries.push({
        url: `${SITE_URL}/${locale}/category/${category.slug}`,
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
    for (const product of products) {
      entries.push({
        url: `${SITE_URL}/${locale}/product/${product.slug}`,
        lastModified: product.created_at,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
