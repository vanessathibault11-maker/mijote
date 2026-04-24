import { getRecette } from '../data/recipes';

export default function MealCard({ recetteId, journalEntry, onClick, compact }) {
  const r = getRecette(recetteId);
  if (!r) {
    return (
      <button className="meal-card meal-card--empty" onClick={onClick}>
        <span className="meal-empty-label">+ Choisir</span>
      </button>
    );
  }
  const done = journalEntry?.done;
  const rating = journalEntry?.rating ?? 0;

  return (
    <button className={`meal-card ${done ? 'is-done' : ''}`} onClick={onClick}>
      <div className="meal-card-head">
        <span className="meal-name">{r.nom}</span>
        {done && <span className="meal-check" aria-label="Fait">✓</span>}
      </div>
      {!compact && (
        <div className="meal-meta">
          <span>⏱ {r.tempsMin} min</span>
          <span>· {r.nutrition.kcal} kcal</span>
          <span>· {r.nutrition.prot} g prot</span>
        </div>
      )}
      <div className="meal-badges">
        {r.bebe && <span className="badge badge-baby">👶 bébé</span>}
        {r.tags.includes('batch') && <span className="badge badge-batch">🍳 batch</span>}
        {r.tags.includes('restant') && <span className="badge badge-left">♻️ restant</span>}
        {r.tags.includes('rapide') && <span className="badge badge-fast">⚡ rapide</span>}
        {r.tags.includes('protéiné') && <span className="badge badge-prot">💪 protéiné</span>}
        {r.tags.includes('végé') && <span className="badge badge-veg">🌱 végé</span>}
        {rating > 0 && (
          <span className="badge badge-star">
            {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
          </span>
        )}
      </div>
    </button>
  );
}
