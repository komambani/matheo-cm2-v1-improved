// Briques d'interface partagées par tous les écrans et tous les modules de défi.
import { matheo, mamie, anita, kola, maitreLeo, nuageParesse, ciel } from "./art.js";
import { sfx, basculerSon, sonActif } from "./sfx.js";
import { dire, arreter } from "./voix.js";

/** État partagé : contenu de la notion en cours, jeton d'écran, voix disponibles. */
export const E = { app: document.getElementById("app"), C: null, session: 0, voixOk: false };

// Un seul écouteur pour tous les boutons d'écoute (🔈) : énoncés, questions de clavier, choix.
E.app.addEventListener("click", (e) => { const b = e.target.closest("[data-dire]"); if (b) dire(b.dataset.dire); });

export const ETAPES = ["Mission", "BD", "Vidéo", "Défi", "Quiz", "Boss"];
export const attendre = (ms) => new Promise((r) => setTimeout(r, ms));
export const $ = (s, r = E.app) => r.querySelector(s);

// Échappe le HTML et colle la ponctuation haute à son mot (espace insécable : jamais un « ? » seul sur une ligne).
export const esc = (t) => String(t)
  .replace(/ ([?!:;»])/g, " $1").replace(/« /g, "« ")
  .replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/** Remplace tout l'écran. Renvoie un jeton : si E.session change, l'écran a été quitté. */
export function monter(html, graine = 7) {
  E.session++;
  arreter();
  E.app.innerHTML = ciel(graine) + `<main class="ecran">${html}</main>`;
  const b = $("#btn-son");
  if (b) b.addEventListener("click", () => { const v = basculerSon(); b.textContent = v ? "🔊" : "🔇"; b.setAttribute("aria-label", v ? "Couper le son" : "Remettre le son"); });
  return E.session;
}
export const vivant = (jeton) => jeton === E.session;

/** Énoncé avec un bouton d'écoute (si les voix existent) : aide les enfants qui lisent difficilement. */
export function enonce(texte) {
  const brut = String(texte).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  return `<div class="question">${esc(texte)}${E.voixOk ? `<button class="ecouter-q" data-dire="${brut}" aria-label="Écouter la question">🔈</button>` : ""}</div>`;
}

export function barre(titre, etape = -1, extra = "") {
  const pts = ETAPES.map((_, i) => `<b class="${i < etape ? "fait" : i === etape ? "actuel" : ""}"></b>`).join("");
  return `<div class="barre"><span class="titre">${esc(titre)}</span><div class="points" aria-label="Étape ${etape + 1} sur ${ETAPES.length}">${pts}</div>${extra}
    <button class="rond" id="btn-son" aria-label="${sonActif() ? "Couper le son" : "Remettre le son"}">${sonActif() ? "🔊" : "🔇"}</button></div>`;
}

/** Buste d'un personnage (visage et épaules) pour la bulle de dialogue. */
const buste = (svg) => svg.replace(/viewBox="[^"]*"/, 'viewBox="10 12 80 80"');

export function avatarDe(qui, humeur) {
  if (qui === "Mathéo") return matheo({ humeur, classe: "flotte" });
  if (qui === "Mamie Sègla") return buste(mamie());
  if (qui === "Anita") return buste(anita());
  if (qui === "Kola") return buste(kola());
  if (qui === "Maître Léo") return buste(maitreLeo());
  if (qui === "Nuage-Paresse") return nuageParesse({ humeur: humeur === "joie" ? "fond" : "endormi" });
  return `<svg viewBox="0 0 60 60" aria-hidden="true"><use href="#etoile" x="6" y="6" width="48" height="48" color="#ffe066"/></svg>`;
}

export function bulle({ qui, texte, type = "", humeur = "content" }) {
  const ecouter = E.voixOk ? `<button class="ecouter" aria-label="Écouter">🔈</button>` : "";
  return `<div class="parle"><div class="avatar">${avatarDe(qui, humeur)}</div>
    <div class="bulle ${type}" role="status"><span class="qui">${esc(qui)}</span>${esc(texte)}${ecouter}</div></div>`;
}

/** Affiche du HTML dans une zone et dit le texte à voix haute (si la voix existe). */
export function dans(zone, html, texteVoix) {
  zone.innerHTML = html;
  const b = zone.querySelector(".ecouter");
  if (texteVoix) {
    if (b) b.addEventListener("click", () => dire(texteVoix));
    dire(texteVoix);
  }
}

export function gerbe(n = 26) {
  const g = document.createElement("div");
  g.className = "gerbe";
  g.style.top = "40%";
  let h = "";
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, d = 80 + Math.random() * 190;
    h += `<i style="left:${50 + (Math.random() - 0.5) * 30}%;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 60}px;--r:${(Math.random() - 0.5) * 540}deg;animation-delay:${Math.random() * 0.25}s;color:${["#ffd166", "#6fe3d8", "#fff", "#ff9fc0"][i % 4]}"><svg viewBox="-10 -10 20 20" width="14" height="14"><use href="#etoile" x="-10" y="-10" width="20" height="20" color="currentColor"/></svg></i>`;
  }
  g.innerHTML = h;
  E.app.appendChild(g);
  setTimeout(() => g.remove(), 2200);
}

/** Clavier numérique : renvoie une promesse avec le nombre validé. */
export function clavier(zone, invite) {
  return new Promise((resolve) => {
    let valeur = "";
    zone.innerHTML = `${enonce(invite)}<div class="affichage" id="aff" aria-live="polite">&nbsp;</div>
      <div class="clavier">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button data-n="${n}">${n}</button>`).join("")}
      <button data-act="eff" aria-label="Effacer">⌫</button><button data-n="0">0</button><button class="ok" data-act="ok" aria-label="Valider">✓</button></div>`;
    const aff = $("#aff", zone);
    const maj = () => { aff.innerHTML = valeur === "" ? "&nbsp;" : esc(valeur); };
    zone.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
      sfx.pop();
      if (b.dataset.n !== undefined && valeur.length < 3) { valeur += b.dataset.n; maj(); }
      else if (b.dataset.act === "eff") { valeur = valeur.slice(0, -1); maj(); }
      else if (b.dataset.act === "ok" && valeur !== "") resolve(parseInt(valeur, 10));
    }));
  });
}

/** Préfixe de sauvegarde de la notion en cours : « n22 », « n17 »… */
export const cle = (chemin) => `${E.C.id.toLowerCase()}.${chemin}`;
