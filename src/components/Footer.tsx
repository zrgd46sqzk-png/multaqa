import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <footer className="mt-16 border-t border-line py-8 text-center text-sm text-ink/60">
      <p>
        {dict.siteName} — {new Date().getFullYear()}. {dict.footer.rights}
      </p>
    </footer>
  );
}
