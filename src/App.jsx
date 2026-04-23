import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="app">
      <header className="hero">
        <h1>Mijote</h1>
        <p className="tagline">
          Freshly scaffolded. Deployed on Vercel. Ready to cook.
        </p>
      </header>

      <section className="card">
        <button onClick={() => setCount((c) => c + 1)}>
          Clicked {count} {count === 1 ? 'time' : 'times'}
        </button>
        <p className="hint">
          Edit <code>src/App.jsx</code> and save to reload.
        </p>
      </section>

      <footer className="footer">
        <small>Built with Vite + React</small>
      </footer>
    </main>
  );
}
