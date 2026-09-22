import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { PRODUCT_FILES_BUCKET, SIGNED_URL_TTL_SECONDS } from "@/lib/constants";

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  // Read via the caller's own session: RLS ("orders: owner or admin select")
  // guarantees this only ever returns an order that belongs to this user
  // (or, for an admin, any order) — never someone else's.
  const { data: order } = await supabase
    .from("orders")
    .select("id, product_id, status, user_id")
    .eq("id", params.orderId)
    .maybeSingle();

  if (!order || order.user_id !== user.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status !== "paid") {
    return NextResponse.json({ error: "Order is not paid yet" }, { status: 403 });
  }

  // The actual file lookup and signed URL need the service-role client,
  // since product_files has no end-user SELECT policy and Storage objects
  // in product-files are admin-only.
  const admin = createAdminSupabaseClient();
  const [{ data: file }, { data: product }] = await Promise.all([
    admin.from("product_files").select("storage_path").eq("product_id", order.product_id).limit(1).maybeSingle(),
    admin.from("products").select("title_ar").eq("id", order.product_id).maybeSingle(),
  ]);

  if (!file) {
    return NextResponse.json({ error: "No file attached to this product" }, { status: 404 });
  }

  // The stored object path stays ASCII (safe for storage keys/URLs), but the
  // filename the buyer's browser actually saves should be the Arabic title.
  const extension = file.storage_path.split(".").pop();
  const downloadName = product?.title_ar ? `${product.title_ar}.${extension}` : undefined;

  const { data: signed, error } = await admin.storage
    .from(PRODUCT_FILES_BUCKET)
    .createSignedUrl(file.storage_path, SIGNED_URL_TTL_SECONDS, { download: downloadName ?? true });

  if (error || !signed) {
    return NextResponse.json({ error: "Could not create download link" }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl);
}
