import Stripe from "stripe";

let stripeClient: Stripe | null = null;

// Lazily constructed so the app can boot (and `next build`) without a real
// Stripe secret key present yet; only routes that actually call Stripe
// (checkout creation, webhook verification) require it at runtime.
export function getStripe(): Stripe {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeClient = new Stripe(secretKey, { apiVersion: "2024-06-20" });
  }
  return stripeClient;
}
