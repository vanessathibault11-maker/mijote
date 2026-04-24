// Banque de recettes Mijote — MVP draft
// Nutrition par portion (kcal, prot g, lip g, gluc g, fib g) — estimations Santé Canada/USDA
// bebe = adapté DME 10 mois
// batchFrom = id recette qui a produit les restants

export const RECETTES = [
  {
    id: 'gruau-proteine',
    nom: 'Gruau protéiné aux bleuets',
    type: 'dejeuner',
    tempsMin: 8,
    portions: 1,
    bebe: true,
    tags: ['batch-3j', 'protéiné'],
    nutrition: { kcal: 480, prot: 32, lip: 14, gluc: 58, fib: 9 },
    ingredients: [
      { nom: "Flocons d'avoine", qte: '60 g', source: 'garde-manger' },
      { nom: 'Lait 3,25%', qte: '250 ml', source: 'lufa' },
      { nom: 'Poudre protéinée vanille', qte: '30 g', source: 'garde-manger' },
      { nom: 'Bleuets frais', qte: '80 g', source: 'lufa' },
      { nom: 'Beurre d’arachide', qte: '1 c. à soupe', source: 'garde-manger' },
    ],
    etapes: [
      { texte: 'Mélanger avoine + lait dans un bol, cuire 2 min micro-ondes.', timer: 120 },
      { texte: 'Laisser reposer 1 min puis incorporer la poudre protéinée.', timer: 60 },
      { texte: 'Ajouter bleuets et beurre d’arachide sur le dessus.', timer: 0 },
    ],
  },
  {
    id: 'oeufs-brouilles-avocat',
    nom: 'Œufs brouillés + avocat + pain',
    type: 'dejeuner',
    tempsMin: 10,
    portions: 2,
    bebe: true,
    tags: ['rapide', 'protéiné'],
    nutrition: { kcal: 520, prot: 28, lip: 30, gluc: 34, fib: 10 },
    ingredients: [
      { nom: 'Œufs', qte: '4', source: 'lufa' },
      { nom: 'Avocat mûr', qte: '1', source: 'lufa' },
      { nom: 'Pain de blé entier', qte: '2 tranches', source: 'iga' },
      { nom: 'Beurre', qte: '10 g', source: 'garde-manger' },
      { nom: 'Ciboulette', qte: 'au goût', source: 'lufa' },
    ],
    etapes: [
      { texte: 'Faire fondre le beurre, ajouter œufs battus à feu doux.', timer: 180 },
      { texte: 'Remuer doucement jusqu’à consistance crémeuse.', timer: 120 },
      { texte: 'Griller le pain, tartiner d’avocat écrasé.', timer: 60 },
      { texte: 'Servir ensemble, parsemer de ciboulette.', timer: 0 },
    ],
  },
  {
    id: 'bol-poulet-quinoa',
    nom: 'Bol poulet-quinoa-légumes rôtis',
    type: 'diner',
    tempsMin: 35,
    portions: 4,
    bebe: true,
    tags: ['batch', 'meal-prep'],
    nutrition: { kcal: 610, prot: 42, lip: 22, gluc: 58, fib: 9 },
    ingredients: [
      { nom: 'Poitrines de poulet', qte: '600 g', source: 'lufa' },
      { nom: 'Quinoa', qte: '200 g', source: 'garde-manger' },
      { nom: 'Courgettes', qte: '2', source: 'lufa' },
      { nom: 'Poivrons rouges', qte: '2', source: 'lufa' },
      { nom: 'Huile d’olive', qte: '3 c. à soupe', source: 'garde-manger' },
      { nom: 'Paprika fumé', qte: '1 c. à thé', source: 'garde-manger' },
      { nom: 'Citron', qte: '1', source: 'lufa' },
    ],
    etapes: [
      { texte: 'Préchauffer four à 220°C.', timer: 0 },
      { texte: 'Couper légumes, mélanger huile + paprika, étaler sur plaque.', timer: 300 },
      { texte: 'Rôtir légumes 20 min.', timer: 1200 },
      { texte: 'Cuire quinoa 15 min à l’eau bouillante salée.', timer: 900 },
      { texte: 'Poêler poulet 6 min par côté, trancher.', timer: 720 },
      { texte: 'Assembler les bols, arroser de jus de citron.', timer: 0 },
    ],
  },
  {
    id: 'restes-poulet-quinoa',
    nom: 'Restes — Bol poulet-quinoa',
    type: 'diner',
    tempsMin: 3,
    portions: 1,
    bebe: true,
    tags: ['restant'],
    batchFrom: 'bol-poulet-quinoa',
    nutrition: { kcal: 610, prot: 42, lip: 22, gluc: 58, fib: 9 },
    ingredients: [{ nom: 'Restes bol poulet-quinoa', qte: '1 portion', source: 'frigo' }],
    etapes: [{ texte: 'Réchauffer 2 min au micro-ondes.', timer: 120 }],
  },
  {
    id: 'saumon-riz-brocoli',
    nom: 'Saumon grillé, riz basmati, brocoli vapeur',
    type: 'souper',
    tempsMin: 25,
    portions: 2,
    bebe: true,
    tags: ['oméga-3'],
    nutrition: { kcal: 640, prot: 40, lip: 26, gluc: 60, fib: 6 },
    ingredients: [
      { nom: 'Filets de saumon', qte: '2 (180 g)', source: 'lufa' },
      { nom: 'Riz basmati', qte: '180 g', source: 'garde-manger' },
      { nom: 'Brocoli', qte: '1 tête', source: 'lufa' },
      { nom: 'Sauce soya', qte: '2 c. à soupe', source: 'garde-manger' },
      { nom: 'Gingembre frais', qte: '1 c. à thé', source: 'lufa' },
    ],
    etapes: [
      { texte: 'Rincer et cuire riz 12 min couvert.', timer: 720 },
      { texte: 'Cuire brocoli vapeur 5 min.', timer: 300 },
      { texte: 'Poêler saumon 4 min côté peau, 3 min de l’autre.', timer: 420 },
      { texte: 'Napper de sauce soya + gingembre.', timer: 0 },
    ],
  },
  {
    id: 'sauce-boulognaise-batch',
    nom: 'Sauce bolognaise maison (batch)',
    type: 'souper',
    tempsMin: 60,
    portions: 6,
    bebe: true,
    tags: ['batch', 'congélo'],
    nutrition: { kcal: 520, prot: 32, lip: 22, gluc: 48, fib: 7 },
    ingredients: [
      { nom: 'Bœuf haché mi-maigre', qte: '600 g', source: 'lufa' },
      { nom: 'Oignon', qte: '1', source: 'lufa' },
      { nom: 'Carottes', qte: '2', source: 'lufa' },
      { nom: 'Céleri', qte: '2 branches', source: 'lufa' },
      { nom: 'Ail', qte: '3 gousses', source: 'lufa' },
      { nom: 'Tomates en dés', qte: '2 boîtes (796 ml)', source: 'garde-manger' },
      { nom: 'Pâte de tomate', qte: '3 c. à soupe', source: 'garde-manger' },
      { nom: 'Pâtes rigatoni', qte: '500 g', source: 'garde-manger' },
      { nom: 'Origan séché', qte: '1 c. à thé', source: 'garde-manger' },
    ],
    etapes: [
      { texte: 'Hacher oignon, carottes, céleri, ail.', timer: 360 },
      { texte: 'Faire revenir les légumes 8 min.', timer: 480 },
      { texte: 'Ajouter bœuf, dorer 6 min.', timer: 360 },
      { texte: 'Pâte de tomate, tomates, origan. Mijoter 40 min.', timer: 2400 },
      { texte: 'Cuire pâtes al dente selon paquet.', timer: 600 },
    ],
  },
  {
    id: 'restes-bolognaise',
    nom: 'Restes — Bolognaise + pâtes',
    type: 'souper',
    tempsMin: 10,
    portions: 1,
    bebe: true,
    tags: ['restant'],
    batchFrom: 'sauce-boulognaise-batch',
    nutrition: { kcal: 520, prot: 32, lip: 22, gluc: 48, fib: 7 },
    ingredients: [
      { nom: 'Restes sauce bolognaise', qte: '1 portion', source: 'frigo' },
      { nom: 'Pâtes rigatoni', qte: '80 g sec', source: 'garde-manger' },
    ],
    etapes: [
      { texte: 'Faire bouillir pâtes 9 min.', timer: 540 },
      { texte: 'Réchauffer sauce à la poêle 4 min.', timer: 240 },
    ],
  },
  {
    id: 'buddha-bowl-tofu',
    nom: 'Buddha bowl tofu-patate douce',
    type: 'diner',
    tempsMin: 30,
    portions: 2,
    bebe: true,
    tags: ['végé'],
    nutrition: { kcal: 580, prot: 28, lip: 24, gluc: 62, fib: 12 },
    ingredients: [
      { nom: 'Tofu ferme', qte: '400 g', source: 'lufa' },
      { nom: 'Patate douce', qte: '1 grosse', source: 'lufa' },
      { nom: 'Épinards', qte: '2 poignées', source: 'lufa' },
      { nom: 'Pois chiches cuits', qte: '1 boîte', source: 'garde-manger' },
      { nom: 'Tahini', qte: '2 c. à soupe', source: 'garde-manger' },
      { nom: 'Jus de citron', qte: '1 c. à soupe', source: 'lufa' },
    ],
    etapes: [
      { texte: 'Couper patate douce en dés, rôtir 20 min à 220°C.', timer: 1200 },
      { texte: 'Presser tofu, cuber, poêler 8 min doré.', timer: 480 },
      { texte: 'Mélanger tahini + citron + eau = sauce.', timer: 60 },
      { texte: 'Assembler: épinards, patate, tofu, pois chiches, sauce.', timer: 0 },
    ],
  },
  {
    id: 'yogourt-granola',
    nom: 'Yogourt grec, granola, fruits',
    type: 'collation',
    tempsMin: 3,
    portions: 1,
    bebe: true,
    tags: ['protéiné', 'rapide'],
    nutrition: { kcal: 320, prot: 22, lip: 9, gluc: 42, fib: 5 },
    ingredients: [
      { nom: 'Yogourt grec nature 2%', qte: '200 g', source: 'lufa' },
      { nom: 'Granola', qte: '40 g', source: 'garde-manger' },
      { nom: 'Fraises ou framboises', qte: '80 g', source: 'lufa' },
      { nom: 'Miel', qte: '1 c. à thé', source: 'garde-manger' },
    ],
    etapes: [
      { texte: 'Déposer yogourt dans un bol.', timer: 0 },
      { texte: 'Ajouter granola, fruits, miel.', timer: 0 },
    ],
  },
  {
    id: 'pomme-beurre-arachide',
    nom: 'Pomme + beurre d’arachide',
    type: 'collation',
    tempsMin: 2,
    portions: 1,
    bebe: false,
    tags: ['rapide'],
    nutrition: { kcal: 240, prot: 7, lip: 14, gluc: 26, fib: 6 },
    ingredients: [
      { nom: 'Pomme', qte: '1', source: 'lufa' },
      { nom: 'Beurre d’arachide naturel', qte: '2 c. à soupe', source: 'garde-manger' },
    ],
    etapes: [
      { texte: 'Trancher la pomme.', timer: 0 },
      { texte: 'Tremper dans le beurre d’arachide.', timer: 0 },
    ],
  },
  {
    id: 'soupe-lentilles',
    nom: 'Soupe lentilles corail & légumes',
    type: 'diner',
    tempsMin: 25,
    portions: 4,
    bebe: true,
    tags: ['batch', 'végé'],
    nutrition: { kcal: 420, prot: 22, lip: 8, gluc: 64, fib: 14 },
    ingredients: [
      { nom: 'Lentilles corail', qte: '250 g', source: 'garde-manger' },
      { nom: 'Carottes', qte: '3', source: 'lufa' },
      { nom: 'Oignon', qte: '1', source: 'lufa' },
      { nom: 'Bouillon de poulet', qte: '1,5 L', source: 'garde-manger' },
      { nom: 'Cumin moulu', qte: '1 c. à thé', source: 'garde-manger' },
      { nom: 'Lait de coco', qte: '1 boîte (400 ml)', source: 'garde-manger' },
    ],
    etapes: [
      { texte: 'Couper oignon et carottes.', timer: 300 },
      { texte: 'Revenir 5 min, ajouter cumin.', timer: 300 },
      { texte: 'Ajouter lentilles + bouillon, cuire 15 min.', timer: 900 },
      { texte: 'Ajouter lait de coco, mixer si désiré.', timer: 120 },
    ],
  },
];

