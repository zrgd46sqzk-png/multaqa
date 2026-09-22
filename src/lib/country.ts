import { cookies } from "next/headers";
import { countries, defaultCountryForLocale, type CountryCode, type Locale } from "@/lib/i18n/config";
import { COUNTRY_COOKIE } from "@/lib/constants";

export function getCountry(locale: Locale): CountryCode {
  const value = cookies().get(COUNTRY_COOKIE)?.value;
  if (value && (countries as readonly string[]).includes(value)) {
    return value as CountryCode;
  }
  return defaultCountryForLocale(locale);
}
