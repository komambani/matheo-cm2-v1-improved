// Parcours générique d'une notion : mission → BD → vidéo → défi → quiz → boss → fin → fiche.
// L'histoire et la vidéo viennent AVANT les questions : un test avec de vrais enfants a montré qu'ils abandonnaient pendant le défi, sans jamais voir la BD ni la vidéo.
// Tout vient du contenu (content/<notion>.json) ; le type de défi choisit le module (lots, étapes…).
import { fragmentBoussole, nuageParesse } from "./art.js";
import { sfx } from "./sfx.js";
import { dire, lire as lireVoix } from "./voix.js";
import { creerVideo } from "./video.js";
import { creerLeconN22 } from "./lecon-n22.js";
import { rendreScene } from "./scenes.js";
import { visuelSVG } from "./visuels.js";
import { creerAlea, melanger, messageErreur } from "./generators/fractions.js";
import { lire, ecrire, incrementer } from "./store.js";
import { E, $, esc, monter, vivant, barre, enonce, bulle, dans, gerbe, cle } from "./ui.js";
import * as lots from "./defis/lots.js";
import * as etapes from "./defis/etapes.js";
import * as etapes3d from "./defis/etapes3d.js";

const MODULES = { lots, etapes, etapes3d };
let retourCarte = () => {};

/** Lance une notion depuis la carte. `retour` ramène à la carte. */
export function jouer(C, retour) {
  E.C = C;
  retourCarte = retour || (() => {});
  ecranMission(0);
}

const C_ = () => E.C;

/* ---------- mission ---------- */

function ecranMission(i) {
  const C = C_();
  const m = C.mission[i];
  const jeton = monter(`
    ${barre("Mission", 0)}
    ${rendreScene(C.mission_scene || { special: "marche" }, { aria: `Illustration : ${C.titre}` })}
    <div id="parole"></div>
    <div class="actions"><button class="btn principal large" id="suite">${i < C.mission.length - 1 ? "Suite" : "Découvrir l'histoire"}</button></div>`, 3);
  dans($("#parole"), bulle({ qui: m.qui, texte: m.texte, humeur: m.humeur || "content" }), m.texte);
  if (m.qui === "Mathéo") sfx.bip();
  $("#suite").addEventListener("click", () => {
    if (!vivant(jeton)) return;
    if (i < C.mission.length - 1) ecranMission(i + 1);
    // Refonte V1 améliorée : pour N22 uniquement, la leçon vidéo premium
    // (voix ElevenLabs réelle) vient tout de suite après l'immersion,
    // avant la BD — nouvel ordre pédagogique demandé (leçon avant exercices).
    // Les 11 autres notions gardent le parcours original intact (BD → vidéo → défi).
    else if (C.id === "N22") ecranLecon();
    else ecranBD(0);
  });
}

/* ---------- leçon vidéo premium (N22 uniquement) et mini-vérification ---------- */

function ecranLecon() {
  const C = C_();
  const jeton = monter(`
    ${barre("Leçon de Mathéo", 1)}
    <div id="lecteur-lecon"></div>
    <div class="actions"><button class="btn principal large" id="suite" disabled>Continuer</button></div>`, 62);
  const bSuite = $("#suite");
  const l = creerLeconN22($("#lecteur-lecon"), {
    surFin: () => { if (vivant(jeton)) { bSuite.disabled = false; bSuite.textContent = "J'ai compris !"; gerbe(10); sfx.bravo(); } },
    surPasser: () => { if (vivant(jeton)) ecranMiniVerif(); }
  });
  bSuite.addEventListener("click", () => { l.detruire(); ecranMiniVerif(); });
}

/** Mini-vérification immédiate après la leçon : pas un gros quiz, une seule
 * question de compréhension (conforme étape 3 du prompt maître V2).
 * Corrigé (phase Gold Standard) : une mauvaise réponse ne montre plus
 * "Continuer" directement — elle propose un nouvel essai, comme le Défi
 * guidé et le Quiz, pour rester cohérent avec §12 du prompt maître. */