// Plan par défaut (Lun-Dim) — utilisé comme fallback / seed initial
// Chaque jour: dejeuner, diner, souper, collations
export const PLAN_DEFAUT = {
  lundi: {
    dejeuner: 'gruau-proteine',
    diner: 'bol-poulet-quinoa',
    souper: 'sauce-boulognaise-batch',
    collations: ['yogourt-granola'],
  },
  mardi: {
    dejeuner: 'oeufs-brouilles-avocat',
    diner: 'restes-poulet-quinoa',
    souper: 'restes-bolognaise',
    collations: ['pomme-beurre-arachide'],
  },
  mercredi: {
    dejeuner: 'gruau-proteine',
    diner: 'buddha-bowl-tofu',
    souper: 'saumon-riz-brocoli',
    collations: ['yogourt-granola'],
  },
  jeudi: {
    dejeuner: 'oeufs-brouilles-avocat',
    diner: 'restes-poulet-quinoa',
    souper: 'restes-bolognaise',
    collations: ['pomme-beurre-arachide'],
  },
  vendredi: {
    dejeuner: 'gruau-proteine',
    diner: 'soupe-lentilles',
    souper: 'saumon-riz-brocoli',
    collations: ['yogourt-granola'],
  },
  samedi: {
    dejeuner: 'oeufs-brouilles-avocat',
    diner: 'soupe-lentilles',
    souper: 'buddha-bowl-tofu',
    collations: ['pomme-beurre-arachide'],
  },
  dimanche: {
    dejeuner: 'gruau-proteine',
    diner: 'soupe-lentilles',
    souper: 'sauce-boulognaise-batch',
    collations: ['yogourt-granola'],
  },
};

export const JOURS = [
  { key: 'lundi', court: 'Lun', long: 'Lundi' },
  { key: 'mardi', court: 'Mar', long: 'Mardi' },
  { key: 'mercredi', court: 'Mer', long: 'Mercredi' },
  { key: 'jeudi', court: 'Jeu', long: 'Jeudi' },
  { key: 'vendredi', court: 'Ven', long: 'Vendredi' },
  { key: 'samedi', court: 'Sam', long: 'Samedi' },
  { key: 'dimanche', court: 'Dim', long: 'Dimanche' },
];

export const TYPES_REPAS = [
  { key: 'dejeuner', label: 'Déjeuner' },
  { key: 'diner', label: 'Dîner' },
  { key: 'souper', label: 'Souper' },
  { key: 'collations', label: 'Collations' },
];

export function getRecette(id) {
  return RECETTES.find((r) => r.id === id);
}

export function recettesParType(type) {
  return RECETTES.filter((r) => r.type === type && !r.batchFrom);
}
