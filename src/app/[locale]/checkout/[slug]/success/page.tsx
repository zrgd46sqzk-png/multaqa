import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { TrackPurchase } from "@/components/TrackPurchase";

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: { locale: string; slug: string };
  searchParams: { session_id?: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  const supabase = createServerSupabaseClient();
  const order = searchParams.session_id
    ? (
        await supabase
          .from("orders")
          .select("id, status, amount, currency")
          .eq("stripe_session_id", searchParams.session_id)
          .maybeSingle()
      ).data
    : null;

  const ready = order?.status === "paid";

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-line bg-white p-8 text-center">
      {ready && order && <TrackPurchase orderId={order.id} value={Number(order.amount)} currency={order.currency} />}
      <h1 className="text-2xl font-bold text-brassDark">
        {ready ? (locale === "ar" ? "تم الدفع بنجاح" : "Payment successful") : (locale === "ar" ? "جارٍ التأكيد…" : "Confirming your payment…")}
      </h1>
      <p className="text-ink/70">
        {ready
          ? locale === "ar"
            ? "يمكنك الآن تحميل منتجك من صفحة مشترياتي."
            : "You can now download your product from My Purchases."
          : locale === "ar"
          ? "قد يستغرق هذا بضع ثوانٍ. حدّث الصفحة بعد قليل."
          : "This can take a few seconds. Refresh the page shortly."}
      </p>
      <Link href={`/${locale}/account`} className="rounded-full bg-ink px-6 py-3 font-semibold text-sand">
        {locale === "ar" ? "مشترياتي" : "My Purchases"}
      </Link>
    </div>
  );
}
