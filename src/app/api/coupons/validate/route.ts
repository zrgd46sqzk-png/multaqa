import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/data";
import { priceFor } from "@/lib/price";
import { validateCoupon, applyDiscount } from "@/lib/coupons";
import { countries, type CountryCode } from "@/lib/i18n/config";

// Public preview endpoint — no order is created here, just a discounted
// price to show the buyer before they commit to Stripe or (critically for
// InstaPay) know the exact amount to manually transfer.
export async function POST(request: NextRequest) {
  const { code, productSlug, country } = await request.json();
  if (!code || !productSlug || !country || !(countries as readonly string[]).includes(country)) {
    return NextResponse.json({ valid: false, error: "Missing code, productSlug, or country" }, { status: 400 });
  }

  const result = await validateCoupon(code);
  if (!result.valid || !result.percentOff) {
    return NextResponse.json({ valid: false, error: result.error ?? "Invalid code" });
  }

  const product = await getProductBySlug(productSlug);
  if (!product) {
    return NextResponse.json({ valid: false, error: "Product not found" }, { status: 404 });
  }

  const { amount, currency } = priceFor(product, country as CountryCode);
  const discountedAmount = applyDiscount(amount, result.percentOff);

  return NextResponse.json({
    valid: true,
    code: String(code).trim().toUpperCase(),
    percentOff: result.percentOff,
    amount: discountedAmount,
    currency,
  });
}
