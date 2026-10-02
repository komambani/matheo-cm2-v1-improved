// Manipulation « lots » : N objets se regroupent en d lots égaux ; l'enfant choisit des lots ;
// ils partent dans le panier. L'enfant VOIT « partager avec le bas, prendre avec le haut » avant de calculer.
import { sfx } from "./sfx.js";

const NS = "http://www.w3.org/2000/svg";
const LARGEUR = 360, HAUT_LOTS = 225, HAUTEUR = 356;
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

function el(nom, attrs = {}, parent) {
  const e = document.createElementNS(NS, nom);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (parent) parent.appendChild(e);
  return e;
}

/** Range n objets dans un rectangle : cherche la plus grande taille qui tient. */
function rangerDans(boite, n, { jitter = 0, alea = Math.random } = {}) {
  let m = 12, colonnes = 1;
  for (let essai = 34; essai >= 12; essai -= 2) {
    const pas = essai + 3;
    const c = Math.max(1, Math.floor((boite.w - 8) / pas));
    if (Math.ceil(n / c) * pas <= boite.h - 8) { m = essai; colonnes = c; break; }
    m = 12; colonnes = Math.max(1, Math.floor((boite.w - 8) / 15));
  }
  const pas = m + 3;
  const lignes = Math.ceil(n / colonnes);
  const x0 = boite.x + (boite.w - Math.min(n, colonnes) * pas) / 2 + pas / 2;
  const y0 = boite.y + (boite.h - lignes * pas) / 2 + pas / 2;
  const pos = [];
  for (let i = 0; i < n; i++) {
    pos.push({
      cx: x0 + (i % colonnes) * pas + (jitter ? (alea() - 0.5) * jitter : 0),
      cy: y0 + Math.floor(i / colonnes) * pas + (jitter ? (alea() - 0.5) * jitter : 0),
      rot: jitter ? (alea() - 0.5) * 40 : 0
    });
  }
  return { pos, taille: m };
}

/** Dispose d lots (rectangles) dans la zone haute. */
function disposerLots(d) {
  const colonnes = d <= 2 ? d : d === 3 ? 3 : d === 4 ? 2 : d <= 6 ? 3 : d <= 8 ? 4 : 5;
  const lignes = Math.ceil(d / colonnes), g = 8;
  const w = (LARGEUR - g * (colonnes + 1)) / colonnes, h = (HAUT_LOTS - g * (lignes + 1)) / lignes;
  return Array.from({ length: d }, (_, i) => ({ x: g + (i % colonnes) * (w + g), y: g + Math.floor(i / colonnes) * (h + g), w, h }));
}

