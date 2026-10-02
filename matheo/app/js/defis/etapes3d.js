// Défi « étapes » avec une scène 3D au-dessus : chaque étape réussie fait avancer la scène (ex. des sacs volent dans la charrette).
// Si le téléphone ne sait pas faire de 3D (ou en mode test), on retombe sur la version 2D, identique pour l'enfant côté questions.
import * as etapes from "./etapes.js";
import { executerEtapes } from "./etapes.js";

const SCENES = { marche: () => import("../vendor/marche3d.js") };

/** La 3D est coupée en test (`?test`) ou sur demande (`?2d`), et par la mémoire/le GPU du téléphone. */
async function charger3D(nom) {
  const q = new URLSearchParams(location.search);
  if (q.has("2d") || q.has("test")) return null;
  const charge = SCENES[nom];
  if (!charge) return null;
  try {
    const mod = await charge();
    return mod.peut3D() ? mod : null;
  } catch { return null; }
}

export function defi(ctx) {
  const nom = ctx.d.scene3d;
  (async () => {
    const mod = nom ? await charger3D(nom) : null;
    if (!ctx.vivant()) return;
    if (!mod) { etapes.defi(ctx); return; }
    const scene = document.createElement("div");
    scene.className = "scene3d"; scene.id = "scene3d";
    ctx.zoneJeu.insertAdjacentElement("beforebegin", scene);
    let m;
    try {
      const faible = (navigator.hardwareConcurrency || 4) <= 4 || (navigator.deviceMemory || 4) <= 3;
      m = mod.creerMarche(scene, { basseQualite: faible });
    } catch { scene.remove(); etapes.defi(ctx); return; }
    window.__scene3d = m;
    // libère la carte graphique dès que l'écran est quitté
    const veille = setInterval(() => { if (!ctx.vivant()) { clearInterval(veille); try { m.detruire(); } catch { /* déjà détruite */ } if (window.__scene3d === m) window.__scene3d = null; } }, 400);
    ctx.apresEtape = (fait, total) => m.progres(fait / total);
    const ok = await executerEtapes(ctx, ctx.d.etapes);
    if (ok && ctx.vivant()) { m.progres(1); m.etoile(); ctx.succes(); }
  })();
}

export const remediation = etapes.remediation;
