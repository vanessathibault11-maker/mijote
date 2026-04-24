import { JOURS, TYPES_REPAS, getRecette } from '../data/recipes';

export default function Journal({ plan, journal }) {
  const rows = [];
  for (const j of JOURS) {
    const dp = plan[j.key] || {};
    for (const t of TYPES_REPAS) {
      const ids = t.key === 'collations' ? (dp.collations || []) : (dp[t.key] ? [dp[t.key]] : []);
      for (const id of ids) {
        const r = getRecette(id);
        if (!r) continue;
        const e = journal[`${j.key}:${id}`] || {};
        if (e.done || e.rating || e.note) {
          rows.push({ jour: j.long, type: t.label, nom: r.nom, done: e.done, rating: e.rating || 0, note: e.note || '' });
        }
      }
    }
  }

  const rated = rows.filter((r) => r.rating > 0);
  const avg = rated.length ? (rated.reduce((a, b) => a + b.rating, 0) / rated.length).toFixed(1) : '—';
  const doneCount = rows.filter((r) => r.done).length;

  return (
    <div className="view-journal">
      <header className="ep-head">
        <h2>Journal de bord</h2>
        <p className="muted">
          {doneCount} repas complété{doneCount > 1 ? 's' : ''} · moyenne {avg} ★
        </p>
      </header>

      {rows.length === 0 && (
        <p className="muted">
          Coche tes repas et note-les depuis le modal plat pour voir l'historique ici.
        </p>
      )}

      <ul className="journal-list">
        {rows.map((r, i) => (
          <li key={i} className="journal-item">
            <div className="jl-head">
              <strong>{r.nom}</strong>
              {r.done && <span className="badge badge-done">✓ fait</span>}
              {r.rating > 0 && (
                <span className="badge badge-star">
                  {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                </span>
              )}
            </div>
            <small className="muted">{r.jour} · {r.type}</small>
            {r.note && <p className="jl-note">« {r.note} »</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
