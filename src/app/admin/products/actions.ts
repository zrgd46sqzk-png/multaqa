"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { PRODUCT_FILES_BUCKET } from "@/lib/constants";

export async function createProduct(formData: FormData) {
  const { user, isAdmin, supabase } = await requireAdmin();
  if (!user || !isAdmin) throw new Error("Admin access required");

  const slug = String(formData.get("slug") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "");
  const titleEn = String(formData.get("title_en") ?? "").trim();
  const titleAr = String(formData.get("title_ar") ?? "").trim();
  const descriptionEn = String(formData.get("description_en") ?? "").trim();
  const descriptionAr = String(formData.get("description_ar") ?? "").trim();
  const priceAed = Number(formData.get("price_aed"));
  const priceEgp = Number(formData.get("price_egp"));
  const status = String(formData.get("status") ?? "draft");
  const file = formData.get("file");

  if (!slug || !categoryId || !titleEn || !titleAr) {
    throw new Error("Missing required fields");
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      slug,
      category_id: categoryId,
      title_en: titleEn,
      title_ar: titleAr,
      description_en: descriptionEn,
      description_ar: descriptionAr,
      price_aed: priceAed,
      price_egp: priceEgp,
      status,
    })
    .select("id")
    .single();

  if (error || !product) {
    throw new Error(error?.message ?? "Could not create product");
  }

  if (file instanceof File && file.size > 0) {
    const path = `${product.id}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from(PRODUCT_FILES_BUCKET)
      .upload(path, file, { contentType: file.type || "application/octet-stream" });
    if (uploadError) throw new Error(`Product saved, but file upload failed: ${uploadError.message}`);

    const { error: fileRowError } = await supabase
      .from("product_files")
      .insert({ product_id: product.id, storage_path: path, label: file.name });
    if (fileRowError) throw new Error(fileRowError.message);
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(productId: string) {
  const { user, isAdmin, supabase } = await requireAdmin();
  if (!user || !isAdmin) throw new Error("Admin access required");

  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
}
