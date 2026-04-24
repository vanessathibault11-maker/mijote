import { useMemo } from 'react';
import { JOURS, getRecette } from '../data/recipes';

function collectIngredients(plan) {
  const map = new Map(); // key: `${nom}|${source}` -> { nom, qte[], source, usedIn[] }
  for (const j of JOURS) {
    const dp = plan[j.key] || {};
    const ids = [dp.dejeuner, dp.diner, dp.souper, ...(dp.collations || [])].filter(Boolean);
    for (const id of ids) {
      const r = getRecette(id);
      if (!r) continue;
      for (const ing of r.ingredients) {
        if (ing.source === 'frigo') continue; // restants
        const key = `${ing.nom.toLowerCase()}|${ing.source}`;
        if (!map.has(key)) {
          map.set(key, { nom: ing.nom, source: ing.source, quantites: [], usedIn: new Set() });
        }
        const e = map.get(key);
        e.quantites.push(ing.qte);
        e.usedIn.add(r.nom);
      }
    }
  }
  return Array.from(map.values()).map((e) => ({
    ...e,
    usedIn: Array.from(e.usedIn),
  }));
}

const SOURCES = [
  { key: 'lufa', label: 'Lufa (en ligne)', emoji: '🥬' },
  { key: 'iga', label: 'IGA (dépannage)', emoji: '🛒' },
  { key: 'garde-manger', label: 'Garde-manger', emoji: '🏠' },
];

export default function Epicerie({ plan, achats, setAchats }) {
  const items = useMemo(() => collectIngredients(plan), [plan]);

  function toggle(key) {
    setAchats((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const remaining = items.filter((i) => !achats[`${i.nom}|${i.source}`]).length;

  return (
    <div className="view-epicerie">
      <header className="ep-head">
        <h2>Liste d'épicerie</h2>
        <p className="muted">{remaining} article{remaining > 1 ? 's' : ''} restant{remaining > 1 ? 's' : ''}</p>
      </header>

      {SOURCES.map((src) => {
        const list = items.filter((i) => i.source === src.key);
        if (list.length === 0) return null;
        return (
          <section key={src.key} className="ep-section">
            <h3>{src.emoji} {src.label} <small>({list.length})</small></h3>
            <ul className="ep-list">
              {list.map((i) => {
                const key = `${i.nom}|${i.source}`;
                const got = achats[key];
                return (
                  <li key={key} className={got ? 'got' : ''}>
                    <label>
                      <input type="checkbox" checked={!!got} onChange={() => toggle(key)} />
                      <span className="ep-name">{i.nom}</span>
                      <span className="ep-qte">{i.quantites.join(' + ')}</span>
                    </label>
                    <small className="ep-uses">{i.usedIn.slice(0, 2).join(', ')}{i.usedIn.length > 2 ? '…' : ''}</small>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <button
        className="btn btn-ghost"
        onClick={() => setAchats({})}
        style={{ marginTop: '1.5rem' }}
      >
        Tout réinitialiser
      </button>
    </div>
  );
}
