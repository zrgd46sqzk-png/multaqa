import { countryMeta, type CountryCode } from "@/lib/i18n/config";
import type { Product } from "@/lib/types";

export function priceFor(product: Pick<Product, "price_aed" | "price_egp">, country: CountryCode) {
  const { currency } = countryMeta[country];
  return currency === "AED"
    ? { amount: product.price_aed, currency }
    : { amount: product.price_egp, currency };
}

export function formatPrice(amount: number, currency: "AED" | "EGP", locale: "en" | "ar") {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-AE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
