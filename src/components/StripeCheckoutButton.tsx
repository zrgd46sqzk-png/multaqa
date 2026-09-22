"use client";

import { useState } from "react";
import type { CountryCode, Locale } from "@/lib/i18n/config";

export function StripeCheckoutButton({
  productSlug,
  locale,
  country,
  label,
  couponCode,
}: {
  productSlug: string;
  locale: Locale;
  country: CountryCode;
  label: string;
  couponCode?: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, locale, country, couponCode: couponCode || undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Could not start checkout");
      }
      window.location.href = data.url;
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="rounded-full bg-ink px-6 py-3 font-semibold text-sand hover:bg-ink/90 disabled:opacity-60"
      >
        {loading ? "…" : label}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
