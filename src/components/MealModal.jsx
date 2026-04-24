import { useEffect, useState } from 'react';
import { getRecette, RECETTES, TYPES_REPAS } from '../data/recipes';

function Timer({ seconds, active, onToggle, onReset }) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    setLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!active) return;
    if (left <= 0) return;
    const id = setInterval(() => setLeft((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(id);
  }, [active, left]);

  if (!seconds) return null;
  const m = Math.floor(left / 60);
  const s = String(left % 60).padStart(2, '0');
  return (
    <div className="step-timer">
      <span className={`step-time ${left === 0 && seconds > 0 ? 'is-done' : ''}`}>
        {m}:{s}
      </span>
      <button className="btn btn-ghost btn-xs" onClick={onToggle}>
        {active ? 'Pause' : 'Démarrer'}
      </button>
      <button className="btn btn-ghost btn-xs" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}

export default function MealModal({ recetteId, mealSlot, journalEntry, onUpdate, onReplace, onClose }) {
  const [tab, setTab] = useState('resume'); // resume | etapes | note
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerNonce, setTimerNonce] = useState(0);
  const [showSwap, setShowSwap] = useState(false);

  const r = getRecette(recetteId);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!r) return null;

  const done = journalEntry?.done ?? false;
  const rating = journalEntry?.rating ?? 0;
  const note = journalEntry?.note ?? '';

  const filteredSwap = RECETTES.filter(
    (x) => x.type === r.type && x.id !== r.id,
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <div>
            <span className="modal-subtitle">
              {mealSlot?.dayLong} · {TYPES_REPAS.find((t) => t.key === mealSlot?.type)?.label}
            </span>
            <h2>{r.nom}</h2>
          </div>
          <button className="btn btn-close" onClick={onClose} aria-label="Fermer">✕</button>
        </header>

        <div className="modal-quickmeta">
          <span>⏱ {r.tempsMin} min</span>
          <span>🍽 {r.portions} portion{r.portions > 1 ? 's' : ''}</span>
          <span>🔥 {r.nutrition.kcal} kcal</span>
          <span>💪 {r.nutrition.prot} g prot</span>
        </div>

        <nav className="modal-tabs">
          {[
            ['resume', 'Résumé'],
            ['etapes', 'Étapes'],
            ['note', 'Journal'],
          ].map(([k, label]) => (
            <button
              key={k}
              className={`tab ${tab === k ? 'is-active' : ''}`}
              onClick={() => setTab(k)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="modal-body">
          {tab === 'resume' && (
            <div className="tab-panel">
              <h3>Ingrédients</h3>
              <ul className="ingr-list">
                {r.ingredients.map((i, idx) => (
                  <li key={idx}>
                    <span>{i.nom}</span>
                    <span className="ingr-qte">{i.qte}</span>
                  </li>
                ))}
              </ul>

              <h3>Nutrition / portion</h3>
              <div className="nutri-grid">
                <div><span>{r.nutrition.kcal}</span><small>kcal</small></div>
                <div><span>{r.nutrition.prot} g</span><small>prot</small></div>
                <div><span>{r.nutrition.lip} g</span><small>lip</small></div>
                <div><span>{r.nutrition.gluc} g</span><small>gluc</small></div>
                <div><span>{r.nutrition.fib} g</span><small>fib</small></div>
              </div>

              <div className="modal-tags">
                {r.bebe && <span className="badge badge-baby">👶 bébé DME</span>}
                {r.tags.map((t) => (
                  <span key={t} className="badge">{t}</span>
                ))}
              </div>
            </div>
          )}

          {tab === 'etapes' && (
            <div className="tab-panel">
              <ol className="steps">
                {r.etapes.map((step, idx) => (
                  <li key={idx}>
                    <div className="step-text">{step.texte}</div>
                    {step.timer > 0 && (
                      <Timer
                        key={`t-${idx}-${timerNonce}`}
                        seconds={step.timer}
                        active={activeTimer === idx}
                        onToggle={() => setActiveTimer(activeTimer === idx ? null : idx)}
                        onReset={() => { setActiveTimer(null); setTimerNonce((n) => n + 1); }}
                      />
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {tab === 'note' && (
            <div className="tab-panel">
              <label className="done-row">
                <input
                  type="checkbox"
                  checked={done}
                  onChange={(e) => onUpdate({ done: e.target.checked })}
                />
                <span>Repas complété</span>
              </label>

              <div className="rating-row">
                <span className="rating-label">Appréciation</span>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      className={`star ${n <= rating ? 'is-on' : ''}`}
                      onClick={() => onUpdate({ rating: n === rating ? 0 : n })}
                      aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
                    >
                      {n <= rating ? '★' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              <label className="field">
                <span>Notes</span>
                <textarea
                  rows={4}
                  value={note}
                  onChange={(e) => onUpdate({ note: e.target.value })}
                  placeholder="Comment c'était? Ajustements pour la prochaine fois..."
                />
              </label>
            </div>
          )}
        </div>

        <footer className="modal-foot">
          <button className="btn btn-ghost" onClick={() => setShowSwap((v) => !v)}>
            🔄 Remplacer
          </button>
          <button className="btn btn-primary" onClick={onClose}>Fermer</button>
        </footer>

        {showSwap && (
          <div className="swap-panel">
            <p>Choisis une autre recette ({TYPES_REPAS.find((t) => t.key === r.type)?.label}):</p>
            <ul>
              {filteredSwap.map((x) => (
                <li key={x.id}>
                  <button
                    className="swap-item"
                    onClick={() => { onReplace(x.id); setShowSwap(false); }}
                  >
                    <strong>{x.nom}</strong>
                    <small>{x.tempsMin} min · {x.nutrition.kcal} kcal</small>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
