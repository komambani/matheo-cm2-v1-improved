// Éléments transversaux de la V1 : test de positionnement, Épisode 0 (BD + tutoriel), révision, sujet blanc du CEP,
// finale du chapitre Fractions, « Vérifie ma réponse » (tuteur) et espace adulte. Tout fonctionne hors ligne, sans donnée personnelle.
import { fragmentBoussole } from "./art.js";
import { sfx } from "./sfx.js";
import { dire, lire as lireVoix } from "./voix.js";
import { rendreScene } from "./scenes.js";
import { visuelSVG } from "./visuels.js";
import { creerAlea, melanger } from "./generators/fractions.js";
import { lire, ecrire, incrementer } from "./store.js";
import { executerEtapes } from "./defis/etapes.js";
import { etapesMultiplication, etapesDivision } from "./defis/pose.js";
import { E, $, esc, monter, vivant, barre, enonce, bulle, dans, gerbe, clavier } from "./ui.js";

const libelle = (o) => `${o.visuel ? visuelSVG(o.visuel, { largeur: 150, hauteur: 70 }) : ""}${o.t != null && o.t !== "" ? `<span>${esc(o.t)}</span>` : ""}`;
const messageDe = (q, o) => o.retour || (q.retour && q.retour[o.e]) || "Bip ! Montre-moi comment tu as fait.";

/**
 * Pose une série de questions à choix.
 *  mode « retour » : explication immédiate, on réessaie jusqu'à la bonne réponse (révision).
 *  mode « examen » : une seule réponse par question, aucun retour avant la fin (positionnement, CEP, finale).
 * Renvoie { details: [{ id, ok, choisi, retour }], premiers } quand tout est terminé.
 */
export async function jouerQuestions({ titre, questions, mode = "retour", graine = 1 }) {
  const details = [];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const alea = creerAlea(graine * 1000 + i * 31 + (Date.now() % 997));
    const options = melanger(alea, [{ t: q.bonne, visuel: q.bonne_visuel, ok: true }, ...q.mauvaises.map((m) => ({ ...m, ok: false }))]);
    const jeton = monter(`
      ${barre(`${titre} · ${i + 1}/${questions.length}`, -1)}
      ${q.niveau ? `<div><span class="niveau">Niveau ${q.niveau}</span></div>` : ""}
      ${enonce(q.question)}
      ${q.visuel ? `<div class="schema">${visuelSVG(q.visuel, { largeur: 300, hauteur: 110 })}</div>` : ""}
      <div class="choix ${options.some((o) => o.visuel) ? "visuels" : ""}" id="choix">${options.map((o, k) => `<button data-k="${k}"${o.visuel ? ` aria-label="${esc(o.visuel.alt || "schéma")}"` : ""}>${libelle(o)}</button>`).join("")}</div>
      <div id="parole"></div><div class="actions" id="actions"></div>`, 80 + i);
    const parole = $("#parole");
    await new Promise((fini) => {
      let premier = true, resolu = false, dernierFaux = null;
      $("#choix").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
        if (resolu || !vivant(jeton)) return;
        const o = options[parseInt(b.dataset.k, 10)];
        if (mode === "examen") {
          resolu = true; b.classList.add(o.ok ? "juste" : "choisi"); sfx.pop();
          details.push({ id: q.id, question: q.question, ok: o.ok, choisi: o.t || (o.visuel && o.visuel.alt) || "", bonne: q.bonne || (q.bonne_visuel && q.bonne_visuel.alt), retour: o.ok ? "" : messageDe(q, o), code: o.ok ? null : o.e, competence: q.competence, notion: q.notion, domaine: q.domaine });
          setTimeout(fini, 450);
          return;
        }
        if (o.ok) {
          resolu = true; b.classList.add("juste"); sfx.bravo();
          dans(parole, bulle({ qui: "Mathéo", texte: "Bip bip ! Bien joué !", type: "bravo", humeur: "joie" }), "Bip bip ! Bien joué !");
          details.push({ id: q.id, ok: premier, question: q.question, retour: dernierFaux || "" });
          $("#actions").innerHTML = `<button class="btn principal large" id="suite">${i < questions.length - 1 ? "Question suivante" : "Terminer"}</button>`;
          $("#choix").querySelectorAll("button").forEach((x) => (x.style.pointerEvents = "none"));
          $("#suite").addEventListener("click", fini);
        } else {
          premier = false; b.classList.add("faux"); b.style.pointerEvents = "none"; sfx.oups(); incrementer(`revision.erreurs.${o.e}`);
          dernierFaux = messageDe(q, o);
          dans(parole, bulle({ qui: "Mathéo", texte: dernierFaux, type: "erreur", humeur: "pense" }), dernierFaux);
        }
      }));
    });
  }
  return { details, premiers: details.filter((d) => d.ok).length };
}

