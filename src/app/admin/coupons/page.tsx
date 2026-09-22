import { requireAdmin } from "@/lib/admin-auth";
import { createCoupon, toggleCoupon } from "./actions";

export default async function AdminCouponsPage() {
  const { supabase } = await requireAdmin();
  const { data: coupons } = await supabase
    .from("coupons")
    .select("id, code, percent_off, active, expires_at, max_redemptions, times_redeemed")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold">Coupons</h1>
        <p className="mt-1 text-sm text-ink/60">
          Percent-off codes, applied at checkout on both the Stripe and InstaPay paths.
        </p>
      </div>

      <form action={createCoupon} className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="flex flex-col gap-1 text-sm">
          Code
          <input name="code" required className="rounded border border-line px-3 py-2 uppercase" placeholder="OPEN20" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Percent off
          <input name="percent_off" type="number" min="1" max="100" required className="rounded border border-line px-3 py-2" placeholder="20" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Expires (optional)
          <input name="expires_at" type="date" className="rounded border border-line px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Max redemptions (optional)
          <input name="max_redemptions" type="number" min="1" className="rounded border border-line px-3 py-2" placeholder="unlimited" />
        </label>
        <button type="submit" className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-sand">
          Create
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {(coupons ?? []).length === 0 && <p className="text-ink/60">No coupons yet.</p>}
        {(coupons ?? []).map((coupon) => (
          <div key={coupon.id} className="flex items-center justify-between rounded-2xl border border-line bg-white p-4">
            <div>
              <p className="font-mono font-semibold">{coupon.code}</p>
              <p className="text-sm text-ink/60">
                {coupon.percent_off}% off · {coupon.times_redeemed} redeemed
                {coupon.max_redemptions ? ` / ${coupon.max_redemptions} max` : ""}
                {coupon.expires_at ? ` · expires ${new Date(coupon.expires_at).toLocaleDateString()}` : ""}
                {" · "}
                {coupon.active ? "active" : "disabled"}
              </p>
            </div>
            <form action={toggleCoupon.bind(null, coupon.id, !coupon.active)}>
              <button className="rounded-full border border-line px-3 py-1.5 text-sm">
                {coupon.active ? "Disable" : "Enable"}
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
