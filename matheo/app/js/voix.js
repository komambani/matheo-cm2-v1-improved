// Lecture des voix pré-générées (Piper, gratuit, hors ligne). Le texte reste toujours affiché :
// si le fichier audio n'existe pas, la voix est simplement ignorée.
import { sonActif } from "./sfx.js";

let index = null;
let courant = null;

async function chargerIndex() {
  if (index) return index;
  try {
    const r = await fetch("audio/index.json", { cache: "no-cache" });
    index = r.ok ? await r.json() : {};
  } catch { index = {}; }
  return index;
}

/** Identifiant stable d'un texte (même calcul que tools/voix/generer_voix.ps1). */
export function idVoix(texte) {
  let h = 2166136261;
  for (const c of texte) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return h.toString(16).padStart(8, "0");
}

export async function dire(texte) {
  if (!sonActif()) return false;
  const idx = await chargerIndex();
  const fichier = idx[idVoix(texte)];
  if (!fichier) return false;
  arreter();
  courant = new Audio(`audio/${fichier}`);
  try { await courant.play(); return true; } catch { return false; }
}

/** Lit une phrase et attend la fin. Renvoie false s'il n'y a pas de voix (le texte reste affiché). */
export async function lire(texte) {
  if (!sonActif()) return false;
  const idx = await chargerIndex();
  const fichier = idx[idVoix(texte)];
  if (!fichier) return false;
  arreter();
  const a = new Audio(`audio/${fichier}`);
  courant = a;
  return new Promise((fin) => {
    a.onended = () => fin(true);
    a.onerror = () => fin(false);
    a.play().catch(() => fin(false));
  });
}

export function pauseVoix(enPause) {
  if (!courant) return;
  if (enPause) courant.pause(); else courant.play().catch(() => {});
}

export function arreter() {
  if (courant) { courant.pause(); courant = null; }
}

export async function voixDisponible() {
  return Object.keys(await chargerIndex()).length > 0;
}