export function creerJeu({ total, graine = 5 }) {
  let a = graine >>> 0;
  const alea = () => ((a = (Math.imul(a, 1664525) + 1013904223) >>> 0) / 4294967296);

  const svg = el("svg", { viewBox: `0 0 ${LARGEUR} ${HAUTEUR}`, class: "jeu", role: "group",
    "aria-label": `${total} objets à partager en lots égaux, puis un panier` });
  const couchePanier = el("g", { transform: "translate(180 296) scale(1.4)" }, svg);
  couchePanier.innerHTML = `<ellipse cx="0" cy="0" rx="46" ry="11" fill="#7a4a1f"/>
    <path d="M-44 0 Q-40 38 -24 42 L24 42 Q40 38 44 0Z" fill="#c98a42" stroke="#7a4a1f" stroke-width="2"/>
    <g stroke="#a56b2c" stroke-width="2" fill="none"><path d="M-36 12 H36 M-32 22 H32 M-28 32 H28"/><path d="M-20 4 V40 M-8 4 V42 M8 4 V42 M20 4 V40"/></g>`;
  const coucheLots = el("g", {}, svg);
  const coucheMangues = el("g", {}, svg);
  const rimAvant = el("path", { d: "M-46 0 Q0 22 46 0", transform: "translate(180 296) scale(1.4)", fill: "none", stroke: "#e0b070", "stroke-width": 3 }, svg);
  const compteur = el("text", { x: 318, y: 304, class: "panier-compteur" }, svg);
  compteur.textContent = "";

  const mangues = [];
  for (let i = 0; i < total; i++) {
    const u = el("use", { href: "#mangue", x: 0, y: 0, width: 34, height: 34, class: "m", "data-i": i }, coucheMangues);
    mangues.push(u);
  }

  const etat = { den: null, boites: [], lots: [], choisis: new Set(), pris: false, taille: 34 };
  const jeu = { svg, surChoix: null };

  function placer(u, p, taille) {
    u.style.transform = `translate(${(p.cx - 17).toFixed(1)}px, ${(p.cy - 17).toFixed(1)}px) rotate(${(p.rot || 0).toFixed(1)}deg) scale(${(taille / 34).toFixed(3)})`;
  }

  /** Remet tous les objets en tas. */
  function tas() {
    coucheLots.innerHTML = "";
    etat.den = null; etat.lots = []; etat.choisis = new Set(); etat.pris = false;
    compteur.textContent = "";
    const { pos, taille } = rangerDans({ x: 8, y: 8, w: LARGEUR - 16, h: HAUT_LOTS - 16 }, total, { jitter: 5, alea });
    mangues.forEach((u, i) => { u.classList.remove("pris"); u.style.opacity = 1; placer(u, pos[i], taille); });
    etat.taille = taille;
  }

  /** Regroupe les objets en d lots égaux (total divisible par d). */
  jeu.partager = async function (d) {
    if (total % d !== 0) throw new Error("partage inégal");
    tas();
    await attendre(60);
    etat.den = d;
    const part = total / d;
    etat.boites = disposerLots(d);
    coucheLots.innerHTML = "";
    etat.lots = etat.boites.map((b, i) => {
      const g = el("g", { class: "lot", tabindex: 0, role: "button", "aria-label": `Lot ${i + 1} sur ${d}`, "aria-pressed": "false" }, coucheLots);
      el("rect", { x: b.x, y: b.y, width: b.w, height: b.h, rx: 14 }, g);
      const choisir = () => jeu.basculer(i);
      g.addEventListener("click", choisir);
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choisir(); } });
      return g;
    });
    sfx.pop();
    etat.boites.forEach((b, k) => {
      const { pos, taille } = rangerDans(b, part);
      for (let j = 0; j < part; j++) {
        placer(mangues[k * part + j], pos[j], taille);
      }
      etat.taille = Math.min(etat.taille, taille);
    });
    await attendre(1000);
    return { part };
  };

  jeu.basculer = function (i) {
    if (etat.pris || etat.den == null) return;
    const lot = etat.lots[i];
    if (etat.choisis.has(i)) { etat.choisis.delete(i); lot.classList.remove("choisi"); lot.setAttribute("aria-pressed", "false"); }
    else { etat.choisis.add(i); lot.classList.add("choisi"); lot.setAttribute("aria-pressed", "true"); sfx.pop(); }
    const part = total / etat.den;
    mangues.forEach((u, k) => u.classList.toggle("pris", etat.choisis.has(Math.floor(k / part))));
    if (jeu.surChoix) jeu.surChoix(etat.choisis.size);
  };

  jeu.nombreChoisi = () => etat.choisis.size;
  jeu.lotsChoisis = () => [...etat.choisis].sort((x, y) => x - y);
  jeu.partageActuel = () => etat.den;

  /** Les lots choisis partent dans le panier ; le compteur monte à chaque objet. */
  jeu.prendre = async function () {
    if (etat.pris) return 0;
    etat.pris = true;
    const part = total / etat.den;
    const indices = [];
    mangues.forEach((u, k) => { if (etat.choisis.has(Math.floor(k / part))) indices.push(k); });
    const colonnes = 7, pas = 17;
    indices.forEach((k, n) => {
      const p = { cx: 180 - ((Math.min(indices.length, colonnes) - 1) * pas) / 2 + (n % colonnes) * pas, cy: 286 - Math.floor(n / colonnes) * 14, rot: 0 };
      setTimeout(() => { placer(mangues[k], p, 20); sfx.pop(); compteur.textContent = String(n + 1); }, n * 70);
    });
    await attendre(indices.length * 70 + 900);
    sfx.etoile();
    return indices.length;
  };

  /** Démonstration complète pour l'aide de niveau 5 : partager, puis prendre. */
  jeu.demonstration = async function (d, n) {
    await jeu.partager(d);
    for (let i = 0; i < n; i++) { jeu.basculer(i); await attendre(650); }
    await attendre(300);
    return jeu.prendre();
  };

  jeu.remettreEnTas = tas;
  tas();
  return jeu;
}
