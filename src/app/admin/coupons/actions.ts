"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";

export async function createCoupon(formData: FormData) {
  const { user, isAdmin, supabase } = await requireAdmin();
  if (!user || !isAdmin) throw new Error("Admin access required");

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const percentOff = Number(formData.get("percent_off"));
  const expiresAtRaw = String(formData.get("expires_at") ?? "").trim();
  const maxRedemptionsRaw = String(formData.get("max_redemptions") ?? "").trim();

  if (!code || !percentOff || percentOff <= 0 || percentOff > 100) {
    throw new Error("Code and a percent_off between 1 and 100 are required");
  }

  const { error } = await supabase.from("coupons").insert({
    code,
    percent_off: percentOff,
    expires_at: expiresAtRaw ? new Date(expiresAtRaw).toISOString() : null,
    max_redemptions: maxRedemptionsRaw ? Number(maxRedemptionsRaw) : null,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/coupons");
}

export async function toggleCoupon(couponId: string, active: boolean) {
  const { user, isAdmin, supabase } = await requireAdmin();
  if (!user || !isAdmin) throw new Error("Admin access required");

  const { error } = await supabase.from("coupons").update({ active }).eq("id", couponId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/coupons");
}
