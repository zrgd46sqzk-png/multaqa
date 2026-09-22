# Multaqa (ملتقى)

A bilingual (English/Arabic) digital-products storefront for the UAE and Egypt — AI digital
products, courses, and couple games — with Stripe checkout for the UAE and a manual
InstaPay-confirmation flow for Egypt.

This is a real, working codebase, not a template — but it depends on a few external
accounts that only you can create (Supabase, Stripe, an InstaPay number). Follow the
steps below in order; the app won't run without them.

## 1. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the contents of `supabase/migrations/0001_init.sql`. This creates
   all tables, Row Level Security policies, and the three storage buckets
   (`product-files`, `payment-proofs` — both private; `product-covers` — public).
3. In **Authentication → URL Configuration**, add your site URL and
   `<site-url>/auth/callback` as a redirect URL (also add `http://localhost:3000/auth/callback`
   for local dev). Sign-in uses passwordless magic links, so no extra auth provider setup
   is needed.
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

- **UAE (AED):** `Buy now` → Stripe Checkout → on `checkout.session.completed`, the
  webhook (`src/app/api/stripe/webhook/route.ts`) creates the order as `paid` and the
  download unlocks immediately.
- **Egypt (EGP):** buyer sees the InstaPay handle, submits a reference + screenshot
  (`src/app/api/instapay/submit/route.ts`), the order is created as `pending`, and an
  admin approves or rejects it from `/admin/orders`. Approving flips the order to `paid`.

Downloads are never public files — `/api/download/[orderId]` checks the order belongs to
the signed-in buyer and is `paid`, then issues a 10-minute signed Supabase Storage URL.

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
