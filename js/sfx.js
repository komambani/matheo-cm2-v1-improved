// Effets sonores générés par Web Audio : aucun fichier, aucun poids. Le son se coupe d'un bouton.
import { lire, ecrire } from "./store.js";

let ctx = null;
const actif = () => lire("son", true) !== false;

function contexte() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function note(freq, debut, duree, { type = "sine", volume = 0.12 } = {}) {
  const c = contexte();
  if (!c) return;
  const t0 = c.currentTime + debut;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(volume, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duree);
  o.connect(g).connect(c.destination);
  o.start(t0);
  o.stop(t0 + duree + 0.05);
}

export const sfx = {
  /** « Bip ! » de Mathéo. */
  bip() { if (actif()) { note(880, 0, 0.09); note(1175, 0.1, 0.12); } },
  /** Petit son doux pour une erreur : jamais agressif. */
  oups() { if (actif()) { note(330, 0, 0.16, { volume: 0.09 }); note(262, 0.14, 0.22, { volume: 0.08 }); } },
  pop() { if (actif()) note(620 + Math.random() * 120, 0, 0.07, { volume: 0.1 }); },
  /** Réussite : arpège ascendant. */
  bravo() { if (actif()) [523, 659, 784, 1047].forEach((f, i) => note(f, i * 0.09, 0.28, { volume: 0.13 })); },
  /** Grand moment : fragment de boussole gagné. */
  fragment() { if (actif()) [392, 523, 659, 784, 1047, 1319].forEach((f, i) => note(f, i * 0.13, 0.55, { volume: 0.12 })); },
  etoile() { if (actif()) note(1568, 0, 0.35, { volume: 0.07 }); }
};

export function basculerSon() {
  const v = !actif();
  ecrire("son", v);
  return v;
}
export const sonActif = actif;
