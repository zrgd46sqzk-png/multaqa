"use client";

import { useEffect } from "react";
import { trackPurchase } from "@/lib/analytics";

// Fires once on mount. A refresh of this page will fire it again — real
// server-side dedup (e.g. via each ad platform's Conversions API, keyed on
// orderId) is a further improvement, not implemented here.
export function TrackPurchase({ orderId, value, currency }: { orderId: string; value: number; currency: string }) {
  useEffect(() => {
    trackPurchase({ orderId, value, currency });
  }, [orderId, value, currency]);

  return null;
}
