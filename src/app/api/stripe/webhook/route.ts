import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/payments/stripe";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { redeemCoupon } from "@/lib/coupons";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Invalid signature: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { product_id, user_id, country, currency, amount, coupon_code } = session.metadata ?? {};

    if (product_id && user_id && country && currency && amount) {
      const supabase = createAdminSupabaseClient();

      // Idempotent: a Stripe retry of the same event must not create a
      // second order for the same checkout session.
      const { data: existing } = await supabase
        .from("orders")
        .select("id")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from("orders").insert({
          user_id,
          product_id,
          country,
          currency,
          amount: Number(amount),
          payment_method: "stripe",
          status: "paid",
          stripe_session_id: session.id,
          stripe_payment_intent:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
          reviewed_at: new Date().toISOString(),
          coupon_code: coupon_code ?? null,
        });

        // Only count the redemption once the order actually landed as paid
        // (this webhook only fires here), and only for a genuinely new
        // order — a retried event with an existing order must not double-count.
        if (coupon_code) await redeemCoupon(coupon_code);
      }
    }
  }

  return NextResponse.json({ received: true });
}
