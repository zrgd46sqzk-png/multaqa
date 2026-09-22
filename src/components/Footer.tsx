import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <footer className="mt-16 border-t border-line py-8 text-center text-sm text-ink/60">
      <p>
        {dict.siteName} — {new Date().getFullYear()}. {dict.footer.rights}
      </p>
      {WHATSAPP_NUMBER && (
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-brassDark underline"
        >
          {dict.footer.whatsapp}
        </a>
      )}
    </footer>
  );
}
