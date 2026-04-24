import { useCallback, useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PLAN_DEFAUT, RECETTES, JOURS, getRecette } from './data/recipes';
import Login from './views/Login';
import Semaine from './views/Semaine';
import Epicerie from './views/Epicerie';
import Journal from './views/Journal';

const TABS = [
  { key: 'semaine', label: 'Semaine', emoji: '📅' },
  { key: 'epicerie', label: 'Épicerie', emoji: '🛒' },
  { key: 'journal', label: 'Journal', emoji: '📓' },
];

function genererPlan() {
  // Fix du bug "génération plan hebdo": on sépare batch, restants, et recettes standards.
  // Stratégie: choisir 1-2 batch (souper ou diner) + remplir le reste avec des recettes
  // uniques + placer les restants les jours qui suivent la cuisson du batch.

  const dejeuners = RECETTES.filter((r) => r.type === 'dejeuner' && !r.batchFrom);
  const diners = RECETTES.filter((r) => r.type === 'diner' && !r.batchFrom);
  const soupers = RECETTES.filter((r) => r.type === 'souper' && !r.batchFrom);
  const collations = RECETTES.filter((r) => r.type === 'collation' && !r.batchFrom);

  const restantDe = (id) => RECETTES.find((r) => r.batchFrom === id);

  function pick(arr, n) {
    const c = [...arr];
    const out = [];
    while (out.length < n && c.length) {
      out.push(c.splice(Math.floor(Math.random() * c.length), 1)[0]);
    }
    return out;
  }

  // Souper: 2 batch cookings (Lun & Mer typiquement) + 5 autres souper
  const batchSoupers = soupers.filter((r) => r.tags.includes('batch'));
  const nonBatchSoupers = soupers.filter((r) => !r.tags.includes('batch'));
  const batch1 = batchSoupers[Math.floor(Math.random() * batchSoupers.length)];
  let batch2 = batchSoupers[Math.floor(Math.random() * batchSoupers.length)];
  if (batch2 === batch1 && batchSoupers.length > 1) {
    batch2 = batchSoupers.find((b) => b !== batch1) || batch2;
  }

  const souperOrder = Array(7).fill(null);
  souperOrder[0] = batch1?.id;
  if (batch1 && restantDe(batch1.id)) souperOrder[1] = restantDe(batch1.id).id;
  souperOrder[2] = batch2?.id || null;
  if (batch2 && restantDe(batch2.id)) souperOrder[3] = restantDe(batch2.id).id;
  const fillSoupers = pick(nonBatchSoupers, 4);
  for (let i = 0; i < souperOrder.length; i++) {
    if (!souperOrder[i] && fillSoupers.length) {
      souperOrder[i] = fillSoupers.shift().id;
    }
  }
  // Fallback pour combler
  for (let i = 0; i < 7; i++) {
    if (!souperOrder[i]) souperOrder[i] = soupers[i % soupers.length].id;
  }

  // Dîner: batch possibles (soupe lentilles) + restants des soupers batch
  const diner = Array(7).fill(null);
  const batchDiners = diners.filter((r) => r.tags.includes('batch'));
  if (batchDiners.length) {
    diner[0] = batchDiners[0].id;
    diner[1] = batchDiners[0].id;
  }
  const fillDiners = pick(diners.filter((r) => !r.tags.includes('batch')), 7);
  for (let i = 0; i < 7; i++) {
    if (!diner[i] && fillDiners.length) diner[i] = fillDiners.shift().id;
  }
  for (let i = 0; i < 7; i++) {
    if (!diner[i]) diner[i] = diners[i % diners.length].id;
  }

  // Déjeuners: on alterne 2-3 options
  const dejPick = pick(dejeuners, Math.min(3, dejeuners.length));
  const dej = Array.from({ length: 7 }, (_, i) => dejPick[i % dejPick.length].id);

  // Collations: 1 par jour en alternance
  const colPick = pick(collations, Math.min(2, collations.length));
  const col = Array.from({ length: 7 }, (_, i) => [colPick[i % colPick.length].id]);

  const plan = {};
  JOURS.forEach((j, i) => {
    plan[j.key] = {
      dejeuner: dej[i],
      diner: diner[i],
      souper: souperOrder[i],
      collations: col[i],
    };
  });
  return plan;
}

export default function App() {
  const [authed, setAuthed] = useLocalStorage('mijote.auth', false);
  const [tab, setTab] = useState('semaine');
  const [plan, setPlan] = useLocalStorage('mijote.plan', PLAN_DEFAUT);
  const [journal, setJournal] = useLocalStorage('mijote.journal', {});
  const [achats, setAchats] = useLocalStorage('mijote.achats', {});

  const onGenerate = useCallback(() => {
    if (!confirm('Générer un nouveau plan écrasera le plan actuel. Continuer?')) return;
    setPlan(genererPlan());
  }, [setPlan]);

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-emoji">🍲</span>
          <span className="brand-name">Mijote</span>
        </div>
        <button className="btn btn-ghost btn-xs" onClick={() => setAuthed(false)}>
          Déconnexion
        </button>
      </header>

      <main className="app-main">
        {tab === 'semaine' && (
          <Semaine
            plan={plan}
            setPlan={setPlan}
            journal={journal}
            setJournal={setJournal}
            onGenerate={onGenerate}
          />
        )}
        {tab === 'epicerie' && (
          <Epicerie plan={plan} achats={achats} setAchats={setAchats} />
        )}
        {tab === 'journal' && <Journal plan={plan} journal={journal} />}
      </main>

      <nav className="app-tabbar">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tabbar-btn ${tab === t.key ? 'is-active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            <span className="tb-emoji">{t.emoji}</span>
            <span className="tb-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
