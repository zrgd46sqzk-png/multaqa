"use client";

import { useRouter } from "next/navigation";
import { COUNTRY_COOKIE } from "@/lib/constants";
import type { CountryCode, Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function CountrySwitcher({
  country,
  locale,
  dict,
}: {
  country: CountryCode;
  locale: Locale;
  dict: Dictionary;
}) {
  const router = useRouter();

  function setCountry(next: CountryCode) {
    if (next === country) return;
    document.cookie = `${COUNTRY_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  return (
    <label className="flex items-center gap-2 text-sm text-ink/70">
      <span className="hidden sm:inline">{dict.country.label}</span>
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value as CountryCode)}
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="rounded border border-line bg-white px-2 py-1"
      >
        <option value="AE">{dict.country.ae}</option>
        <option value="EG">{dict.country.eg}</option>
      </select>
    </label>
  );
}
