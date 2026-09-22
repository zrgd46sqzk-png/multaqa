"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";

export async function approveOrder(orderId: string) {
  const { user, isAdmin, supabase } = await requireAdmin();
  if (!user || !isAdmin) throw new Error("Admin access required");

  const { error } = await supabase
    .from("orders")
    .update({ status: "paid", reviewed_at: new Date().toISOString(), reviewed_by: user.id })
    .eq("id", orderId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/orders");
}

export async function rejectOrder(orderId: string) {
  const { user, isAdmin, supabase } = await requireAdmin();
  if (!user || !isAdmin) throw new Error("Admin access required");

  const { error } = await supabase
    .from("orders")
    .update({ status: "rejected", reviewed_at: new Date().toISOString(), reviewed_by: user.id })
    .eq("id", orderId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/orders");
}
