"use client";

import { useState } from "react";
import type { CountryCode, Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { formatPrice } from "@/lib/price";
import { StripeCheckoutButton } from "@/components/StripeCheckoutButton";
import { InstapayForm } from "@/components/InstapayForm";

interface AppliedCoupon {
  code: string;
  percentOff: number;
  amount: number;
  currency: "AED" | "EGP";
}

export function CheckoutActions({
  productSlug,
  locale,
  country,
  dict,
  title,
  basePrice,
  paymentMethod,
}: {
  productSlug: string;
  locale: Locale;
  country: CountryCode;
  dict: Dictionary;
  title: string;
  basePrice: { amount: number; currency: "AED" | "EGP" };
  paymentMethod: "stripe" | "instapay";
}) {
  const [couponInput, setCouponInput] = useState("");
  const [applied, setApplied] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const effectivePrice = applied ?? basePrice;

  async function handleApply() {
    if (!couponInput.trim()) return;
    setChecking(true);
    setCouponError(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, productSlug, country }),
      });
      const data = await res.json();
      if (!data.valid) {
        setApplied(null);
        setCouponError(dict.checkout.coupon.invalid);
        return;
      }
      setApplied({ code: data.code, percentOff: data.percentOff, amount: data.amount, currency: data.currency });
    } catch {
      setApplied(null);
      setCouponError(dict.checkout.coupon.invalid);
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-line bg-white p-5">
        <p className="font-medium">{title}</p>
        {applied ? (
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-sm text-ink/40 line-through">{formatPrice(basePrice.amount, basePrice.currency, locale)}</p>
            <p className="text-brassDark font-semibold">{formatPrice(applied.amount, applied.currency, locale)}</p>
          </div>
        ) : (
          <p className="mt-1 text-brassDark font-semibold">{formatPrice(basePrice.amount, basePrice.currency, locale)}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-ink/70">{dict.checkout.coupon.label}</label>
        <div className="flex gap-2">
          <input
            value={couponInput}
            onChange={(e) => {
              setCouponInput(e.target.value.toUpperCase());
              setApplied(null);
              setCouponError(null);
            }}
            placeholder="OPEN20"
            className="flex-1 rounded border border-line px-3 py-2 uppercase"
          />
          <button
            type="button"
            onClick={handleApply}
            disabled={checking || !couponInput.trim()}
            className="rounded-full border border-line px-4 py-2 text-sm font-medium hover:bg-sand disabled:opacity-60"
          >
            {checking ? "…" : dict.checkout.coupon.apply}
          </button>
        </div>
        {applied && (
          <p className="text-sm text-green-700">
            {dict.checkout.coupon.applied.replace("{percent}", String(applied.percentOff))}
          </p>
        )}
        {couponError && <p className="text-sm text-red-600">{couponError}</p>}
      </div>

      {paymentMethod === "stripe" ? (
        <StripeCheckoutButton
          productSlug={productSlug}
          locale={locale}
          country={country}
          label={dict.checkout.payWithCard}
          couponCode={applied?.code}
        />
      ) : (
        <InstapayForm
          productSlug={productSlug}
          dict={dict}
          locale={locale}
          price={effectivePrice}
          couponCode={applied?.code}
        />
      )}
    </div>
  );
}
