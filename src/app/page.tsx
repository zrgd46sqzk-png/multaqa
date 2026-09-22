import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";

// Normally middleware.ts redirects "/" to the visitor's locale before this
// ever renders; this is the fallback for any request that skips middleware.
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
