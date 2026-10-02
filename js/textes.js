// Liste de TOUS les textes prononcés par l'application pour une notion, avec la voix qui les dit.
// Sert à générer les fichiers audio (tools/voix/) : même source que l'écran, donc aucun écart.
import { creerAlea, messageErreur } from "./generators/fractions.js";
import { phrasesRemediation } from "./phrases.js";
import { developper } from "./defis/pose.js";

/** Notion N22 (écrite à la main, avec des messages calculés). */
function textesN22(C) {
  const liste = [];
  const ajouter = (qui, texte) => { if (texte && !liste.some((x) => x.texte === texte)) liste.push({ qui, texte }); };

  for (const m of C.mission) ajouter(m.qui, m.texte);
  ajouter("Narrateur", C.defi.enonce);
  ajouter("Mathéo", C.defi.voix_manipulation);
  ajouter("Mathéo", C.defi.reussite);
  ajouter("Mathéo", C.defi.exemple_resolu);
  for (const a of C.aide) ajouter("Mathéo", a.texte);
  for (const c of C.corrections_defi) ajouter("Mathéo", c.texte);
  ajouter("Mathéo", C.correction_lots_inegaux.texte);
  ajouter("Mathéo", C.correction_inconnue.texte);
  for (const [cle, t] of Object.entries(C.interface)) if (cle !== "src") ajouter("Mathéo", t);

  for (const q of C.quiz) {
    ajouter("Narrateur", q.question);
    for (const m of q.mauvaises) {
      let msg = q.retour && q.retour[m.e];
      if (!msg && q.total) msg = messageErreur(C.modeles_correction, { ...q, part: q.total / q.den }, { code: m.e, valeur: parseInt(m.t, 10) });
      ajouter("Mathéo", msg);
    }
  }
  ajouter("Narrateur", C.boss.question);
  ajouter("Mathéo", C.boss.indice);
  for (const m of C.boss.mauvaises) ajouter("Mathéo", m.retour);

  for (const r of C.remediation) {
    const p = phrasesRemediation(r);
    for (const t of Object.values(p)) ajouter("Mathéo", t);
  }
  for (const c of C.bd.cases) {
    for (const b of c.bulles) ajouter(b.qui, b.texte);
    if (c.legende) ajouter("Narrateur", c.legende);
    if (c.encadre) ajouter("Mathéo", c.encadre);
  }
  for (const s of C.video.segments) for (const p of s.parties) ajouter("Mathéo", p.texte);
  ajouter("Mathéo", C.essentiel);
  ajouter("Mathéo", C.pourquoi);
  return liste;
}

// Clés dont la valeur est une phrase à dire. Le narrateur lit les énoncés ; Mathéo dit le reste.
const CLES_NARRATEUR = /^(question|enonce|legende|question_.*)$/;
const CLES_DITES = /^(texte|intro|consigne|aide_texte|ecoute_texte|message|question|enonce|retour|retour_.*|reussite|fin|voix_fin|indice|legende|encadre|essentiel|pourquoi|question_.*)$/;

/** Parcourt tout le contenu et relève les phrases à dire (notions décrites en données). */
function textesGeneriques(C) {
  const liste = [];
  const ajouter = (qui, texte) => { if (typeof texte === "string" && texte.trim() && !liste.some((x) => x.texte === texte)) liste.push({ qui, texte }); };
  const ignorer = new Set(["interface", "src", "note", "fiche", "visuel", "bonne_visuel", "scene", "mission_scene", "controles", "seuils", "prerequis"]);

  (function marcher(noeud, qui) {
    if (Array.isArray(noeud)) { noeud.forEach((x) => marcher(x, qui)); return; }
    if (noeud && typeof noeud === "object") {
      const loc = typeof noeud.qui === "string" ? noeud.qui : qui;
      for (const [k, v] of Object.entries(noeud)) {
        if (ignorer.has(k)) continue;
        if (typeof v === "string") { if (CLES_DITES.test(k)) ajouter(CLES_NARRATEUR.test(k) && !noeud.qui ? "Narrateur" : loc, v); }
        else if (k === "retour" && v && typeof v === "object" && !Array.isArray(v)) Object.values(v).forEach((t) => ajouter("Mathéo", t));
        else marcher(v, loc);
      }
    }
  })(C, "Mathéo");
  for (const [cle, t] of Object.entries(C.interface || {})) if (cle !== "src") ajouter("Mathéo", t);
  // Opérations posées : les phrases sont fabriquées par le code (mêmes fonctions que l'écran).
  const parcours = [...((C.defi && C.defi.etapes) || []), ...(C.remediation || []).flatMap((r) => r.etapes || [])];
  for (const s of parcours.filter((x) => x.type === "pose" || x.type === "division")) {
    for (const m of developper(s)) {
      ajouter("Mathéo", m.intro); ajouter("Narrateur", m.question); ajouter("Mathéo", m.retour_defaut);
      for (const e of m.erreurs || []) ajouter("Mathéo", e.texte);
    }
  }
  return liste;
}

export function listerTextes(C) {
  return C.id === "N22" ? textesN22(C) : textesGeneriques(C);
}
