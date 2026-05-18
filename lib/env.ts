/**
 * Centralised environment variable access with runtime validation.
 *
 * Instead of scattering `process.env.SOME_VAR!` across the codebase
 * (which silently passes `undefined` when the var is missing), every
 * env read now goes through a validated getter.  The first time a
 * required variable is accessed, the getter throws an actionable error
 * explaining exactly which variable is missing and where to set it.
 *
 * IMPORTANT — Next.js constraint:
 * `NEXT_PUBLIC_*` env vars are **inlined at build time** only when
 * accessed as literal strings (e.g. `process.env.NEXT_PUBLIC_SUPABASE_URL`).
 * Dynamic access like `process.env[name]` returns `undefined` on the
 * client side. That is why every public var below is read with a
 * hard-coded literal rather than a helper function.
 *
 * Optional variables (like OPENAI_API_KEY) expose both a value getter
 * and a boolean "is it available?" helper so callers can degrade
 * gracefully without crashing.
 */

function assertDefined(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `[LegalEagle] Missing required environment variable: ${name}\n` +
        `Set it in .env.local (for local dev) or in your Vercel project settings (for deployment).\n` +
        `Docs: https://supabase.com/dashboard/project/_/settings/api`,
    );
  }
  return value;
}

// ── Supabase (required) ────────────────────────────────────────────
// Must use literal `process.env.NEXT_PUBLIC_*` so Next.js inlines them
// on the client side at build time.
export function getSupabaseUrl(): string {
  return assertDefined(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabaseAnonKey(): string {
  return assertDefined(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

// ── OpenAI (optional — app degrades to free-mode without it) ───────
// Server-only var, so dynamic access is fine here.
export function getOpenAIApiKey(): string | undefined {
  return process.env.OPENAI_API_KEY || undefined;
}

export function hasOpenAIKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

/**
 * Run a quick health-check of all **required** vars.
 * Call this once at startup / in middleware to surface problems early.
 * Returns `{ ok: true }` or `{ ok: false, missing: [...] }`.
 *
 * NOTE: This uses literal access for each var so it works on both
 * server and client.
 */
export function validateEnv(): { ok: true } | { ok: false; missing: string[] } {
  const missing: string[] = [];

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (missing.length > 0) {
    return { ok: false, missing };
  }
  return { ok: true };
}