function ecranMiniVerif() {
  const C = C_();
  const jeton = monter(`
    ${barre("Vérification rapide", 2)}
    ${enonce("Pour prendre 3/4 de 24, que fait-on EN PREMIER ?")}
    <div class="choix" id="choix-mv">
      <button data-ok="1">Partager 24 en 4 parts égales</button>
      <button data-ok="0">Multiplier 24 par 3</button>
      <button data-ok="0">Diviser 24 par 3</button>
    </div>
    <div id="parole-mv"></div>
    <div class="actions" id="actions-mv"></div>`, 63);
  const parole = $("#parole-mv");
  let essais = 0;
  function brancher() {
    $("#choix-mv").querySelectorAll("button").forEach((b) => {
      b.classList.remove("juste", "faux"); b.style.pointerEvents = "";
      b.addEventListener("click", () => {
        if (!vivant(jeton)) return;
        const ok = b.dataset.ok === "1";
        $("#choix-mv").querySelectorAll("button").forEach((x) => (x.style.pointerEvents = "none"));
        if (ok) {
          b.classList.add("juste"); sfx.bravo(); gerbe(8);
          dans(parole, bulle({ qui: "Mathéo", texte: "Bip bip ! Exactement : le bas de la fraction dit combien de parts faire.", humeur: "joie" }), "");
          $("#actions-mv").innerHTML = `<button class="btn principal large" id="suite-mv">Continuer l'aventure</button>`;
          $("#suite-mv").addEventListener("click", () => ecranBD(0));
        } else {
          essais++;
          b.classList.add("faux"); sfx.oups();
          // Après un 2e échec, on change de représentation (§12) : on montre
          // directement les 24 mangues partagées au lieu de redire la même phrase.
          const texte = essais >= 2
            ? "Bip ! Regarde : 24 mangues, 4 lots égaux de 6. On prend 3 lots, donc 3 × 6."
            : "Bip ! Pas tout à fait : on partage d'abord avec le nombre du bas (le dénominateur).";
          dans(parole, bulle({ qui: "Mathéo", texte, humeur: "pense" }), "");
          $("#actions-mv").innerHTML = `<button class="btn large" id="reessai-mv">Nouvel essai</button>`;
          $("#reessai-mv").addEventListener("click", () => { parole.innerHTML = ""; brancher(); });
        }
      }, { once: true });
    });
  }
  brancher();
}

/* ---------- défi ---------- */

function ecranDefi() {
  const C = C_(), d = C.defi, mod = MODULES[d.type || "lots"];
  const jeton = monter(`
    ${barre("Défi guidé", 3, `<button class="rond" id="aide" aria-label="Demander un indice">💡</button>`)}
    ${enonce(d.enonce)}
    <div id="zone-jeu"></div>
    <div id="parole"></div>
    <div id="actions" class="actions ${d.type === "etapes" || d.type === "etapes3d" ? "libre" : ""}"></div>`, 5);
  const parole = $("#parole"), actions = $("#actions");
  let niveauAide = 0, erreurs = 0;
  const occupe = { v: false };

  const ctx = {
    C, d, zoneJeu: $("#zone-jeu"), parole, actions, occupe,
    vivant: () => vivant(jeton),
    dire_: (qui, texte, type = "", humeur = "content") => dans(parole, bulle({ qui, texte, type, humeur }), texte),
    lancerRemediation: () => mod.remediation(0, { suivant: () => ecranQuiz(0, 0) }),
    surAide5: null,
    erreur(code, qui, texte, humeur = "pense") {
      erreurs++;
      if (code) incrementer(cle(`erreurs.${code}`));
      sfx.oups();
      ctx.dire_(qui, texte, "erreur", humeur);
      if (erreurs % 2 === 0 && niveauAide < C.aide.length) {
        setTimeout(() => { if (vivant(jeton)) $("#aide").animate([{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }], { duration: 700, iterations: 3 }); }, 500);
      }
    },
    succes() {
      incrementer(cle("defi_ok"));
      gerbe(); sfx.bravo();
      ctx.dire_("Mathéo", d.reussite, "bravo", "joie");
      actions.innerHTML = `<button class="btn principal large" id="suite">Continuer</button>`;
      $("#suite").addEventListener("click", () => ecranQuiz(0, 0));
    }
  };

  $("#aide").addEventListener("click", async () => {
    if (occupe.v || !vivant(jeton)) return;
    incrementer(cle("aides"));
    const a = C.aide[Math.min(niveauAide, C.aide.length - 1)];
    niveauAide = Math.min(niveauAide + 1, C.aide.length);
    sfx.bip();
    ctx.dire_("Mathéo", a.texte, "", "pense");
    if (a.niveau === 5) {
      if (ctx.surAide5) await ctx.surAide5();
      else if (C.remediation) {
        occupe.v = false;
        actions.insertAdjacentHTML("beforeend", `<button class="btn large" id="parcours">Je m'entraîne avec Mathéo</button>`);
        $("#parcours").addEventListener("click", () => ctx.lancerRemediation());
      }
    }
  });

  mod.defi(ctx);
}

