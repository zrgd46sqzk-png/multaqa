"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    const rest = pathname.replace(/^\/(en|ar)/, "");
    router.push(`/${next}${rest || ""}`);
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => switchTo("en")}
        className={`rounded px-2 py-1 ${locale === "en" ? "bg-ink text-sand" : "text-ink/70 hover:text-ink"}`}
      >
        EN
      </button>
      <button
        onClick={() => switchTo("ar")}
        className={`rounded px-2 py-1 ${locale === "ar" ? "bg-ink text-sand" : "text-ink/70 hover:text-ink"}`}
      >
        AR
      </button>
    </div>
  );
}
