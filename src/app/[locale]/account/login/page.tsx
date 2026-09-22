"use client";

import { useState, type FormEvent } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";

export default function LoginPage() {
  const params = useParams<{ locale: string }>();
  const locale = (isLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = searchParams.get("next") ?? `/${locale}/account`;

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmSent, setConfirmSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      setLoading(false);
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      if (data.session) {
        router.push(next);
        router.refresh();
      } else {
        // Supabase project has "Confirm email" enabled — no session yet.
        setConfirmSent(true);
      }
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-5">
      <h1 className="text-2xl font-bold">{dict.auth.title}</h1>

      {confirmSent ? (
        <p className="rounded-2xl border border-brass/40 bg-brass/10 p-4 text-sm">{dict.auth.confirmEmailSent}</p>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm">
              {dict.auth.emailLabel}
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded border border-line px-3 py-2"
                placeholder="you@example.com"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              {dict.auth.passwordLabel}
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded border border-line px-3 py-2"
                placeholder="••••••••"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-ink px-6 py-3 font-semibold text-sand disabled:opacity-60"
            >
              {loading ? "…" : mode === "signup" ? dict.auth.signUp : dict.auth.signIn}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
            }}
            className="text-sm text-brassDark hover:underline"
          >
            {mode === "signin" ? dict.auth.toggleToSignup : dict.auth.toggleToSignin}
          </button>
        </>
      )}
    </div>
  );
}
