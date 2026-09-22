import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PAYMENT_PROOFS_BUCKET } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const formData = await request.formData();
  const productSlug = formData.get("productSlug");
  const reference = formData.get("reference");
  const proof = formData.get("proof");

  if (typeof productSlug !== "string" || typeof reference !== "string" || !(proof instanceof File)) {
    return NextResponse.json({ error: "Missing productSlug, reference, or proof file" }, { status: 400 });
  }
  if (!reference.trim()) {
    return NextResponse.json({ error: "Reference is required" }, { status: 400 });
  }

  const { data: product } = await supabase
    .from("products")
    .select("id, price_egp")
    .eq("slug", productSlug)
    .eq("status", "published")
    .maybeSingle();
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  if (!product.price_egp || product.price_egp <= 0) {
    return NextResponse.json({ error: "Product has no EGP price set" }, { status: 400 });
  }

  const extension = proof.name.split(".").pop() ?? "jpg";
  const path = `${user.id}/${product.id}-${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(PAYMENT_PROOFS_BUCKET)
    .upload(path, proof, { contentType: proof.type || "image/jpeg" });
  if (uploadError) {
    return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
  }

  const { error: insertError } = await supabase.from("orders").insert({
    user_id: user.id,
    product_id: product.id,
    country: "EG",
    currency: "EGP",
    amount: product.price_egp,
    payment_method: "instapay",
    status: "pending",
    instapay_reference: reference.trim(),
    proof_path: path,
  });
  if (insertError) {
    return NextResponse.json({ error: `Could not create order: ${insertError.message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
