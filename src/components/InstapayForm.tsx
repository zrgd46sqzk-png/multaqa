"use client";

import { useState, type FormEvent } from "react";
import { INSTAPAY_HANDLE } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function InstapayForm({ productSlug, dict }: { productSlug: string; dict: Dictionary }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("productSlug", productSlug);

    try {
      const res = await fetch("/api/instapay/submit", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-brass/40 bg-brass/10 p-5 text-sm text-ink">
        {dict.checkout.pendingReview}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-6">
      <p className="text-sm text-ink/70">{dict.checkout.instapayInstructions}</p>

      <div className="rounded-xl bg-sand p-4 text-center">
        <p className="text-xs uppercase tracking-wide text-ink/50">{dict.checkout.instapayHandle}</p>
        <p className="text-lg font-semibold text-brassDark">{INSTAPAY_HANDLE}</p>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        {dict.checkout.referenceLabel}
        <input
          name="reference"
          required
          className="rounded border border-line px-3 py-2"
          placeholder="e.g. 123456789012"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        {dict.checkout.proofLabel}
        <input name="proof" type="file" accept="image/*,.pdf" required className="rounded border border-line px-3 py-2" />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-ink px-6 py-3 font-semibold text-sand hover:bg-ink/90 disabled:opacity-60"
      >
        {loading ? "…" : dict.checkout.submitProof}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