/** Carte récapitulative d'une correction (examen). */
function correctionHtml(details) {
  return details.map((d) => `<div class="carte" style="margin-bottom:8px"><h2>${d.ok ? "✓ Juste" : "✗ À revoir"} · ${esc(d.id)}</h2><p>${esc(d.question)}</p>
    ${d.ok ? "" : `<p class="discret">Ta réponse : ${esc(d.choisi)}</p><p><b>Bonne réponse : ${esc(d.bonne)}</b></p><p>${esc(d.retour)}</p>`}</div>`).join("");
}

/* ---------- test de positionnement ---------- */

export async function positionnement({ P, retour, lancer }) {
  const jeton = monter(`
    ${barre("Test de positionnement", -1)}
    <div class="carte"><h2>${esc(P.titre)}</h2><p class="gros">${esc(P.intro)}</p></div>
    <div class="actions"><button class="btn principal large" id="go">Commencer</button><button class="btn large" id="retour">Plus tard</button></div>`, 90);
  dire(P.intro);
  const commencer = await new Promise((res) => { $("#go").addEventListener("click", () => res(true)); $("#retour").addEventListener("click", () => res(false)); });
  if (!commencer) return retour();
  const { details } = await jouerQuestions({ titre: "Positionnement", questions: P.questions, mode: "examen", graine: 3 });
  const score = {};
  for (const q of P.questions) score[q.competence] = score[q.competence] || { ok: 0, total: 0 };
  details.forEach((d) => { score[d.competence].total++; if (d.ok) score[d.competence].ok++; });
  // On oriente vers la première compétence en dessous de son seuil, dans l'ordre : multiplication, division, sens, consigne.
  const manque = ["mult", "div", "sens", "consigne"].find((c) => score[c] && score[c].ok < Math.min(P.seuils[c], score[c].total));
  const orientation = P.orientations[manque || "aucune"];
  ecrire("positionnement.fait", true); ecrire("positionnement.notion", orientation.notion);
  ecrire("positionnement.scores", Object.fromEntries(Object.entries(score).map(([k, v]) => [k, `${v.ok}/${v.total}`])));
  monter(`
    ${barre("Résultat du positionnement", -1)}
    <div class="carte"><h2>Ton point de départ</h2><p class="gros">${esc(orientation.message)}</p></div>
    <div class="carte"><h2>Tes réponses</h2>${Object.entries(score).map(([k, v]) => `<p>${{ mult: "Multiplication", div: "Division et partage", sens: "Choix de l'opération", consigne: "Lecture des énoncés" }[k]} : ${v.ok} sur ${v.total}</p>`).join("")}</div>
    <div class="actions"><button class="btn principal large" id="go">Aller à ${orientation.notion}</button><button class="btn large" id="retour">Revenir à la carte</button></div>`, 91);
  dire(orientation.message);
  $("#go").addEventListener("click", () => lancer(orientation.notion));
  $("#retour").addEventListener("click", retour);
}

/* ---------- Épisode 0 : BD puis tutoriel ---------- */

