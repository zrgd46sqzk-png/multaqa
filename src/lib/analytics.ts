export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || null;
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || null;
export const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || null;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (event: string, params?: Record<string, unknown>) => void };
  }
}

// Fires the same logical event to whichever pixels are actually configured —
// callers don't need to know which ad platforms are wired up. No-ops
// entirely (including server-side, where `window` doesn't exist) until at
// least one NEXT_PUBLIC_*_ID env var is set and <Analytics /> loads it.
export function trackPurchase(params: { value: number; currency: string; orderId: string }) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "purchase", {
    transaction_id: params.orderId,
    value: params.value,
    currency: params.currency,
  });
  window.fbq?.("track", "Purchase", { value: params.value, currency: params.currency });
  window.ttq?.track("CompletePayment", { value: params.value, currency: params.currency });
}

export function trackLead(params: { value: number; currency: string }) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "generate_lead", { value: params.value, currency: params.currency });
  window.fbq?.("track", "Lead", { value: params.value, currency: params.currency });
  window.ttq?.track("SubmitForm", { value: params.value, currency: params.currency });
}
