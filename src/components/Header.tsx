import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCountry } from "@/lib/country";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { CountrySwitcher } from "@/components/CountrySwitcher";

export async function Header({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const country = getCountry(locale);
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-line bg-sand/95 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href={`/${locale}`} className="text-xl font-semibold tracking-tight text-brassDark">
          {dict.siteName}
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm text-ink/80">
          <Link href={`/${locale}/category/ai_products`} className="hover:text-ink">
            {dict.nav.categories.ai_products}
          </Link>
          <Link href={`/${locale}/category/courses`} className="hover:text-ink">
            {dict.nav.categories.courses}
          </Link>
          <Link href={`/${locale}/category/couple_games`} className="hover:text-ink">
            {dict.nav.categories.couple_games}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <CountrySwitcher country={country} locale={locale} dict={dict} />
          <LocaleSwitcher locale={locale} />
          <Link
            href={user ? `/${locale}/account` : `/${locale}/account/login`}
            className="rounded-full border border-brass px-3 py-1.5 text-sm font-medium text-brassDark hover:bg-brass/10"
          >
            {user ? dict.nav.account : dict.nav.login}
          </Link>
        </div>
      </div>
    </header>
  );
}
