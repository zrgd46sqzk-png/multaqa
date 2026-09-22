import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Every page here reads auth/session cookies (Header) and the country
// cookie (pricing), and hits Supabase live — never statically cache these.
export const dynamic = "force-dynamic";

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div lang={locale} dir={dir} className={locale === "ar" ? "font-arabic" : "font-sans"}>
      <Header locale={locale} />
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
