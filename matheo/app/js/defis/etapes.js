// Moteur d'étapes : un défi est une suite d'étapes décrites en données. Types :
//  nombre      : l'enfant tape un nombre (clavier).
//  choix       : l'enfant choisit une réponse (texte ou schéma).
//  selection   : l'enfant touche les phrases utiles d'un énoncé.
//  construire  : l'enfant partage une barre ou un disque en parts égales, puis colorie des parts.
//  fraction    : l'enfant écrit une fraction (haut puis bas).
// Chaque erreur déclenche un message de Mathéo construit sur une erreur type (E1 à E10) du scénario.
import { sfx } from "../sfx.js";
import { creerAlea, melanger } from "../generators/fractions.js";
import { barreSVG, disqueSVG, visuelSVG } from "../visuels.js";
import { E, $, attendre, clavier, esc, enonce, monter, barre, bulle, dans, gerbe, vivant } from "../ui.js";
import { incrementer } from "../store.js";
import { developper } from "./pose.js";

const NS = "http://www.w3.org/2000/svg";
const zoneGrille = () => { const z = document.createElement("div"); z.style.display = "grid"; z.style.gap = "10px"; return z; };

/** Affiche une consigne (et la dit). */
const consigne = (ctx, texte) => { if (texte) ctx.dire_("Mathéo", texte, "", "content"); };

function montrerVisuel(ctx, v, options = {}) {
  ctx.zoneJeu.innerHTML = v ? `<div class="schema">${visuelSVG(v, { largeur: options.largeur || 300, hauteur: options.hauteur || 110 })}</div>` : "";
}

/* ---------- étape : nombre ---------- */
async function etapeNombre(ctx, s) {
  montrerVisuel(ctx, s.visuel);
  consigne(ctx, s.intro);
  const z = zoneGrille(); ctx.actions.innerHTML = ""; ctx.actions.appendChild(z);
  for (;;) {
    const v = await clavier(z, s.question);
    if (!ctx.vivant()) return false;
    if (v === s.reponse) return true;
    const c = (s.erreurs || []).find((e) => e.reponses.includes(v));
    ctx.erreur(c ? c.type : null, "Mathéo", c ? c.texte : s.retour_defaut || ctx.C.correction_inconnue.texte);
  }
}

/* ---------- étape : choix ---------- */
async function etapeChoix(ctx, s) {
  montrerVisuel(ctx, s.visuel);
  consigne(ctx, s.intro);
  const alea = creerAlea(31 + (s.question || "").length * 7 + (Date.now() % 97));
  const opts = s.melanger === false ? s.options : melanger(alea, s.options);
  ctx.actions.innerHTML = `${enonce(s.question)}<div class="choix ${opts.some((o) => o.visuel) ? "visuels" : ""}">${opts.map((o, k) =>
    `<button data-k="${k}"${o.visuel ? ` aria-label="${esc(o.visuel.alt || "schéma")}"` : ""}>${o.visuel ? visuelSVG(o.visuel, { largeur: 150, hauteur: 70 }) : ""}${o.t ? `<span>${esc(o.t)}</span>` : ""}</button>`).join("")}</div>`;
  return new Promise((resolve) => {
    ctx.actions.querySelectorAll(".choix button").forEach((b) => b.addEventListener("click", () => {
      if (!ctx.vivant()) return;
      const o = opts[parseInt(b.dataset.k, 10)];
      if (o.ok) { b.classList.add("juste"); sfx.bravo(); setTimeout(() => resolve(true), 650); }
      else { b.classList.add("faux"); b.style.pointerEvents = "none"; ctx.erreur(o.e || null, "Mathéo", o.retour || s.retour_defaut || ctx.C.correction_inconnue.texte); }
    }));
  });
}