export async function episode0({ C, retour }) {
  const cases = C.bd.cases;
  for (let i = 0; i < cases.length; i++) {
    const c = cases[i];
    const jeton = monter(`
      ${barre("Épisode 0 · " + C.bd.titre, -1)}
      <div class="bd-case">${rendreScene(c.scene, { aria: `Case ${c.n}` })}</div>
      <p class="discret centre" style="margin:0">Case ${c.n} / ${cases.length}</p>
      ${c.legende ? `<div class="legende">${esc(c.legende)}</div>` : ""}
      <div class="bd-paroles">${c.bulles.map((b) => bulle({ qui: b.qui, texte: b.texte, humeur: b.humeur || "content" })).join("")}</div>
      ${c.encadre ? `<div class="carte"><h2>À retenir</h2><p class="gros">${esc(c.encadre)}</p></div>` : ""}
      <div class="actions"><button class="btn principal large" id="suite">${i < cases.length - 1 ? "Case suivante" : "Apprendre à jouer"}</button></div>`, 100 + i);
    (async () => { for (const b of c.bulles) { if (!vivant(jeton)) return; await lireVoix(b.texte); } if (c.legende && vivant(jeton)) await lireVoix(c.legende); })();
    await new Promise((res) => $("#suite").addEventListener("click", res));
  }
  // Tutoriel : on explique, puis l'enfant essaie trois gestes (choisir, taper un nombre, colorier).
  const T = C.tutoriel;
  const jeton = monter(`
    ${barre("Comment jouer", -1, `<button class="rond" id="aide" aria-label="Exemple d'indice">💡</button>`)}
    <div class="carte"><h2>${esc(T.intro)}</h2><p>💡 ${esc(T.aide_texte)}</p><p>🔈 ${esc(T.ecoute_texte)}</p></div>
    <div id="zone-jeu"></div><div id="parole"></div><div id="actions" class="actions libre"></div>`, 110);
  dire(T.intro);
  const parole = $("#parole");
  $("#aide").addEventListener("click", () => { sfx.bip(); dans(parole, bulle({ qui: "Mathéo", texte: T.aide_texte, humeur: "pense" }), T.aide_texte); });
  const ctx = {
    C: { correction_inconnue: { texte: "Bip ! Montre-moi comment tu as fait." } },
    zoneJeu: $("#zone-jeu"), actions: $("#actions"), parole,
    vivant: () => vivant(jeton),
    dire_: (qui, texte, type = "", humeur = "content") => dans(parole, bulle({ qui, texte, type, humeur }), texte),
    erreur: (code, qui, texte) => { sfx.oups(); dans(parole, bulle({ qui, texte, type: "erreur", humeur: "pense" }), texte); }
  };
  const ok = await executerEtapes(ctx, T.etapes);
  if (!ok || !vivant(jeton)) return;
  ecrire("episode0.fait", true);
  gerbe(30); sfx.bravo();
  ctx.dire_("Mathéo", T.fin, "bravo", "joie");
  ctx.actions.innerHTML = `<button class="btn principal large" id="suite">À la carte des aventures</button>`;
  $("#suite").addEventListener("click", retour);
}

/* ---------- révision ---------- */

export async function revision({ index, charger, retour, ouvrirFiche }) {
  const faits = index.notions.filter((n) => lire(`${n.id.toLowerCase()}.fini`, false));
  if (!faits.length) {
    monter(`${barre("Révision", -1)}<div class="carte"><h2>Révision</h2><p class="gros">Termine d'abord une aventure : la révision reprend les notions que tu as déjà réussies.</p></div><div class="actions"><button class="btn principal large" id="retour">Retour</button></div>`, 120);
    return $("#retour").addEventListener("click", retour);
  }
  const questions = [];
  const alea = creerAlea(Date.now() % 100000);
  for (const n of faits) {
    const C = await charger(n.id);
    // On revient plus souvent sur les erreurs fréquentes de l'enfant : chaque question est pondérée par les erreurs enregistrées.
    const erreurs = lire(`${n.id.toLowerCase()}.erreurs`, {});
    const pondere = C.quiz.map((q) => ({ q, poids: 1 + q.mauvaises.reduce((a, m) => a + (erreurs[m.e] || 0), 0) }));
    pondere.sort((a, b) => b.poids * (0.5 + alea()) - a.poids * (0.5 + alea()));
    pondere.slice(0, 2).forEach((p) => questions.push({ ...p.q, id: `${n.id}-${p.q.id}` }));
  }
  const choisies = melanger(alea, questions).slice(0, 10);
  const { premiers } = await jouerQuestions({ titre: "Révision", questions: choisies, mode: "retour", graine: 5 });
  incrementer("revision.seances");
  monter(`
    ${barre("Révision terminée", -1)}
    <div class="carte centre"><h2>Bravo !</h2><p class="gros">${premiers} bonnes réponses du premier coup sur ${choisies.length}</p><p class="discret">Mathéo te reproposera plus souvent les questions où tu hésites.</p></div>
    <div class="actions"><button class="btn principal large" id="retour">Retour à la carte</button></div>`, 121);
  gerbe(18); sfx.bravo();
  $("#retour").addEventListener("click", retour);
}

