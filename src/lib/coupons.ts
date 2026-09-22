import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface CouponValidation {
  valid: boolean;
  error?: string;
  percentOff?: number;
}

// Server-only: uses the service-role client deliberately, since coupons has
// no public select policy (see 0003_coupons.sql). Never call this from a
// Client Component or expose it as a public data-fetching helper.
export async function validateCoupon(rawCode: string): Promise<CouponValidation> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { valid: false, error: "No code provided" };

  const supabase = createAdminSupabaseClient();
  const { data: coupon } = await supabase
    .from("coupons")
    .select("percent_off, active, expires_at, max_redemptions, times_redeemed")
    .eq("code", code)
    .maybeSingle();

  if (!coupon || !coupon.active) return { valid: false, error: "Invalid code" };
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { valid: false, error: "Code expired" };
  }
  if (coupon.max_redemptions !== null && coupon.times_redeemed >= coupon.max_redemptions) {
    return { valid: false, error: "Code fully redeemed" };
  }

  return { valid: true, percentOff: Number(coupon.percent_off) };
}

export function applyDiscount(amount: number, percentOff: number): number {
  return Math.round(amount * (1 - percentOff / 100) * 100) / 100;
}

export async function redeemCoupon(rawCode: string): Promise<void> {
  const code = rawCode.trim().toUpperCase();
  const supabase = createAdminSupabaseClient();
  await supabase.rpc("increment_coupon_redemption", { coupon_code: code });
}
