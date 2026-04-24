import { useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('idle'); // idle | loading | ok | error
  const [result, setResult] = useState(null);

  async function testConnection() {
    setStatus('loading');
    setResult(null);
    try {
      const res = await fetch('/api/db-check');
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus('ok');
      } else {
        setStatus('error');
      }
      setResult(data);
    } catch (err) {
      setStatus('error');
      setResult({ ok: false, error: 'Network error', details: String(err) });
    }
  }

  return (
    <main className="app">
      <header className="hero">
        <h1>Mijote</h1>
        <p className="tagline">
          Vite + React on Vercel, with Supabase wired up.
        </p>
      </header>

      <section className="card">
        <button onClick={testConnection} disabled={status === 'loading'}>
          {status === 'loading' ? 'Testing…' : 'Test DB connection'}
        </button>

        {status === 'ok' && (
          <div className="status status--ok">
            <strong>✓ Connected</strong>
            <p className="hint">
              {result?.message}
              {result?.project && ` · project: ${result.project}`}
              {typeof result?.latencyMs === 'number' &&
                ` · ${result.latencyMs}ms`}
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="status status--error">
            <strong>✗ Connection failed</strong>
            <p className="hint">{result?.error ?? 'Unknown error'}</p>
            {result?.details && (
              <pre className="details">{result.details}</pre>
            )}
            {result?.hint && <p className="hint">{result.hint}</p>}
          </div>
        )}

        {status === 'idle' && (
          <p className="hint">
            Click the button to ping the Supabase project via{' '}
            <code>/api/db-check</code>.
          </p>
        )}
      </section>

      <footer className="footer">
        <small>Built with Vite + React · Supabase · Vercel</small>
      </footer>
    </main>
  );
}