/* ---------- Prépare le CEP : sujet blanc ---------- */

export async function cep({ S, retour }) {
  const jeton = monter(`
    ${barre("Prépare le CEP", -1)}
    <div class="carte"><h2>${esc(S.titre)}</h2><p class="gros">${esc(S.consigne)}</p></div>
    <div class="actions"><button class="btn principal large" id="go">Commencer</button><button class="btn large" id="retour">Plus tard</button></div>`, 130);
  dire(S.consigne);
  const go = await new Promise((res) => { $("#go").addEventListener("click", () => res(true)); $("#retour").addEventListener("click", () => res(false)); });
  if (!go) return retour();
  const { details } = await jouerQuestions({ titre: "Sujet blanc", questions: S.questions, mode: "examen", graine: 7 });
  const juste = details.filter((d) => d.ok).length;
  ecrire("cep1.score", juste); ecrire("cep1.total", S.questions.length);
  const parDomaine = {};
  details.forEach((d) => { parDomaine[d.domaine] = parDomaine[d.domaine] || { ok: 0, total: 0 }; parDomaine[d.domaine].total++; if (d.ok) parDomaine[d.domaine].ok++; });
  monter(`
    ${barre("Correction du sujet blanc", -1)}
    <div class="carte centre"><h2>Ton résultat</h2><p class="gros">${juste} sur ${S.questions.length}</p>
      ${Object.entries(parDomaine).map(([k, v]) => `<p class="discret">${esc(k)} : ${v.ok} sur ${v.total}</p>`).join("")}</div>
    ${correctionHtml(details)}
    <div class="actions"><button class="btn principal large" id="retour">Retour à la carte</button></div>`, 131);
  if (juste === S.questions.length) { gerbe(30); sfx.bravo(); } else sfx.bip();
  $("#retour").addEventListener("click", retour);
}

/* ---------- finale du chapitre Fractions ---------- */

