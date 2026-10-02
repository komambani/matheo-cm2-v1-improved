// Défi « lots » (fraction d'une quantité) : les objets se regroupent en lots égaux, l'enfant en choisit, puis calcule.
// Utilisé par N22. Les textes viennent du contenu de la notion (scénario) ou de phrases.js.
import { creerJeu } from "../lots.js";
import { sfx } from "../sfx.js";
import { phrasesRemediation } from "../phrases.js";
import { incrementer } from "../store.js";
import { E, $, attendre, monter, barre, bulle, dans, clavier, gerbe, vivant, cle } from "../ui.js";

function trouverCorrection(C, reponse) {
  return C.corrections_defi.find((c) => c.reponses.includes(reponse)) || null;
}

export function defi(ctx) {
  const { C, d, zoneJeu, actions, dire_, erreur, succes, occupe } = ctx;
  const jeu = creerJeu({ total: d.total });
  zoneJeu.appendChild(jeu.svg);

  // Aide de niveau 5 : démonstration complète, puis micro-parcours.
  ctx.surAide5 = async () => {
    occupe.v = true; actions.innerHTML = "";
    await jeu.demonstration(d.den, d.num);
    if (!ctx.vivant()) return;
    occupe.v = false;
    actions.innerHTML = `<button class="btn principal large" id="parcours">Je m'entraîne avec Mathéo</button>`;
    $("#parcours").addEventListener("click", () => ctx.lancerRemediation());
  };

  function phasePartage() {
    jeu.remettreEnTas();
    dire_("Mathéo", C.interface.choisir_partage, "", "content");
    actions.innerHTML = `<div class="choix">${[3, 4, 6].map((n) => `<button data-n="${n}">Partager en ${n} parts égales</button>`).join("")}</div>`;
    actions.querySelectorAll("button").forEach((b) => b.addEventListener("click", async () => {
      if (occupe.v) return;
      const n = parseInt(b.dataset.n, 10);
      occupe.v = true; actions.innerHTML = "";
      await jeu.partager(n);
      if (!ctx.vivant()) return;
      occupe.v = false;
      if (n === d.den) phaseLots();
      else {
        const e = C.corrections_defi.find((c) => c.type === "E2");
        if (n === d.num) erreur("E2", "Mathéo", e.texte);
        else erreur("E1", "Mathéo", C.aide[0].texte);
        actions.innerHTML = `<button class="btn principal large" id="refaire">Recommencer le partage</button>`;
        $("#refaire").addEventListener("click", phasePartage);
      }
    }));
  }

  function phaseLots() {
    dire_("Mathéo", C.interface.toucher_parts, "", "content");
    actions.innerHTML = `<p class="centre discret" id="cpt">Parts choisies : 0</p><button class="btn principal large" id="prendre" disabled>Prendre ces parts</button>`;
    const cpt = $("#cpt"), bt = $("#prendre");
    jeu.surChoix = (n) => { cpt.textContent = `Parts choisies : ${n}`; bt.disabled = n === 0; };
    bt.addEventListener("click", async () => {
      if (occupe.v) return;
      const n = jeu.nombreChoisi();
      if (n !== d.num) {
        const e5 = C.corrections_defi.find((c) => c.type === "E5");
        const msg = n === 1 ? e5.texte : n === d.den ? C.interface.tout_pris : C.interface.nombre_haut;
        erreur(n === 1 ? "E5" : "E1", "Mathéo", msg);
        return;
      }
      occupe.v = true; bt.disabled = true;
      await jeu.prendre();
      if (!ctx.vivant()) return;
      occupe.v = false;
      dire_("Mathéo", d.voix_manipulation, "bravo", "joie");
      sfx.bravo();
      setTimeout(() => { if (ctx.vivant()) phaseReponse(); }, 1700);
    });
  }

  async function phaseReponse() {
    actions.innerHTML = "";
    const zone = document.createElement("div"); zone.style.display = "grid"; zone.style.gap = "10px";
    actions.appendChild(zone);
    for (;;) {
      const v = await clavier(zone, "Combien de mangues dans le panier ?");
      if (!ctx.vivant()) return;
      if (v === d.reponse) break;
      const c = trouverCorrection(C, v);
      erreur(c ? c.type : null, "Mathéo", c ? c.texte : C.correction_inconnue.texte);
    }
    succes();
  }

  phasePartage();
}

/** Micro-parcours de remédiation (4 étapes) : les lots se forment, puis l'enfant écrit le calcul. */
export function remediation(i, { suivant }) {
  const C = E.C;
  const etapes = C.remediation;
  const r = etapes[i];
  const jeu = creerJeu({ total: r.total, graine: i + 3 });
  const jeton = monter(`
    ${barre(`Je m'entraîne · ${i + 1}/${etapes.length}`, 1)}
    <div class="question">Trouve les ${r.num}/${r.den} de ${r.total}.</div>
    <div id="zone-jeu"></div><div id="parole"></div><div id="actions" class="actions"></div>`, 9 + i);
  $("#zone-jeu").appendChild(jeu.svg);
  const parole = $("#parole"), actions = $("#actions");
  const ok = () => vivant(jeton);
  const dire_ = (texte, type = "", humeur = "content") => dans(parole, bulle({ qui: "Mathéo", texte, type, humeur }), texte);
  const part = r.total / r.den;
  const P = phrasesRemediation(r);

  (async () => {
    dire_(P.partage);
    await jeu.partager(r.den);
    if (!ok()) return;
    const zone = document.createElement("div"); zone.style.display = "grid"; zone.style.gap = "10px";
    actions.innerHTML = ""; actions.appendChild(zone);
    for (;;) {
      const v = await clavier(zone, P.questionLot);
      if (!ok()) return;
      if (v === part) break;
      sfx.oups(); incrementer(`${C.id.toLowerCase()}.erreurs.E3`);
      dire_(P.lotFaux, "erreur", "pense");
    }
    dire_(P.lotJuste, "bravo", "joie"); sfx.bravo();
    await attendre(1200);
    if (!ok()) return;
    dire_(P.toucher);
    actions.innerHTML = `<button class="btn principal large" id="prendre" disabled>Prendre ces parts</button>`;
    const bt = $("#prendre");
    jeu.surChoix = (n) => { bt.disabled = n === 0; };
    await new Promise((res) => bt.addEventListener("click", async () => {
      if (jeu.nombreChoisi() !== r.num) { sfx.oups(); dire_(P.pasAssezDeLots, "erreur", "pense"); return; }
      bt.disabled = true; await jeu.prendre(); res();
    }));
    if (!ok()) return;
    actions.innerHTML = ""; actions.appendChild(zone);
    for (;;) {
      const v = await clavier(zone, P.questionTotal);
      if (!ok()) return;
      if (v === r.reponse) break;
      sfx.oups(); incrementer(`${C.id.toLowerCase()}.erreurs.E3`);
      dire_(P.totalFaux, "erreur", "pense");
    }
    gerbe(14); sfx.bravo();
    dire_(P.fini, "bravo", "joie");
    actions.innerHTML = `<button class="btn principal large" id="suite">${i < etapes.length - 1 ? "Suite" : "Continuer"}</button>`;
    $("#suite").addEventListener("click", () => (i < etapes.length - 1 ? remediation(i + 1, { suivant }) : suivant()));
  })();
}