/* ---------- étape : sélection d'informations ---------- */
async function etapeSelection(ctx, s) {
  ctx.zoneJeu.innerHTML = "";
  consigne(ctx, s.intro);
  ctx.actions.innerHTML = `${enonce(s.question)}<div class="phrases">${s.items.map((t, k) => `<button class="phrase" data-k="${k}">${esc(t)}</button>`).join("")}</div>
    <button class="btn principal large" id="valider-sel" disabled>Valider mes choix</button>`;
  const choisies = new Set();
  const bt = $("#valider-sel", ctx.actions);
  ctx.actions.querySelectorAll(".phrase").forEach((b) => b.addEventListener("click", () => {
    const k = parseInt(b.dataset.k, 10);
    if (choisies.has(k)) { choisies.delete(k); b.classList.remove("pris"); } else { choisies.add(k); b.classList.add("pris"); sfx.pop(); }
    bt.disabled = choisies.size === 0;
  }));
  return new Promise((resolve) => {
    bt.addEventListener("click", () => {
      if (!ctx.vivant()) return;
      const utiles = new Set(s.utiles);
      const manque = [...utiles].filter((k) => !choisies.has(k));
      const trop = [...choisies].filter((k) => !utiles.has(k));
      if (!manque.length && !trop.length) { sfx.bravo(); resolve(true); return; }
      const retour = trop.length ? (s.retour_trop || "Bip ! Une de ces informations ne sert pas. Relis la question.") : (s.retour_manque || "Bip ! Il manque une information utile. Relis la question.");
      ctx.erreur(trop.length ? "E1" : "E5", "Mathéo", retour);
    });
  });
}

/* ---------- étape : fraction (haut puis bas) ---------- */
async function etapeFraction(ctx, s) {
  montrerVisuel(ctx, s.visuel);
  consigne(ctx, s.intro);
  const z = zoneGrille(); ctx.actions.innerHTML = ""; ctx.actions.appendChild(z);
  for (;;) {
    const haut = await clavier(z, s.question_haut || "Combien de parts sont prises ? (le nombre du haut)");
    if (!ctx.vivant()) return false;
    if (haut === s.num) break;
    ctx.erreur(haut === s.den ? "E2" : "E1", "Mathéo", haut === s.den ? (s.retour_inverse || "Bip ! Ce nombre dit en combien de parts on partage : c'est le nombre du bas. Ici, on cherche le nombre du haut : les parts prises.") : (s.retour_haut || "Bip ! Compte les parts coloriées. C'est le nombre du haut."));
  }
  for (;;) {
    const bas = await clavier(z, s.question_bas || "En combien de parts égales le tout est-il partagé ? (le nombre du bas)");
    if (!ctx.vivant()) return false;
    if (bas === s.den) return true;
    ctx.erreur(bas === s.num ? "E2" : "E1", "Mathéo", bas === s.num ? (s.retour_inverse_bas || "Bip ! Ce nombre dit combien de parts on prend : c'est le nombre du haut. Le nombre du bas dit en combien de parts égales on partage.") : (s.retour_bas || "Bip ! Compte toutes les parts du tout, coloriées ou non. C'est le nombre du bas."));
  }
}