export async function finale({ F, retour }) {
  const manquants = F.prerequis.filter((id) => !lire(`${id.toLowerCase()}.fragment`, false));
  if (manquants.length) {
    monter(`${barre("Finale des Fractions", -1)}<div class="carte"><h2>Pas encore !</h2><p class="gros">Il te manque ${manquants.length} étoile${manquants.length > 1 ? "s" : ""} des fractions.</p><p>À terminer : ${manquants.join(", ")}.</p></div><div class="actions"><button class="btn principal large" id="retour">Retour à la carte</button></div>`, 140);
    return $("#retour").addEventListener("click", retour);
  }
  for (;;) {
    monter(`
      ${barre("Finale des Fractions", -1)}
      <div class="centre"><div class="fragment arrive">${fragmentBoussole()}</div></div>
      <div class="carte"><h2>La Grande Pirogue</h2><p class="gros">${esc(F.intro)}</p></div>
      <div class="actions"><button class="btn principal large" id="go">Commencer</button><button class="btn large" id="retour">Plus tard</button></div>`, 141);
    dire(F.intro);
    const go = await new Promise((res) => { $("#go").addEventListener("click", () => res(true)); $("#retour").addEventListener("click", () => res(false)); });
    if (!go) return retour();
    const { details } = await jouerQuestions({ titre: "Finale", questions: F.questions, mode: "examen", graine: 9 });
    const juste = details.filter((d) => d.ok).length;
    if (juste >= F.questions.length - 1) {
      ecrire("finale4.fini", true); ecrire("finale4.score", juste);
      monter(`
        ${barre("Les étoiles brillent ensemble !", -1)}
        <div class="centre"><div class="fragment arrive">${fragmentBoussole()}</div></div>
        <div class="carte centre"><h2>Chapitre Fractions terminé</h2><p class="gros">${esc(F.reussite)}</p><p class="discret">${juste} bonnes réponses sur ${F.questions.length}</p></div>
        ${juste < F.questions.length ? correctionHtml(details.filter((d) => !d.ok)) : ""}
        <div class="actions"><button class="btn principal large" id="retour">Retour à la carte</button></div>`, 142);
      sfx.fragment(); gerbe(40); dire(F.reussite);
      return $("#retour").addEventListener("click", retour);
    }
    monter(`
      ${barre("Pas tout à fait", -1)}
      <div class="carte centre"><h2>${juste} sur ${F.questions.length}</h2><p class="gros">Il faut au plus une erreur pour réunir les étoiles. Relis les explications, puis réessaie.</p></div>
      ${correctionHtml(details)}
      <div class="actions"><button class="btn principal large" id="encore">Réessayer</button><button class="btn large" id="retour">Retour à la carte</button></div>`, 143);
    sfx.bip();
    const encore = await new Promise((res) => { $("#encore").addEventListener("click", () => res(true)); $("#retour").addEventListener("click", () => res(false)); });
    if (!encore) return retour();
  }
}

/* ---------- Vérifie ma réponse (tuteur) ---------- */

/** Explique pas à pas un calcul. Renvoie { juste, lignes } pour que l'enfant comprenne même quand il a raison. */
export function expliquerCalcul(op, a, b, c, reponse) {
  if (op === "mul") {
    const bonne = a * b;
    const lignes = b < 10 ? etapesMultiplication(a, b).filter((e) => /^Calcule|^Ajoute/.test(e.question)).map((e) => `${e.question.replace(/^Calcule |^Ajoute la retenue \d+ : /, "").replace(/\.$/, "")} = ${e.reponse}`) : [];
    return { bonne, juste: reponse === bonne, lignes, resume: `${a} × ${b} = ${bonne}` };
  }
  if (op === "div") {
    const q = Math.floor(a / b), r = a % b;
    const lignes = b < 10 && a >= 10 ? etapesDivision(a, b).filter((e) => /^Combien de fois|^Calcule/.test(e.question)).map((e) => `${e.question.replace(/\?$/, "").replace(/\.$/, "")} → ${e.reponse}`) : [];
    return { bonne: q, juste: reponse === q, lignes, resume: `${a} ÷ ${b} = ${q}${r ? `, reste ${r}` : ""}`, reste: r };
  }
  // fraction d'une quantité : a/b de c
  if (c % b !== 0) return { erreur: `${c} ne se partage pas en ${b} parts égales (reste ${c % b}).` };
  const part = c / b, bonne = part * a;
  return { bonne, juste: reponse === bonne, lignes: [`${c} ÷ ${b} = ${part} (on partage avec le bas)`, `${part} × ${a} = ${bonne} (on prend ${a} part${a > 1 ? "s" : ""})`], resume: `${a}/${b} de ${c} = ${bonne}` };
}

