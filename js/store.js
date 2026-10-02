// Sauvegarde locale de la progression. Aucune donnée personnelle : pas de nom, pas d'identifiant.
// V1 : localStorage suffit pour ces quelques Ko. IndexedDB servira aux packs de contenu (V2).
const CLE = "matheo.v1";
let memoire = {};

function charger() {
  try { return JSON.parse(localStorage.getItem(CLE) || "{}") || {}; }
  catch { return memoire; }
}

export function lire(chemin, defaut) {
  let o = charger();
  for (const k of chemin.split(".")) {
    if (o == null || typeof o !== "object") return defaut;
    o = o[k];
  }
  return o === undefined ? defaut : o;
}

export function ecrire(chemin, valeur) {
  const racine = charger();
  const cles = chemin.split(".");
  let o = racine;
  for (const k of cles.slice(0, -1)) {
    if (typeof o[k] !== "object" || o[k] === null) o[k] = {};
    o = o[k];
  }
  o[cles[cles.length - 1]] = valeur;
  memoire = racine;
  try { localStorage.setItem(CLE, JSON.stringify(racine)); } catch { /* stockage indisponible : on garde en mémoire */ }
}

export function incrementer(chemin, pas = 1) {
  ecrire(chemin, lire(chemin, 0) + pas);
}

export function effacerTout() {
  memoire = {};
  try { localStorage.removeItem(CLE); } catch { /* rien */ }
}
