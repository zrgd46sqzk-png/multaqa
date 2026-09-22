import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/payments/stripe";
import { countries, paymentMethodFor, type CountryCode } from "@/lib/i18n/config";

export async function POST(request: NextRequest) {
  const { productSlug, locale, country } = await request.json();
  if (!productSlug || !locale || !country) {
    return NextResponse.json({ error: "Missing productSlug, locale, or country" }, { status: 400 });
  }
  if (!(countries as readonly string[]).includes(country) || paymentMethodFor(country as CountryCode) !== "stripe") {
    return NextResponse.json({ error: "This country does not use card checkout" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { data: product } = await supabase
    .from("products")
    .select("id, slug, title_en, price_aed")
    .eq("slug", productSlug)
    .eq("status", "published")
    .maybeSingle();
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  if (!product.price_aed || product.price_aed <= 0) {
    return NextResponse.json({ error: "Product has no AED price set" }, { status: 400 });
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: user.email ?? undefined,
    line_items: [
      {
        price_data: {
          currency: "aed",
          product_data: { name: product.title_en },
          unit_amount: Math.round(Number(product.price_aed) * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      product_id: product.id,
      user_id: user.id,
      country,
      currency: "AED",
      amount: String(product.price_aed),
    },
    success_url: `${origin}/${locale}/checkout/${product.slug}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/${locale}/checkout/${product.slug}`,
  });

  return NextResponse.json({ url: session.url });
}
