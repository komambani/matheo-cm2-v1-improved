// Générateur d'exercices « fraction d'une quantité » (N22), mission M3.
// Règle : les réponses sont toujours CALCULÉES par le code, jamais saisies à la main.
// Les mauvaises réponses viennent de la banque d'erreurs (codes E1 à E10 du document maître).

/** Générateur pseudo-aléatoire reproductible (mulberry32). */
export function creerAlea(graine) {
  let a = graine >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const entre = (alea, min, max) => min + Math.floor(alea() * (max - min + 1));
export const choisir = (alea, liste) => liste[Math.floor(alea() * liste.length)];

export function melanger(alea, liste) {
  const t = liste.slice();
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(alea() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

/** Calcule la fraction d'une quantité : partager par den, puis prendre num parts. */
export function fractionDe(total, num, den) {
  if (!Number.isInteger(total) || !Number.isInteger(num) || !Number.isInteger(den)) {
    throw new Error("Nombres entiers attendus");
  }
  if (den <= 0 || num <= 0 || num >= den) throw new Error("Fraction propre attendue");
  if (total % den !== 0) throw new Error(`${total} n'est pas divisible par ${den}`);
  const part = total / den;
  return { part, reponse: part * num };
}

/** Erreurs plausibles d'élève pour « num/den de total », avec leur code. */
export function reponsesFausses(total, num, den) {
  const { part, reponse } = fractionDe(total, num, den);
  const c = [];
  if (total % num === 0) c.push({ valeur: total / num, code: "E2" }); // partage avec le numérateur
  if (num > 1) c.push({ valeur: part, code: "E5" }); // oublie de prendre num parts
  c.push({ valeur: total * num, code: "E8" }); // multiplie
  c.push({ valeur: total - num, code: "E1" }); // soustrait le numérateur
  c.push({ valeur: total + num, code: "E1" }); // ajoute le numérateur
  c.push({ valeur: reponse - 2, code: "E3" }); // erreur de calcul
  c.push({ valeur: reponse + 2, code: "E3" });
  c.push({ valeur: total - reponse, code: "E9" }); // répond à une autre question
  const vus = new Set([reponse]);
  const sortie = [];
  for (const x of c) {
    if (!Number.isInteger(x.valeur) || x.valeur <= 0 || vus.has(x.valeur)) continue;
    vus.add(x.valeur);
    sortie.push(x);
  }
  return sortie;
}

const FRACTIONS = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10]];

// Contextes de la vie quotidienne béninoise (marché, école). Le verbe retire des objets du lot.
const CONTEXTES = [
  { objet: "mangues", sujet: "Mamie Sègla", pron: "Elle", verbe: "donne" },
  { objet: "galettes", sujet: "Mamie Sègla", pron: "Elle", verbe: "vend" },
  { objet: "beignets", sujet: "Mamie Sègla", pron: "Elle", verbe: "vend" },
  { objet: "sacs d'arachides", sujet: "Mamie Sègla", pron: "Elle", verbe: "vend" },
  { objet: "billes", sujet: "Kola", pron: "Il", verbe: "donne" },
  { objet: "cahiers", sujet: "Anita", pron: "Elle", verbe: "donne" }
];

/** « donne-t-elle », « vend-il » : liaison correcte du verbe et du pronom. */
const inverse = (verbe, pron) => `${verbe}${/[ea]$/.test(verbe) ? "-t-" : "-"}${pron.toLowerCase()}`;

/** Choisit un total multiple du dénominateur, entre 8 et 60 (nombres simples pour le CM2). */
function totalPour(alea, den) {
  const min = Math.max(2, Math.ceil(8 / den));
  const max = Math.floor(60 / den);
  return den * entre(alea, min, max);
}

function construireChoix(alea, bonne, fausses, nombre = 4) {
  const choisies = melanger(alea, fausses).slice(0, nombre - 1);
  const choix = melanger(alea, [{ valeur: bonne, correct: true, code: null }, ...choisies.map((f) => ({ ...f, correct: false }))]);
  return choix.map((x) => ({ ...x, texte: String(x.valeur) }));
}

/**
 * Fabrique une question.
 * Niveaux : A (reconnaissance), B (application directe), C (contexte), D (raisonnement vrai/faux).
 */
export function creerQuestion(alea, niveau = "B") {
  const [num, den] = choisir(alea, FRACTIONS);
  const total = totalPour(alea, den);
  const ctx = choisir(alea, CONTEXTES);
  const { part, reponse } = fractionDe(total, num, den);
  const base = { niveau, total, num, den, part, reponse, objet: ctx.objet };

  if (niveau === "A") {
    const vues = new Set([den]);
    const fausses = [{ valeur: num, code: "E2" }, { valeur: total, code: "E1" }, { valeur: num + den, code: "E1" }, { valeur: den + 2, code: "E1" }, { valeur: den + 5, code: "E1" }]
      .filter((x) => !vues.has(x.valeur) && vues.add(x.valeur));
    return { ...base, enonce: `Pour trouver les ${num}/${den} de ${total} ${ctx.objet}, par quoi partage-t-on d'abord ?`, bonne: den, choix: construireChoix(alea, den, fausses) };
  }
  if (niveau === "C") {
    const enonce = `${ctx.sujet} a ${total} ${ctx.objet}. ${ctx.pron} en ${ctx.verbe} les ${num}/${den}. Combien en ${inverse(ctx.verbe, ctx.pron)} ?`;
    return { ...base, enonce, bonne: reponse, choix: construireChoix(alea, reponse, reponsesFausses(total, num, den)) };
  }
  if (niveau === "D") {
    const gardees = total - reponse;
    // Valeurs fausses plausibles : la part donnée, une seule part, ou l'inverse. Jamais la bonne valeur.
    const candidats = [...new Set([reponse, part, total - part, gardees + part, gardees + 2, gardees - 1])].filter((x) => x !== gardees && x > 0);
    const affirmee = choisir(alea, candidats);
    const autre = candidats[0];
    return {
      ...base, gardees, affirmee,
      enonce: `${ctx.sujet} a ${total} ${ctx.objet}. ${ctx.pron} en ${ctx.verbe} les ${num}/${den} et dit : « J'en garde ${affirmee}. » Est-ce vrai ?`,
      bonne: gardees,
      choix: [
        { texte: "Vrai", correct: false, code: "E9" },
        { texte: `Faux : ${ctx.pron.toLowerCase()} en garde ${gardees}`, correct: true, code: null },
        { texte: `Faux : ${ctx.pron.toLowerCase()} en garde ${autre}`, correct: false, code: "E9" }
      ]
    };
  }
  // niveau B par défaut
  return { ...base, enonce: `Combien font les ${num}/${den} de ${total} ?`, bonne: reponse, choix: construireChoix(alea, reponse, reponsesFausses(total, num, den)) };
}

/** Remplit un modèle de message « Bip ! … » avec les nombres de la question. */
export function remplirModele(modele, valeurs) {
  return modele.replace(/\{(\w+)\}/g, (_, k) => (k in valeurs ? String(valeurs[k]) : `{${k}}`));
}

/** Message de Mathéo pour une mauvaise réponse, d'après les modèles du contenu. */
export function messageErreur(modeles, question, choix) {
  let code = choix.code;
  if (code === "E8" && !(choix.valeur > question.total)) code = "E8_autre";
  const modele = modeles[code] || modeles[choix.code];
  if (!modele) return "Bip ! Montre-moi comment tu as fait.";
  return remplirModele(modele, { num: question.num, den: question.den, total: question.total, part: question.part, valeur: choix.valeur });
}
