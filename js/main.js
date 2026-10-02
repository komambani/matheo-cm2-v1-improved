// Mathéo – point d'entrée : charge les contenus, affiche la carte des aventures, lance une notion ou un élément transversal.
import { DEFS, matheo } from "./art.js";
import { sfx, sonActif } from "./sfx.js";
import { voixDisponible } from "./voix.js";
import { lire } from "./store.js";
import { E, $, esc, monter } from "./ui.js";
import { jouer, ecrans } from "./notion.js";
import * as extras from "./extras.js";

document.body.insertAdjacentHTML("afterbegin", DEFS);

let index = null;
const cache = {};
const DOMAINES = ["Calcul", "Fractions", "Résolution de problèmes"];

async function charger(id) {
  if (cache[id]) return cache[id];
  const n = index.notions.find((x) => x.id === id);
  cache[id] = await fetch(`content/${n.fichier}`).then((r) => r.json());
  return cache[id];
}
const chargerExtra = (fichier) => (cache[fichier] ||= fetch(`content/${fichier}`).then((r) => r.json()));

async function lancer(id) {
  sfx.bip();
  jouer(await charger(id), carte);
}

/** Carte des aventures : domaines, notions, puis les rubriques transversales. */
function carte() {
  const conseille = lire("positionnement.notion", null);
  const ep0 = lire("episode0.fait", false);
  // Chemin d'étoiles : les notions sont des étoiles reliées par une piste qui serpente ; la prochaine à jouer pulse.
  const suivante = (conseille && !lire(`${conseille.toLowerCase()}.fini`, false) ? conseille : null) || (index.notions.find((n) => !lire(`${n.id.toLowerCase()}.fini`, false)) || {}).id;
  let rang = 0;
  const groupes = DOMAINES.map((d) => {
    const liste = index.notions.filter((n) => n.domaine === d);
    if (!liste.length) return "";
    const noeuds = liste.map((n, i) => {
      const cle = n.id.toLowerCase();
      const fini = lire(`${cle}.fini`, false);
      const gauche = rang++ % 2 === 0;
      const lien = `<svg class="piste ${gauche ? "g" : "d"}" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true"><path d="${gauche ? "M27 0 C27 30 73 20 73 50" : "M73 0 C73 30 27 20 27 50"}"/></svg>`;
      return `${i > 0 ? lien : ""}<button class="notion etoile-n ${fini ? "fait" : ""} ${suivante === n.id ? "prochaine" : ""} ${gauche ? "g" : "d"}" data-id="${n.id}">
        <span class="astre" aria-hidden="true">${fini ? "★" : n.id.replace(/^N/, "")}</span>
        <span class="nom">${esc(n.titre)}${conseille === n.id && !fini ? ` <em class="conseil">conseillé</em>` : ""}</span>
        <span class="etat">${fini ? `${"⭐".repeat(lire(`${cle}.etoiles`, 0))}` : suivante === n.id ? "À toi de jouer !" : ""}</span></button>`;
    }).join("");
    return `<h3 class="domaine">${esc(d)}</h3><div class="chemin">${noeuds}</div>`;
  }).join("");  const gagnes = index.notions.filter((n) => lire(`${n.id.toLowerCase()}.fragment`, false)).length;
  const finaleOk = lire("finale4.fini", false);
  const fractionsFaites = ["N17", "N18", "N19", "N20", "N21", "N22", "N23"].every((id) => lire(`${id.toLowerCase()}.fragment`, false));
  monter(`
    <div class="barre"><span class="titre"></span><button class="rond" id="btn-son" aria-label="Son">${sonActif() ? "🔊" : "🔇"}</button></div>
    <div class="accueil ecran" style="padding:0;animation:none">
      <div class="grand">${matheo({ humeur: "joie", classe: "flotte" })}</div>
      <h1>Mathéo</h1>
      <p class="sous">Aide Mathéo à rallumer les douze étoiles du ciel.</p>
      <p><span class="pastille">${gagnes} étoile${gagnes > 1 ? "s" : ""} allumée${gagnes > 1 ? "s" : ""} sur ${index.notions.length}</span></p>
      <div class="cartes depart" role="list">
        <button class="notion ${ep0 ? "fait" : "debut"}" data-extra="ep0"><span class="code">0</span><span class="nom">Épisode 0 : l'arrivée de Mathéo${ep0 ? "" : ` <em class="conseil">commence ici</em>`}</span><span class="etat">${ep0 ? "✓" : "À jouer"}</span></button>
        <button class="notion ${lire("positionnement.fait", false) ? "fait" : ""}" data-extra="pos"><span class="code">?</span><span class="nom">Test de positionnement</span><span class="etat">${lire("positionnement.fait", false) ? "✓" : "15 questions"}</span></button>
      </div>
      ${groupes}
      <div class="cartes" role="list">
        <h3 class="domaine">Pour s'entraîner</h3>
        <button class="notion ${finaleOk ? "fait" : ""}" data-extra="finale"><span class="code">★</span><span class="nom">Finale des Fractions${fractionsFaites || finaleOk ? "" : " (verrouillée)"}</span><span class="etat">${finaleOk ? "✓" : fractionsFaites ? "Prête" : "🔒"}</span></button>
        <button class="notion" data-extra="rev"><span class="code">↻</span><span class="nom">Révision</span><span class="etat">${lire("revision.seances", 0)} séance${lire("revision.seances", 0) > 1 ? "s" : ""}</span></button>
        <button class="notion" data-extra="cep"><span class="code">CEP</span><span class="nom">Prépare le CEP : sujet blanc</span><span class="etat">${lire("cep1.score", null) === null ? "À faire" : `${lire("cep1.score", 0)}/${lire("cep1.total", 10)}`}</span></button>
        <button class="notion" data-extra="ver"><span class="code">✓</span><span class="nom">Vérifie ma réponse</span><span class="etat">Tuteur</span></button>
      </div>
      <button class="lien" data-extra="adulte">Espace adulte</button>
    </div>`, 11);
  document.querySelectorAll(".notion[data-id]").forEach((b) => b.addEventListener("click", () => lancer(b.dataset.id)));
  document.querySelectorAll("[data-extra]").forEach((b) => b.addEventListener("click", async () => {
    sfx.bip();
    const k = b.dataset.extra;
    if (k === "ep0") return extras.episode0({ C: await chargerExtra("episode0.json"), retour: carte });
    if (k === "pos") return extras.positionnement({ P: await chargerExtra("positionnement.json"), retour: carte, lancer });
    if (k === "rev") return extras.revision({ index, charger, retour: carte });
    if (k === "cep") return extras.cep({ S: await chargerExtra("cep_blanc1.json"), retour: carte });
    if (k === "finale") return extras.finale({ F: await chargerExtra("finale_fractions.json"), retour: carte });
    if (k === "ver") return extras.verifier({ retour: carte });
    if (k === "adulte") return extras.adulte({ index, retour: carte });
  }));
}

async function demarrer() {
  index = await fetch("content/index.json").then((r) => r.json());
  E.voixOk = await voixDisponible();
  carte();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => { /* hors ligne non disponible dans ce contexte */ });
  }
}
const pret = demarrer();

// Accès de test (non utilisé par l'enfant) : window.__matheo.aller("boss", "N22")
window.__matheo = {
  async aller(nom, id = "N22") {
    await pret;
    if (nom === "accueil" || nom === "carte") return carte();
    E.C = await charger(id);
    return ecrans[nom]();
  },
  carte, charger: (id) => charger(id), extras, chargerExtra, lancer, get index() { return index; }
};