export async function verifier({ retour }) {
  for (;;) {
    const jeton = monter(`
      ${barre("Vérifie ma réponse", -1)}
      <div class="carte"><h2>Vérifie ma réponse</h2><p class="gros">Choisis un calcul. Tu tapes ta réponse, et Mathéo te dit si elle est juste, avec le chemin.</p></div>
      <div class="choix"><button data-op="mul">Une multiplication</button><button data-op="div">Une division</button><button data-op="frac">Une fraction d'une quantité</button></div>
      <div class="actions"><button class="btn large" id="retour">Retour</button></div>`, 150);
    const op = await new Promise((res) => { document.querySelectorAll("[data-op]").forEach((b) => b.addEventListener("click", () => res(b.dataset.op))); $("#retour").addEventListener("click", () => res(null)); });
    if (!op) return retour();
    const zone = document.createElement("div"); zone.style.display = "grid"; zone.style.gap = "10px";
    const j2 = monter(`${barre("Vérifie ma réponse", -1)}<div id="saisie"></div>`, 151);
    $("#saisie").appendChild(zone);
    let a, b, c = 1;
    if (op === "mul") { a = await clavier(zone, "Le premier nombre (par exemple 47)"); b = await clavier(zone, "Multiplié par un chiffre (de 2 à 9)"); }
    else if (op === "div") { a = await clavier(zone, "Le nombre à diviser (par exemple 156)"); b = await clavier(zone, "Divisé par un chiffre (de 2 à 9)"); }
    else { a = await clavier(zone, "Le haut de la fraction (par exemple 3)"); b = await clavier(zone, "Le bas de la fraction (par exemple 4)"); c = await clavier(zone, "La quantité (par exemple 24)"); }
    if (!vivant(j2)) return;
    if ((op !== "frac" && (b < 2 || b > 9)) || (op === "frac" && (a >= b || a < 1 || b < 2)) || a < 1) {
      monter(`${barre("Vérifie ma réponse", -1)}<div class="carte"><h2>Oups</h2><p class="gros">${op === "frac" ? "Choisis une fraction plus petite que 1 : le haut doit être plus petit que le bas." : "Le deuxième nombre doit être un chiffre de 2 à 9."}</p></div><div class="actions"><button class="btn principal large" id="encore">Recommencer</button></div>`, 152);
      await new Promise((res) => $("#encore").addEventListener("click", res));
      continue;
    }
    const attendu = expliquerCalcul(op, a, b, c, 0);
    if (attendu.erreur) {
      monter(`${barre("Vérifie ma réponse", -1)}<div class="carte"><h2>Oups</h2><p class="gros">${esc(attendu.erreur)}</p></div><div class="actions"><button class="btn principal large" id="encore">Recommencer</button></div>`, 152);
      await new Promise((res) => $("#encore").addEventListener("click", res));
      continue;
    }
    const enonceTexte = op === "mul" ? `${a} × ${b}` : op === "div" ? `${a} ÷ ${b}` : `${a}/${b} de ${c}`;
    const j3 = monter(`${barre("Vérifie ma réponse", -1)}<div class="carte"><h2>Ton calcul</h2><p class="gros">${esc(enonceTexte)}</p></div><div id="saisie"></div>`, 153);
    const z2 = document.createElement("div"); z2.style.display = "grid"; z2.style.gap = "10px"; $("#saisie").appendChild(z2);
    const rep = await clavier(z2, "Quelle est ta réponse ?");
    if (!vivant(j3)) return;
    const r = expliquerCalcul(op, a, b, c, rep);
    incrementer(r.juste ? "tuteur.justes" : "tuteur.fausses");
    monter(`
      ${barre("Vérifie ma réponse", -1)}
      ${bulle({ qui: "Mathéo", texte: r.juste ? "Bip bip ! Ta réponse est juste !" : "Bip ! Pas tout à fait. Regardons ensemble.", type: r.juste ? "bravo" : "erreur", humeur: r.juste ? "joie" : "pense" })}
      <div class="carte"><h2>${esc(enonceTexte)}</h2><p class="gros">${esc(r.resume)}</p>${r.lignes.map((l) => `<p class="discret">${esc(l)}</p>`).join("")}${r.juste ? "" : `<p>Ta réponse : ${rep}. Bonne réponse : ${r.bonne}.</p>`}</div>
      <div class="actions"><button class="btn principal large" id="encore">Un autre calcul</button><button class="btn large" id="retour">Retour</button></div>`, 154);
    r.juste ? (sfx.bravo(), gerbe(12)) : sfx.oups();
    const encore = await new Promise((res) => { $("#encore").addEventListener("click", () => res(true)); $("#retour").addEventListener("click", () => res(false)); });
    if (!encore) return retour();
  }
}

/* ---------- espace adulte : tableau de bord minimal (sur cet appareil) ---------- */