/* ---------- vidéo et BD ---------- */

function ecranVideo() {
  const C = C_();
  const jeton = monter(`
    ${barre("Vidéo · " + C.video.titre, 2)}
    <div id="lecteur-video"></div>
    <div class="actions"><button class="btn principal large" id="suite">Relever le défi</button></div>`, 61);
  const v = creerVideo(C, $("#lecteur-video"), { surFin: () => { if (vivant(jeton)) { gerbe(14); sfx.bravo(); } } });
  $("#suite").addEventListener("click", () => { v.detruire(); ecranDefi(); });
  v.demarrer();
}

function ecranBD(i) {
  const C = C_();
  const c = C.bd.cases[i], dernier = i === C.bd.cases.length - 1;
  const scene = c.scene || { special: "n22-bd", n: c.n };
  const jeton = monter(`
    ${barre("BD · " + C.bd.titre, 1)}
    <div class="bd-case">${rendreScene(scene, { aria: `Case ${c.n} de la BD` })}</div>
    <p class="discret centre" style="margin:0">Case ${c.n} / ${C.bd.cases.length}</p>
    ${c.legende ? `<div class="legende">${esc(c.legende)}</div>` : ""}
    <div class="bd-paroles">${c.bulles.map((b) => bulle({ qui: b.qui, texte: b.texte, humeur: b.humeur || "content" })).join("")}</div>
    ${c.encadre ? `<div class="carte"><h2>À retenir</h2><p class="gros">${esc(c.encadre)}</p></div>` : ""}
    <div class="actions"><div class="rangee">
      ${i > 0 ? `<button class="btn" id="prec">Case précédente</button>` : ""}
      <button class="btn principal" id="suite">${dernier ? "Voir la vidéo" : "Case suivante"}</button>
    </div></div>`, 70 + i);
  E.app.querySelectorAll(".bd-paroles .ecouter").forEach((b, k) => b.addEventListener("click", () => dire(c.bulles[k].texte)));
  (async () => {
    for (const b of c.bulles) { if (!vivant(jeton)) return; await lireVoix(b.texte); }
    if (c.legende && vivant(jeton)) await lireVoix(c.legende);
    if (c.encadre && vivant(jeton)) await lireVoix(c.encadre);
  })();
  $("#suite").addEventListener("click", () => {
    if (dernier) {
      // Correction phase Gold Standard : pour N22, l'ancienne "Vidéo défi"
      // (voix Piper) répétait presque mot pour mot la leçon premium déjà vue
      // à l'étape 2 (même exemple des 12 galettes), juste après que la BD
      // elle-même se termine déjà par un récapitulatif encadré ("On partage
      // avec le bas..."). Trois fois la même explication cassait le rythme
      // et mélangeait deux voix différentes pour la même notion (incohérent
      // avec §8-9 du prompt maître). On enchaîne donc directement sur le
      // Défi, qui applique la règle à un cas nouveau (24 mangues, 3/4) —
      // aucune perte pédagogique, uniquement une redite supprimée.
      // Les 11 autres notions gardent ecranVideo() intact.
      if (C.id === "N22") ecranDefi(); else ecranVideo();
    } else ecranBD(i + 1);
  });
  const p = $("#prec"); if (p) p.addEventListener("click", () => ecranBD(i - 1));
}

/* ---------- quiz ---------- */

const libelle = (o) => `${o.visuel ? visuelSVG(o.visuel, { largeur: 150, hauteur: 70 }) : ""}${o.t != null && o.t !== "" ? `<span>${esc(o.t)}</span>` : ""}`;

