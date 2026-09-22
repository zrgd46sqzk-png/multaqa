import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteProduct } from "./actions";

export default async function AdminProductsPage() {
  const { supabase } = await requireAdmin();
  const { data: products } = await supabase
    .from("products")
    .select("id, slug, title_en, status, price_aed, price_egp")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-sand">
          + New product
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {(products ?? []).map((product) => (
          <div key={product.id} className="flex items-center justify-between rounded-2xl border border-line bg-white p-4">
            <div>
              <p className="font-medium">{product.title_en}</p>
              <p className="text-sm text-ink/60">
                /{product.slug} · {product.status} · AED {product.price_aed} · EGP {product.price_egp}
              </p>
            </div>
            <form action={deleteProduct.bind(null, product.id)}>
              <button className="rounded-full border border-line px-3 py-1.5 text-sm text-red-600">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
