import { createClient } from '@supabase/supabase-js';

/**
 * Vercel Serverless Function: /api/db-check
 *
 * Pings Supabase to confirm the connection works.
 *
 * Env vars (injected automatically by the Vercel <> Supabase integration):
 *   - SUPABASE_URL          (public, safe to expose)
 *   - SUPABASE_ANON_KEY     (public, safe to expose)
 *   - POSTGRES_URL          (server-only, for direct SQL if needed)
 *
 * Runs on Vercel's Node runtime by default.
 */
export default async function handler(req, res) {
  const startedAt = Date.now();

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return res.status(500).json({
      ok: false,
      error: 'Missing Supabase env vars',
      missing: {
        SUPABASE_URL: !url,
        SUPABASE_ANON_KEY: !anonKey,
      },
      hint:
        'Install the Supabase integration from the Vercel Marketplace and link it to this project.',
    });
  }

  try {
    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false },
    });

    // Lightweight connectivity check: call the auth REST endpoint, which
    // does not require any tables or schema to exist.
    const { error } = await supabase.auth.getSession();

    if (error) {
      return res.status(502).json({
        ok: false,
        error: 'Supabase responded with an error',
        details: error.message,
        latencyMs: Date.now() - startedAt,
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Supabase connection OK',
      project: new URL(url).hostname.split('.')[0],
      latencyMs: Date.now() - startedAt,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: 'Unexpected error',
      details: err instanceof Error ? err.message : String(err),
      latencyMs: Date.now() - startedAt,
    });
  }
}
