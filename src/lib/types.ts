export type CategorySlug = "ai_products" | "courses" | "couple_games";

export type OrderStatus = "pending" | "paid" | "rejected";
export type PaymentMethod = "stripe" | "instapay";

export interface Category {
  id: string;
  slug: CategorySlug;
  name_en: string;
  name_ar: string;
}

export interface Product {
  id: string;
  slug: string;
  category_id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  price_aed: number;
  price_egp: number;
  cover_image_path: string | null;
  status: "draft" | "published";
  created_at: string;
}

export interface ProductFile {
  id: string;
  product_id: string;
  storage_path: string;
  label: string;
}

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  country: "AE" | "EG";
  currency: "AED" | "EGP";
  amount: number;
  payment_method: PaymentMethod;
  status: OrderStatus;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  instapay_reference: string | null;
  proof_path: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}
