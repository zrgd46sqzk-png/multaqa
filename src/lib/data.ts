import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Category, CategorySlug, Product, ProductFile } from "@/lib/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return data ?? [];
}

export async function getCategoryBySlug(slug: CategorySlug): Promise<Category | null> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
  return data;
}

export async function getPublishedProducts(categorySlug?: CategorySlug): Promise<Product[]> {
  const supabase = createServerSupabaseClient();
  let query = supabase.from("products").select("*, categories!inner(slug)").eq("status", "published");
  if (categorySlug) {
    query = query.eq("categories.slug", categorySlug);
  }
  const { data } = await query.order("created_at", { ascending: false });
  return (data as Product[]) ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data;
}

export async function getProductFiles(productId: string): Promise<ProductFile[]> {
  // product_files has no public SELECT policy (see migration 0001) — reading
  // this list itself is only ever done from admin/server code paths that
  // already carry elevated access.
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("product_files").select("*").eq("product_id", productId);
  return data ?? [];
}