export async function adulte({ index, retour }) {
  // Petite porte pour les adultes (ce n'est pas une protection : aucune donnée sensible n'est stockée).
  const zone = document.createElement("div"); zone.style.display = "grid"; zone.style.gap = "10px";
  const j = monter(`${barre("Espace adulte", -1)}<div class="carte"><h2>Espace adulte</h2><p>Pour entrer, résous ce calcul.</p></div><div id="saisie"></div><div class="actions"><button class="btn large" id="retour">Retour</button></div>`, 160);
  $("#saisie").appendChild(zone);
  $("#retour").addEventListener("click", retour);
  const rep = await clavier(zone, "7 × 8 = ?");
  if (!vivant(j)) return;
  if (rep !== 56) { sfx.oups(); return adulte({ index, retour }); }
  const lignes = index.notions.map((n) => {
    const k = n.id.toLowerCase();
    const e = lire(`${k}.erreurs`, {});
    const top = Object.entries(e).sort((x, y) => y[1] - x[1]).slice(0, 2).map(([c, v]) => `${c} ×${v}`).join(", ");
    return `<tr><td>${n.id}</td><td>${esc(n.titre)}</td><td>${lire(`${k}.fini`, false) ? "✓ " + lire(`${k}.etoiles`, 0) + "/3" : "—"}</td><td>${lire(`${k}.quiz.score`, "—")}</td><td>${top || "—"}</td></tr>`;
  }).join("");
  const toutes = {};
  index.notions.forEach((n) => Object.entries(lire(`${n.id.toLowerCase()}.erreurs`, {})).forEach(([c, v]) => { toutes[c] = (toutes[c] || 0) + v; }));
  const frequentes = Object.entries(toutes).sort((x, y) => y[1] - x[1]).slice(0, 5);
  const NOMS = { E1: "compréhension", E2: "méthode (haut/bas, colonnes)", E3: "calcul", E5: "attention (retenue, étape oubliée)", E6: "vocabulaire", E7: "raisonnement", E8: "mauvaise opération", E9: "interprétation (autre question)" };
  monter(`
    ${barre("Espace adulte", -1)}
    <div class="carte"><h2>Sur cet appareil</h2><p>Positionnement : ${lire("positionnement.fait", false) ? "fait, point de départ " + lire("positionnement.notion", "—") : "non fait"} · Épisode 0 : ${lire("episode0.fait", false) ? "fait" : "non fait"}</p>
      <p>Sujet blanc du CEP : ${lire("cep1.score", null) === null ? "non fait" : lire("cep1.score", 0) + " sur " + lire("cep1.total", 10)} · Finale des Fractions : ${lire("finale4.fini", false) ? "réussie" : "à faire"}</p></div>
    <div class="carte"><h2>Erreurs les plus fréquentes</h2>${frequentes.length ? frequentes.map(([c, v]) => `<p>${c} · ${NOMS[c] || "autre"} : ${v} fois</p>`).join("") : "<p>Aucune erreur enregistrée.</p>"}</div>
    <div class="carte" style="overflow-x:auto"><h2>Progression par notion</h2><table class="tab"><tr><th>#</th><th>Notion</th><th>Étoiles</th><th>Quiz</th><th>Erreurs</th></tr>${lignes}</table></div>
    <div class="carte"><h2>À savoir</h2><p class="discret">Ces chiffres restent sur cet appareil : aucun nom, aucun identifiant. Le suivi par classe demande un serveur et un accord de protection des données, prévus après le pilote.</p></div>
    <div class="actions"><button class="btn large" id="export">Exporter ces chiffres (anonymes)</button><button class="btn principal large" id="retour2">Retour à la carte</button></div>`, 161);
  $("#retour2").addEventListener("click", retour);
  $("#export").addEventListener("click", () => {
    const donnees = { date: new Date().toISOString().slice(0, 10), notions: Object.fromEntries(index.notions.map((n) => [n.id, lire(n.id.toLowerCase(), {})])), positionnement: lire("positionnement", {}), cep1: lire("cep1", {}), finale4: lire("finale4", {}) };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(donnees, null, 1)], { type: "application/json" }));
    a.download = "matheo-progression-anonyme.json"; a.click();
  });
}
