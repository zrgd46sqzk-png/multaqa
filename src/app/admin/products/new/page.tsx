import { requireAdmin } from "@/lib/admin-auth";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  const { supabase } = await requireAdmin();
  const { data: categories } = await supabase.from("categories").select("id, slug, name_en").order("sort_order");

  return (
    <form action={createProduct} className="mx-auto flex max-w-xl flex-col gap-4">
      <h1 className="text-xl font-bold">New product</h1>

      <label className="flex flex-col gap-1 text-sm">
        Slug (URL-friendly, unique)
        <input name="slug" required className="rounded border border-line px-3 py-2" placeholder="ai-prompt-pack-productivity" />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Category
        <select name="category_id" required className="rounded border border-line px-3 py-2">
          {(categories ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name_en}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Title (English)
          <input name="title_en" required className="rounded border border-line px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Title (Arabic)
          <input name="title_ar" dir="rtl" required className="rounded border border-line px-3 py-2" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Description (English)
          <textarea name="description_en" rows={4} className="rounded border border-line px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Description (Arabic)
          <textarea name="description_ar" dir="rtl" rows={4} className="rounded border border-line px-3 py-2" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Price (AED)
          <input name="price_aed" type="number" step="0.01" min="0" required className="rounded border border-line px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Price (EGP)
          <input name="price_egp" type="number" step="0.01" min="0" required className="rounded border border-line px-3 py-2" />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Status
        <select name="status" className="rounded border border-line px-3 py-2">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Deliverable file (PDF/zip — the thing buyers download)
        <input name="file" type="file" className="rounded border border-line px-3 py-2" />
      </label>

      <button type="submit" className="rounded-full bg-ink px-6 py-3 font-semibold text-sand">
        Create product
      </button>
    </form>
  );
}
