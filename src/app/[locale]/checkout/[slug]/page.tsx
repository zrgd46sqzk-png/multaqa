import { redirect, notFound } from "next/navigation";
import { isLocale, paymentMethodFor, type Locale } from "@/lib/i18n/config";
import { getProductBySlug } from "@/lib/data";
import { getCountry } from "@/lib/country";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { priceFor } from "@/lib/price";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CheckoutActions } from "@/components/CheckoutActions";

export default async function CheckoutPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const country = getCountry(locale);

  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/account/login?next=/${locale}/checkout/${product.slug}`);
  }

  const title = locale === "ar" ? product.title_ar : product.title_en;
  const basePrice = priceFor(product, country);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <h1 className="text-2xl font-bold">{dict.checkout.title}</h1>

      <CheckoutActions
        productSlug={product.slug}
        locale={locale}
        country={country}
        dict={dict}
        title={title}
        basePrice={basePrice}
        paymentMethod={paymentMethodFor(country)}
      />
    </div>
  );
}
