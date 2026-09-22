export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const countries = ["AE", "EG"] as const;
export type CountryCode = (typeof countries)[number];

export const countryMeta: Record<CountryCode, { currency: "AED" | "EGP"; label: Record<Locale, string> }> = {
  AE: { currency: "AED", label: { en: "United Arab Emirates", ar: "الإمارات العربية المتحدة" } },
  EG: { currency: "EGP", label: { en: "Egypt", ar: "مصر" } },
};

export function defaultCountryForLocale(locale: Locale): CountryCode {
  return locale === "ar" ? "EG" : "AE";
}