/* ---------- étape : construire une barre ou un disque ---------- */
async function etapeConstruire(ctx, s) {
  const forme = s.forme || "barre";
  consigne(ctx, s.intro);
  const choisies = new Set();
  let den = 1;
  const dessiner = (nbParts, colo = true) => {
    const ids = true, ch = [...choisies];
    const corps = forme === "disque"
      ? disqueSVG({ cx: 180, cy: 92, r: 76, den: nbParts, choisies: ch, ids })
      : barreSVG({ x: 20, y: 44, w: 320, h: 64, den: nbParts, choisies: ch, ids });
    ctx.zoneJeu.innerHTML = `<svg viewBox="0 0 360 ${forme === "disque" ? 184 : 150}" class="jeu jeu-fraction" role="group" aria-label="${forme === "disque" ? "Un disque" : "Une barre"} partagé${nbParts > 1 ? ` en ${nbParts} parts` : ""}">${corps}</svg>`;
  };
  dessiner(1);

  // 1) partager en parts égales
  ctx.actions.innerHTML = `${enonce(s.question_partage || "En combien de parts égales faut-il partager ?")}<div class="choix">${s.options_den.map((n) => `<button data-n="${n}">Partager en ${n} parts égales</button>`).join("")}</div>`;
  await new Promise((resolve) => {
    ctx.actions.querySelectorAll(".choix button").forEach((b) => b.addEventListener("click", () => {
      if (!ctx.vivant()) return;
      const n = parseInt(b.dataset.n, 10);
      dessiner(n); sfx.pop();
      if (n === s.den) { den = n; resolve(); return; }
      b.classList.add("faux"); b.style.pointerEvents = "none";
      ctx.erreur(n === s.num ? "E2" : "E1", "Mathéo", n === s.num ? (s.retour_partage_haut || "Bip ! Tu as partagé avec le nombre du haut. Le nombre du bas dit en combien de parts égales partager.") : (s.retour_partage || "Bip ! Regarde le nombre du bas de la fraction. Il dit en combien de parts égales partager."));
    }));
  });
  if (!ctx.vivant()) return false;
  dessiner(den);

  // 2) colorier des parts
  consigne(ctx, s.question_colorier || "Maintenant, touche les parts à colorier.");
  ctx.actions.innerHTML = `<p class="centre discret" id="cpt">Parts coloriées : 0</p><button class="btn principal large" id="valider-col" disabled>Valider</button>`;
  const cpt = $("#cpt", ctx.actions), bt = $("#valider-col", ctx.actions);
  const parts = () => ctx.zoneJeu.querySelectorAll(".part");
  parts().forEach((p) => {
    p.style.cursor = "pointer";
    p.addEventListener("click", () => {
      const k = parseInt(p.dataset.part, 10);
      if (choisies.has(k)) choisies.delete(k); else { choisies.add(k); sfx.pop(); }
      p.setAttribute("fill", choisies.has(k) ? "#ffd166" : "rgba(255,255,255,.14)");
      cpt.textContent = `Parts coloriées : ${choisies.size}`; bt.disabled = choisies.size === 0;
    });
  });
  await new Promise((resolve) => bt.addEventListener("click", () => {
    if (!ctx.vivant()) return;
    if (choisies.size === s.num) { sfx.bravo(); resolve(); return; }
    ctx.erreur(choisies.size === s.den ? "E1" : "E5", "Mathéo", choisies.size > s.num ? (s.retour_trop || "Bip ! Tu as colorié trop de parts. Regarde le nombre du haut : il dit combien de parts on prend.") : (s.retour_peu || "Bip ! Il n'y a pas assez de parts coloriées. Regarde le nombre du haut : il dit combien de parts on prend."));
  }));
  if (!ctx.vivant()) return false;
  bt.disabled = true;
  parts().forEach((p) => (p.style.pointerEvents = "none"));
  if (s.voix_fin) ctx.dire_("Mathéo", s.voix_fin, "bravo", "joie");
  await attendre(s.voix_fin ? 2600 : 700); // le temps d'entendre le message avant la consigne suivante
  return true;
}

/* ---------- étape : subdiviser (fractions équivalentes) ---------- */
// On part d'une barre ou d'un disque ; l'enfant coupe chaque part en k parts : la quantité coloriée ne change pas.
async function etapeSubdiviser(ctx, s) {
  const forme = s.forme || "barre";
  const dessiner = (den, num) => {
    const corps = forme === "disque"
      ? disqueSVG({ cx: 180, cy: 92, r: 76, den, num })
      : barreSVG({ x: 20, y: 44, w: 320, h: 64, den, num });
    ctx.zoneJeu.innerHTML = `<svg viewBox="0 0 360 ${forme === "disque" ? 184 : 150}" class="jeu jeu-fraction" role="img" aria-label="${forme === "disque" ? "Un disque" : "Une barre"} partagé${den > 1 ? ` en ${den} parts` : ""}, ${num} part${num > 1 ? "s" : ""} coloriée${num > 1 ? "s" : ""}">${corps}</svg>`;
  };
  dessiner(s.den, s.num);
  consigne(ctx, s.intro);
  ctx.actions.innerHTML = `${enonce(s.question || "Coupe chaque part en plus de parts égales.")}<div class="choix">${s.options.map((k) => `<button data-k="${k}">Couper chaque part en ${k}</button>`).join("")}</div>`;
  return new Promise((resolve) => {
    ctx.actions.querySelectorAll(".choix button").forEach((b) => b.addEventListener("click", () => {
      if (!ctx.vivant()) return;
      const k = parseInt(b.dataset.k, 10);
      dessiner(s.den * k, s.num * k); sfx.pop();
      if (k === s.facteur) { sfx.bravo(); if (s.voix_fin) ctx.dire_("Mathéo", s.voix_fin, "bravo", "joie"); setTimeout(() => resolve(true), s.voix_fin ? 2600 : 900); return; }
      b.classList.add("faux"); b.style.pointerEvents = "none";
      ctx.erreur("E1", "Mathéo", (s.retours && s.retours[k]) || s.retour_defaut || "Bip ! Ce n'est pas le partage demandé. Réessaie !");
    }));
  });
}

