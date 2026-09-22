"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin` },
    });
    setLoading(false);
    if (signInError) setError(signInError.message);
    else setSent(true);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-5 px-4">
      <h1 className="text-2xl font-bold">Multaqa Admin</h1>
      {sent ? (
        <p className="rounded-2xl border border-brass/40 bg-brass/10 p-4 text-sm">
          Check your email for a sign-in link. Note: this account must already have is_admin = true in the
          profiles table.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border border-line px-3 py-2"
            placeholder="admin@example.com"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-ink px-6 py-3 font-semibold text-sand disabled:opacity-60"
          >
            {loading ? "…" : "Send magic link"}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      )}
    </div>
  );
}
