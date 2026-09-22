import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client: bypasses RLS entirely. Server-only code paths (API
// routes, server actions, scripts) that have already verified the caller
// is an admin, or that need to write on behalf of the system (webhooks,
// seeding). Never import this from a Client Component or expose the key
// to the browser.
export function createAdminSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
