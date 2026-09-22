import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = createServerSupabaseClient();

  const [{ count: pendingCount }, { count: productCount }] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("products").select("id", { count: "exact", head: true }),
  ]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link href="/admin/orders" className="rounded-2xl border border-line bg-white p-6 hover:border-brass">
        <p className="text-sm text-ink/60">Pending InstaPay orders</p>
        <p className="mt-1 text-3xl font-bold text-brassDark">{pendingCount ?? 0}</p>
      </Link>
      <Link href="/admin/products" className="rounded-2xl border border-line bg-white p-6 hover:border-brass">
        <p className="text-sm text-ink/60">Products</p>
        <p className="mt-1 text-3xl font-bold text-brassDark">{productCount ?? 0}</p>
      </Link>
    </div>
  );
}
