export const INSTAPAY_HANDLE = process.env.NEXT_PUBLIC_INSTAPAY_HANDLE ?? "multaqa@instapay";

// Intl format, digits only (e.g. "971501234567") — no default, since a wrong
// invented number is worse than no WhatsApp link at all. Unset = hidden.
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || null;

// Used to build absolute URLs (Open Graph tags, sitemap) where a relative
// path won't do. Override in production if the deployed domain changes.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://multaqa-ruddy.vercel.app";

export const PRODUCT_FILES_BUCKET = "product-files";
export const PAYMENT_PROOFS_BUCKET = "payment-proofs";
export const PRODUCT_COVERS_BUCKET = "product-covers";

export const SIGNED_URL_TTL_SECONDS = 60 * 10; // 10 minutes

export const COUNTRY_COOKIE = "multaqa_country";
