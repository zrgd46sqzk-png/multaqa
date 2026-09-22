import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/price";
import { PAYMENT_PROOFS_BUCKET } from "@/lib/constants";
import { approveOrder, rejectOrder } from "./actions";

interface PendingOrder {
  id: string;
  currency: "AED" | "EGP";
  amount: number;
  instapay_reference: string | null;
  proof_path: string | null;
  created_at: string;
  products: { title_en: string } | null;
  profiles: { email: string } | null;
}

export default async function AdminOrdersPage() {
  const { supabase } = await requireAdmin();

  // orders has two foreign keys into profiles (user_id and reviewed_by), so
  // the embed must name which one — otherwise PostgREST rejects the query
  // as ambiguous and this silently returns no rows.
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, currency, amount, instapay_reference, proof_path, created_at, products(title_en), profiles!orders_user_id_fkey(email)"
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) console.error("Failed to load pending orders:", error.message);
  const orders = (data as unknown as PendingOrder[]) ?? [];

  const withProofUrls = await Promise.all(
    orders.map(async (order) => {
      if (!order.proof_path) return { ...order, proofUrl: null };
      const { data: signed } = await supabase.storage
        .from(PAYMENT_PROOFS_BUCKET)
        .createSignedUrl(order.proof_path, 600);
      return { ...order, proofUrl: signed?.signedUrl ?? null };
    })
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Pending InstaPay orders</h1>
      {withProofUrls.length === 0 && <p className="text-ink/60">Nothing pending review.</p>}

      {withProofUrls.map((order) => (
        <div key={order.id} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">{order.products?.title_en ?? "—"}</p>
            <p className="text-sm text-ink/60">
              {order.profiles?.email} · {formatPrice(order.amount, order.currency, "en")}
            </p>
            <p className="text-sm text-ink/60">Ref: {order.instapay_reference}</p>
            {order.proofUrl && (
              <a href={order.proofUrl} target="_blank" rel="noreferrer" className="text-sm text-brassDark underline">
                View payment proof
              </a>
            )}
          </div>
          <div className="flex gap-2">
            <form action={approveOrder.bind(null, order.id)}>
              <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-sand">Approve</button>
            </form>
            <form action={rejectOrder.bind(null, order.id)}>
              <button className="rounded-full border border-line px-4 py-2 text-sm">Reject</button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
