import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/price";

export const dynamic = "force-dynamic";

interface OrderRow {
  id: string;
  status: "pending" | "paid" | "rejected";
  currency: "AED" | "EGP";
  amount: number;
  created_at: string;
  products: { title_en: string; title_ar: string; slug: string } | null;
}

export default async function AccountPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/account/login?next=/${locale}/account`);
  }

  const { data } = await supabase
    .from("orders")
    .select("id, status, currency, amount, created_at, products(title_en, title_ar, slug)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orders = (data as unknown as OrderRow[]) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{dict.account.title}</h1>

      {orders.length === 0 ? (
        <p className="text-ink/60">{dict.account.empty}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const title = order.products
              ? locale === "ar"
                ? order.products.title_ar
                : order.products.title_en
              : "—";
            return (
              <div
                key={order.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5"
              >
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-ink/60">{formatPrice(order.amount, order.currency, locale)}</p>
                </div>
                {order.status === "paid" ? (
                  <a
                    href={`/api/download/${order.id}`}
                    className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-sand hover:bg-ink/90"
                  >
                    {dict.account.download}
                  </a>
                ) : (
                  <span className="rounded-full bg-sand px-4 py-2 text-sm text-ink/60">
                    {order.status === "pending" ? dict.account.pending : dict.account.rejected}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Link href={`/${locale}`} className="text-sm text-brassDark hover:underline">
        {locale === "ar" ? "← متابعة التسوق" : "← Continue shopping"}
      </Link>
    </div>
  );
}