const TYPES = { nombre: etapeNombre, choix: etapeChoix, selection: etapeSelection, fraction: etapeFraction, construire: etapeConstruire, subdiviser: etapeSubdiviser };

/** Exécute les étapes l'une après l'autre. Renvoie true quand tout est réussi. */
export async function executerEtapes(ctx, etapes) {
  // Les opérations posées (pose, division) sont développées en suites de micro-étapes « nombre ».
  const toutes = etapes.flatMap(developper);
  for (const [i, s] of toutes.entries()) {
    const f = TYPES[s.type];
    if (!f) throw new Error(`étape inconnue : ${s.type}`);
    if (s.enonce) ctx.zoneJeuTitre && (ctx.zoneJeuTitre.innerHTML = enonce(s.enonce));
    const ok = await f(ctx, s);
    if (!ok && !ctx.vivant()) return false;
    if (!ctx.vivant()) return false;
    if (ctx.apresEtape) ctx.apresEtape(i + 1, toutes.length); // la scène 3D (si présente) avance avec l'enfant
  }
  return true;
}

/** Défi de la notion : toutes les étapes, puis la réussite. */
export function defi(ctx) {
  const { d } = ctx;
  (async () => {
    const ok = await executerEtapes(ctx, d.etapes);
    if (ok && ctx.vivant()) ctx.succes();
  })();
}

/** Micro-parcours de remédiation : mêmes étapes, plus guidées et sur d'autres nombres. */
export function remediation(i, { suivant }) {
  const C = E.C;
  const parcours = C.remediation;
  const r = parcours[i];
  const jeton = monter(`
    ${barre(`Je m'entraîne · ${i + 1}/${parcours.length}`, 1)}
    ${enonce(r.enonce)}
    <div id="zone-jeu"></div><div id="parole"></div><div id="actions" class="actions"></div>`, 9 + i);
  const parole = $("#parole");
  const ctx = {
    C, zoneJeu: $("#zone-jeu"), actions: $("#actions"), parole,
    vivant: () => vivant(jeton),
    dire_: (qui, texte, type = "", humeur = "content") => dans(parole, bulle({ qui, texte, type, humeur }), texte),
    erreur: (code, qui, texte, humeur = "pense") => { if (code) incrementer(`${C.id.toLowerCase()}.erreurs.${code}`); sfx.oups(); dans(parole, bulle({ qui, texte, type: "erreur", humeur }), texte); }
  };
  (async () => {
    const ok = await executerEtapes(ctx, r.etapes);
    if (!ok || !ctx.vivant()) return;
    gerbe(14); sfx.bravo();
    ctx.dire_("Mathéo", r.fin || "Bip bip ! Bien joué !", "bravo", "joie");
    ctx.actions.innerHTML = `<button class="btn principal large" id="suite">${i < parcours.length - 1 ? "Suite" : "Continuer"}</button>`;
    $("#suite").addEventListener("click", () => (i < parcours.length - 1 ? remediation(i + 1, { suivant }) : suivant()));
  })();
}
