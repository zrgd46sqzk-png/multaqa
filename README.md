# Multaqa (ملتقى)

A bilingual (English/Arabic) digital-products storefront for the Arab world — AI digital
products, courses, and couple games — with Stripe checkout (AED, via a UAE Stripe account)
for every Arab League country except Egypt, and a manual InstaPay-confirmation flow for
Egypt, which has no Stripe merchant support.

This is a real, working codebase, not a template — but it depends on a few external
accounts that only you can create (Supabase, Stripe, an InstaPay number). Follow the
steps below in order; the app won't run without them.

## 1. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run these migrations **in order**:
   - `supabase/migrations/0001_init.sql` — all tables, Row Level Security policies, and
     the three storage buckets (`product-files`, `payment-proofs` — both private;
     `product-covers` — public).
   - `supabase/migrations/0002_arab_countries.sql` — widens `orders.country` from just
     `AE`/`EG` to the full Arab League list.
   - `supabase/migrations/0003_coupons.sql` — adds the `coupons` table and an
     `orders.coupon_code` column (see "How coupon codes work" below).
3. In **Authentication → URL Configuration**, add your site URL and
   `<site-url>/auth/callback` as a redirect URL (also add `http://localhost:3000/auth/callback`
   for local dev). Sign-in uses email + password (Supabase's built-in auth), so no extra
   provider setup is needed.
4. Copy **Project URL**, **anon public key**, and **service_role key** from
   Project Settings → API.

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY` — from your [Stripe dashboard](https://dashboard.stripe.com/apikeys).
  Start in test mode.
- `STRIPE_WEBHOOK_SECRET` — create a webhook endpoint at `<site-url>/api/stripe/webhook`
  listening for `checkout.session.completed`, then copy its signing secret. For local
  testing, use the Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
- `NEXT_PUBLIC_INSTAPAY_HANDLE` — the InstaPay number/handle shown to Egypt buyers at
  checkout. **This flow is manual by design**: there is no public InstaPay merchant API,
  so buyers pay this handle directly and upload a screenshot + reference for an admin to
  approve in `/admin/orders`.
- `NEXT_PUBLIC_SITE_URL` — the deployed domain, used to build absolute URLs for Open
  Graph tags and `sitemap.xml`. Defaults to `https://multaqa-ruddy.vercel.app` if unset.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` (optional) — shows a WhatsApp contact link in the footer
  when set (digits only, with country code, e.g. `971501234567`); hidden entirely if blank.
- `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`
  (all optional) — Google Analytics 4, Meta Pixel, and TikTok Pixel. Each pixel's script
  only loads once its ID is set (`src/components/Analytics.tsx`); a `purchase` event
  fires on the Stripe success page and a `lead` event on InstaPay submission
  (`src/lib/analytics.ts`).

## 3. Install, seed, and run

```bash
npm install
npm run dev
```

The launch catalog's four products already have real PDF files generated in
`content/products/` (see `npm run generate:pdfs` if you want to regenerate them from
`scripts/generate-pdfs/content/*.mjs`). To load them into your Supabase project:

```bash
npm run seed
```

This uploads each PDF to the `product-files` bucket and inserts/updates its product row
(published, priced in both AED and EGP — edit prices any time from `/admin/products`).

## 4. Make yourself an admin

Sign in once on the site (any page's "Sign in" link) to create your `profiles` row, then
in the Supabase SQL editor:

```sql
update profiles set is_admin = true where email = 'you@example.com';
```

You can now sign in at `/admin/login` to approve InstaPay orders and manage products.

## 5. Deploy

Any Node hosting works (Vercel, Render, etc.) — set the same environment variables there,
point Stripe's webhook at the deployed URL, and add the deployed `/auth/callback` URL to
Supabase's redirect list.

## How the two payment paths work

- **Every Arab League country except Egypt (AED):** `Buy now` → Stripe Checkout, charged
  in AED regardless of which of those countries the buyer selects (one UAE Stripe
  account, one currency — Stripe settles the conversion) → on
  `checkout.session.completed`, the webhook (`src/app/api/stripe/webhook/route.ts`)
  creates the order as `paid` and the download unlocks immediately. Note: Stripe itself
  excludes Syria and Sudan from card processing (OFAC sanctions), so those two are listed
  for pricing/country-selection purposes but checkout will fail at Stripe's end.
- **Egypt (EGP):** buyer sees the InstaPay handle, submits a reference + screenshot
  (`src/app/api/instapay/submit/route.ts`), the order is created as `pending`, and an
  admin approves or rejects it from `/admin/orders`. Approving flips the order to `paid`.

Downloads are never public files — `/api/download/[orderId]` checks the order belongs to
the signed-in buyer and is `paid`, then issues a 10-minute signed Supabase Storage URL.

## How coupon codes work

Create/disable percent-off codes at `/admin/coupons`. A buyer enters a code at checkout
(`src/components/CheckoutActions.tsx`), which calls `/api/coupons/validate` to preview
the discounted price before committing — this matters most for InstaPay, where the
buyer needs to know the exact amount to manually transfer.

The code is **re-validated server-side** on actual submission (`src/lib/coupons.ts`,
consulted by both `src/app/api/stripe/checkout/route.ts` and
`src/app/api/instapay/submit/route.ts`) — the client-side preview is never trusted for
the real charge. Redemption counts increment on Stripe's `checkout.session.completed`
webhook, and at submission time for InstaPay (not at admin approval — a small share of
submitted-but-later-rejected InstaPay orders will still count as redeemed, which is
acceptable slack for a launch-discount mechanism).

There is deliberately no public read access to the `coupons` table: the Supabase anon
key is public, and a public "active coupons" policy would let anyone list every code
directly from Supabase's REST API. Lookups only happen server-side via the service-role
client.

## Known items intentionally out of scope for v1

- **UAE VAT** is not added to displayed prices. If you register for VAT, add it in
  `src/lib/price.ts`.
- **InstaPay is manual-review only.** If you later get access to a payment aggregator
  that supports InstaPay with a real API, that would replace the flow in
  `src/app/api/instapay/submit/route.ts` and `/admin/orders`.
- Arabic translations exist for all site UI and product listings; the product **files**
  themselves (the 4 launch PDFs) are English-only for now.
- `npm audit` flags Next.js 14.2.x against a broad advisory range that's fully resolved
  only in Next.js 16. Most of those CVEs target features this app doesn't use (custom
  servers, Edge runtime Server Actions, image optimization misconfiguration). Worth
  revisiting before this handles meaningful traffic.

## Realistic expectations

There's no way to guarantee income from a website — that depends on marketing, pricing,
and actual demand, none of which code can promise. What's built here is a correct,
working foundation: real products, a genuine dual-payment flow for both markets, and a
bilingual storefront. Growing it into actual revenue is ongoing work (traffic, more
products, pricing experiments), not a one-time build.