function ecranQuiz(i, ok1) {
  const C = C_();
  const q = C.quiz[i];
  const alea = creerAlea(1000 + i * 17 + Date.now() % 997);
  const options = melanger(alea, [{ t: q.bonne, visuel: q.bonne_visuel, ok: true }, ...q.mauvaises.map((m) => ({ ...m, ok: false }))]);
  const jeton = monter(`
    ${barre(`Quiz · ${i + 1}/${C.quiz.length}`, 4)}
    <div><span class="niveau">Niveau ${q.niveau}</span></div>
    ${enonce(q.question)}
    ${q.visuel ? `<div class="schema">${visuelSVG(q.visuel, { largeur: 300, hauteur: 110 })}</div>` : ""}
    <div class="choix ${options.some((o) => o.visuel) ? "visuels" : ""}" id="choix">${options.map((o, k) => `<button data-k="${k}"${o.visuel ? ` aria-label="${esc(o.visuel.alt || "schéma")}"` : ""}>${libelle(o)}</button>`).join("")}</div>
    <div id="parole"></div>
    <div class="actions" id="actions"></div>`, 20 + i);
  let premier = true, fini = false;
  const parole = $("#parole");
  $("#choix").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
    if (fini || !vivant(jeton)) return;
    const o = options[parseInt(b.dataset.k, 10)];
    if (o.ok) {
      fini = true; b.classList.add("juste"); sfx.bravo();
      const bravo = C.interface.bien_joue;
      dans(parole, bulle({ qui: "Mathéo", texte: bravo, type: "bravo", humeur: "joie" }), bravo);
      $("#choix").querySelectorAll("button").forEach((x) => (x.style.pointerEvents = "none"));
      $("#actions").innerHTML = `<button class="btn principal large" id="suite">${i < C.quiz.length - 1 ? "Question suivante" : "Passer au boss"}</button>`;
      const gagne = ok1 + (premier ? 1 : 0);
      incrementer(cle(premier ? "quiz.premier_essai" : "quiz.autre"));
      $("#suite").addEventListener("click", () => (i < C.quiz.length - 1 ? ecranQuiz(i + 1, gagne) : (ecrire(cle("quiz.score"), gagne), ecranBoss())));
    } else {
      premier = false; b.classList.add("faux"); b.style.pointerEvents = "none"; sfx.oups(); incrementer(cle(`erreurs.${o.e}`));
      let msg = o.retour || (q.retour && q.retour[o.e]);
      if (!msg && q.total) msg = messageErreur(C.modeles_correction, { ...q, part: q.total / q.den }, { code: o.e, valeur: parseInt(o.t, 10) });
      if (!msg) msg = "Bip ! Montre-moi comment tu as fait.";
      dans(parole, bulle({ qui: "Mathéo", texte: msg, type: "erreur", humeur: "pense" }), msg);
    }
  }));
}

/* ---------- boss ---------- */

function ecranBoss() {
  const C = C_();
  const b = C.boss;
  const alea = creerAlea(7 + Date.now() % 991);
  const options = melanger(alea, [{ t: String(b.reponse), ok: true }, ...b.mauvaises.map((m) => ({ t: String(m.valeur ?? m.t), ok: false, m }))]);
  const jeton = monter(`
    ${barre("Le Nuage-Paresse", 5, `<button class="rond" id="indice" aria-label="Un indice">💡</button>`)}
    <div class="boss-nuage" id="nuage">${nuageParesse({ classe: "flotte" })}</div>
    <div><span class="niveau">Le Nuage-Paresse barre la route de l'étoile</span></div>
    ${enonce(b.question)}
    ${b.visuel ? `<div class="schema">${visuelSVG(b.visuel, { largeur: 300, hauteur: 110 })}</div>` : ""}
    <div class="choix" id="choix">${options.map((o, k) => `<button data-k="${k}">${esc(o.t)}</button>`).join("")}</div>
    <div id="parole"></div><div class="actions" id="actions"></div>`, 33);
  let essais = 0, indiceUtilise = false, fini = false;
  const parole = $("#parole");
  dans(parole, bulle({ qui: "Nuage-Paresse", texte: C.interface.boss_debut, humeur: "pense" }), C.interface.boss_debut);
  $("#indice").addEventListener("click", () => {
    if (indiceUtilise || fini) return;
    indiceUtilise = true; $("#indice").disabled = true; $("#indice").style.opacity = ".35"; incrementer(cle("boss.indice"));
    dans(parole, bulle({ qui: "Mathéo", texte: b.indice, humeur: "pense" }), b.indice);
  });
  $("#choix").querySelectorAll("button").forEach((btn) => btn.addEventListener("click", () => {
    if (fini || !vivant(jeton)) return;
    const o = options[parseInt(btn.dataset.k, 10)];
    essais++;
    if (o.ok) {
      fini = true; btn.classList.add("juste");
      ecrire(cle("boss.essais"), essais);
      gerbe(30); sfx.bravo();
      $("#nuage").innerHTML = nuageParesse({ humeur: "fond" });
      dans(parole, bulle({ qui: "Nuage-Paresse", texte: C.interface.boss_fin, humeur: "joie" }), C.interface.boss_fin);
      setTimeout(() => { if (vivant(jeton)) ecranFin(essais === 1 && !indiceUtilise); }, 1400);
    } else {
      btn.classList.add("faux"); btn.style.pointerEvents = "none"; sfx.oups(); incrementer(cle(`erreurs.${o.m.e}`));
      dans(parole, bulle({ qui: "Mathéo", texte: o.m.retour, type: "erreur", humeur: "pense" }), o.m.retour);
    }
  }));
}

