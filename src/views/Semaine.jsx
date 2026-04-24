import { useMemo, useState } from 'react';
import { JOURS, TYPES_REPAS, getRecette, RECETTES } from '../data/recipes';
import MealCard from '../components/MealCard';
import MealModal from '../components/MealModal';

function totalDay(plan, day) {
  const dayPlan = plan[day] || {};
  let kcal = 0, prot = 0;
  for (const type of ['dejeuner', 'diner', 'souper']) {
    const r = getRecette(dayPlan[type]);
    if (r) { kcal += r.nutrition.kcal; prot += r.nutrition.prot; }
  }
  for (const cid of dayPlan.collations || []) {
    const r = getRecette(cid);
    if (r) { kcal += r.nutrition.kcal; prot += r.nutrition.prot; }
  }
  return { kcal, prot };
}

function isDayComplete(plan, journal, day) {
  const dayPlan = plan[day] || {};
  const ids = [dayPlan.dejeuner, dayPlan.diner, dayPlan.souper, ...(dayPlan.collations || [])].filter(Boolean);
  if (ids.length === 0) return false;
  return ids.every((id) => journal[`${day}:${id}`]?.done);
}

export default function Semaine({ plan, setPlan, journal, setJournal, onGenerate }) {
  const today = new Date().getDay(); // 0=dim
  const jsToKey = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  const [activeDay, setActiveDay] = useState(jsToKey[today]);
  const [openMeal, setOpenMeal] = useState(null); // { day, type, recetteId, idx? }

  const weekTotals = useMemo(() => {
    return JOURS.reduce((acc, j) => {
      const t = totalDay(plan, j.key);
      return { kcal: acc.kcal + t.kcal, prot: acc.prot + t.prot };
    }, { kcal: 0, prot: 0 });
  }, [plan]);

  const dayTotals = totalDay(plan, activeDay);
  const dayPlan = plan[activeDay] || { collations: [] };
  const dayLong = JOURS.find((j) => j.key === activeDay)?.long || '';

  function journalKey(day, id) { return `${day}:${id}`; }

  function patchJournal(day, id, patch) {
    const k = journalKey(day, id);
    setJournal((prev) => ({ ...prev, [k]: { ...prev[k], ...patch } }));
  }

  function setMealInPlan(day, type, recetteId, idx = null) {
    setPlan((prev) => {
      const d = { ...(prev[day] || {}) };
      if (type === 'collations') {
        const arr = [...(d.collations || [])];
        if (idx === null || idx >= arr.length) arr.push(recetteId);
        else arr[idx] = recetteId;
        d.collations = arr;
      } else {
        d[type] = recetteId;
      }
      return { ...prev, [day]: d };
    });
  }

  function removeCollation(day, idx) {
    setPlan((prev) => {
      const d = { ...(prev[day] || {}) };
      const arr = [...(d.collations || [])];
      arr.splice(idx, 1);
      d.collations = arr;
      return { ...prev, [day]: d };
    });
  }

  function openSlot(day, type, recetteId, idx = null) {
    if (!recetteId) {
      // Offrir la première recette du type comme défaut
      const defaults = RECETTES.filter((r) => r.type === (type === 'collations' ? 'collation' : type) && !r.batchFrom);
      if (defaults[0]) {
        setMealInPlan(day, type, defaults[0].id, idx);
        setOpenMeal({ day, dayLong: JOURS.find((j) => j.key === day).long, type, recetteId: defaults[0].id, idx });
      }
      return;
    }
    setOpenMeal({ day, dayLong: JOURS.find((j) => j.key === day).long, type, recetteId, idx });
  }

  const current = openMeal;
  const currentRecetteId = current?.recetteId;
  const currentJournal = current ? journal[journalKey(current.day, current.recetteId)] || {} : {};

  return (
    <div className="view-semaine">
      <div className="week-summary">
        <div className="summary-chip">
          <strong>{weekTotals.kcal.toLocaleString('fr-CA')}</strong>
          <small>kcal / semaine</small>
        </div>
        <div className="summary-chip">
          <strong>{weekTotals.prot} g</strong>
          <small>prot / semaine</small>
        </div>
        <button className="btn btn-generate" onClick={onGenerate}>
          ✨ Générer plan
        </button>
      </div>

      <nav className="day-tabs">
        {JOURS.map((j) => {
          const complete = isDayComplete(plan, journal, j.key);
          return (
            <button
              key={j.key}
              onClick={() => setActiveDay(j.key)}
              className={`day-tab ${activeDay === j.key ? 'is-active' : ''} ${complete ? 'is-complete' : ''}`}
            >
              <span className="day-tab-short">{j.court}</span>
              {complete && <span className="day-dot" aria-label="Jour complété" />}
            </button>
          );
        })}
      </nav>

      <div className="day-header">
        <h2>{dayLong}</h2>
        <div className="day-totals">
          <span>🔥 {dayTotals.kcal} kcal</span>
          <span>💪 {dayTotals.prot} g prot</span>
        </div>
      </div>

      <div className="meal-stack">
        {TYPES_REPAS.filter((t) => t.key !== 'collations').map((t) => (
          <section key={t.key} className="meal-row">
            <h3 className="meal-row-title">{t.label}</h3>
            <MealCard
              recetteId={dayPlan[t.key]}
              journalEntry={journal[journalKey(activeDay, dayPlan[t.key])]}
              onClick={() => openSlot(activeDay, t.key, dayPlan[t.key])}
            />
          </section>
        ))}

        <section className="meal-row">
          <h3 className="meal-row-title">
            Collations
            <button
              className="btn btn-ghost btn-xs"
              onClick={() => openSlot(activeDay, 'collations', null, (dayPlan.collations || []).length)}
            >
              + ajouter
            </button>
          </h3>
          <div className="collations">
            {(dayPlan.collations || []).map((cid, idx) => (
              <div key={idx} className="collation-wrap">
                <MealCard
                  recetteId={cid}
                  journalEntry={journal[journalKey(activeDay, cid)]}
                  onClick={() => openSlot(activeDay, 'collations', cid, idx)}
                  compact
                />
                <button
                  className="btn btn-ghost btn-xs collation-remove"
                  onClick={() => removeCollation(activeDay, idx)}
                  aria-label="Retirer"
                >
                  ×
                </button>
              </div>
            ))}
            {(dayPlan.collations || []).length === 0 && (
              <p className="muted">Aucune collation prévue.</p>
            )}
          </div>
        </section>
      </div>

      {current && currentRecetteId && (
        <MealModal
          recetteId={currentRecetteId}
          mealSlot={current}
          journalEntry={currentJournal}
          onUpdate={(patch) => patchJournal(current.day, current.recetteId, patch)}
          onReplace={(newId) => {
            setMealInPlan(current.day, current.type, newId, current.idx);
            setOpenMeal({ ...current, recetteId: newId });
          }}
          onClose={() => setOpenMeal(null)}
        />
      )}
    </div>
  );
}
