export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// The Stripe account behind this site is UAE-registered but, like any
// Stripe account, can charge cards from anywhere — payout currency (AED,
// to the UAE bank account) is separate from what a buyer is charged. So
// every Arab League country except Egypt checks out through the same
// Stripe/AED flow; Egypt has no Stripe merchant support there, hence the
// separate manual InstaPay/EGP path.
//
// Note: Stripe's own compliance rules exclude Syria and Sudan from card
// processing regardless of this list (OFAC-sanctioned), so those two will
// still fail at Stripe's end even though they're listed here for pricing.
export const countries = [
  "AE",
  "SA",
  "KW",
  "QA",
  "BH",
  "OM",
  "JO",
  "LB",
  "IQ",
  "SY",
  "YE",
  "SD",
  "LY",
  "TN",
  "DZ",
  "MA",
  "MR",
  "SO",
  "DJ",
  "KM",
  "PS",
  "EG",
] as const;
export type CountryCode = (typeof countries)[number];

export const countryMeta: Record<CountryCode, { currency: "AED" | "EGP"; label: Record<Locale, string> }> = {
  AE: { currency: "AED", label: { en: "United Arab Emirates", ar: "الإمارات العربية المتحدة" } },
  SA: { currency: "AED", label: { en: "Saudi Arabia", ar: "المملكة العربية السعودية" } },
  KW: { currency: "AED", label: { en: "Kuwait", ar: "الكويت" } },
  QA: { currency: "AED", label: { en: "Qatar", ar: "قطر" } },
  BH: { currency: "AED", label: { en: "Bahrain", ar: "البحرين" } },
  OM: { currency: "AED", label: { en: "Oman", ar: "عُمان" } },
  JO: { currency: "AED", label: { en: "Jordan", ar: "الأردن" } },
  LB: { currency: "AED", label: { en: "Lebanon", ar: "لبنان" } },
  IQ: { currency: "AED", label: { en: "Iraq", ar: "العراق" } },
  SY: { currency: "AED", label: { en: "Syria", ar: "سوريا" } },
  YE: { currency: "AED", label: { en: "Yemen", ar: "اليمن" } },
  SD: { currency: "AED", label: { en: "Sudan", ar: "السودان" } },
  LY: { currency: "AED", label: { en: "Libya", ar: "ليبيا" } },
  TN: { currency: "AED", label: { en: "Tunisia", ar: "تونس" } },
  DZ: { currency: "AED", label: { en: "Algeria", ar: "الجزائر" } },
  MA: { currency: "AED", label: { en: "Morocco", ar: "المغرب" } },
  MR: { currency: "AED", label: { en: "Mauritania", ar: "موريتانيا" } },
  SO: { currency: "AED", label: { en: "Somalia", ar: "الصومال" } },
  DJ: { currency: "AED", label: { en: "Djibouti", ar: "جيبوتي" } },
  KM: { currency: "AED", label: { en: "Comoros", ar: "جزر القمر" } },
  PS: { currency: "AED", label: { en: "Palestine", ar: "فلسطين" } },
  EG: { currency: "EGP", label: { en: "Egypt", ar: "مصر" } },
};

export function paymentMethodFor(country: CountryCode): "stripe" | "instapay" {
  return countryMeta[country].currency === "EGP" ? "instapay" : "stripe";
}

export function defaultCountryForLocale(locale: Locale): CountryCode {
  return locale === "ar" ? "EG" : "AE";
}