/* ---------- fin et fiche ---------- */

function ecranFin(parfait) {
  const C = C_();
  const quizOk = lire(cle("quiz.score"), 0);
  const etoiles = 1 + (quizOk >= Math.ceil(C.quiz.length * 0.75) ? 1 : 0) + (parfait ? 1 : 0);
  ecrire(cle("fini"), true); ecrire(cle("etoiles"), etoiles); ecrire(cle("fragment"), true);
  const jeton = monter(`
    ${barre("Étoile rallumée !", 5)}
    <div class="centre"><div class="fragment arrive">${fragmentBoussole()}</div></div>
    <div class="etoiles" id="etoiles" aria-label="${etoiles} étoiles sur 3">${[0, 1, 2].map((k) => `<span id="e${k}">⭐</span>`).join("")}</div>
    <div class="carte centre"><h2>Une étoile de plus dans le ciel !</h2><p class="gros">${esc(C.interface.fragment)}</p><p class="discret">Quiz : ${quizOk} / ${C.quiz.length} du premier coup</p></div>
    <div class="carte"><h2>À retenir</h2><p class="gros">${esc(C.essentiel)}</p><p>${esc(C.carte)}</p><p class="discret">${esc(C.pourquoi)}</p></div>
    <div class="actions"><button class="btn principal large" id="fiche">Ma fiche de révision</button><button class="btn large" id="home">Retour à la carte</button></div>`, 44);
  sfx.fragment(); gerbe(34);
  [0, 1, 2].forEach((k) => setTimeout(() => { if (vivant(jeton) && k < etoiles) { $(`#e${k}`).classList.add("on"); sfx.etoile(); } }, 900 + k * 550));
  $("#fiche").addEventListener("click", () => ecranFiche(C));
  $("#home").addEventListener("click", () => retourCarte());
}

export function ecranFiche(C, retour) {
  E.C = C;
  const f = C.fiche || { titre: `${C.id} · ${C.titre}`, piege: "" };
  monter(`
    ${barre("Ma fiche de révision", -1)}
    <div class="carte"><h2>${esc(f.titre)}</h2><p class="gros">${esc(C.essentiel)}</p></div>
    <div class="carte"><h2>Exemple</h2><p class="gros">${esc(C.carte)}</p><p>${esc(C.defi.enonce)}</p></div>
    <div class="carte"><h2>Pourquoi ?</h2><p>${esc(C.pourquoi)}</p></div>
    ${f.piege ? `<div class="carte"><h2>Piège fréquent</h2><p>${esc(f.piege)}</p></div>` : ""}
    <div class="actions"><button class="btn principal large" id="home">Retour</button></div>`, 55);
  $("#home").addEventListener("click", () => (retour || retourCarte)());
}

/** Accès direct à un écran (tests et reprise). */
export const ecrans = {
  mission: () => ecranMission(0), defi: ecranDefi, video: ecranVideo, bd: () => ecranBD(0),
  lecon: ecranLecon, miniverif: ecranMiniVerif,
  quiz: () => ecranQuiz(0, 0), boss: ecranBoss, fin: () => ecranFin(true), fiche: () => ecranFiche(E.C),
  remediation: () => MODULES[E.C.defi.type || "lots"].remediation(0, { suivant: () => ecranQuiz(0, 0) })
};
