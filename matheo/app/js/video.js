// Vidéo « pour les nuls » (3 min 10) : tableau dessiné à la craie, voix de Mathéo, sous-titres synchronisés.
// Format du scénario : au plus 3 éléments à l'écran en même temps, aucune intrigue. Fonctionne hors ligne.
import { lire, arreter, pauseVoix } from "./voix.js";
import { barreSVG, disqueSVG, objetsSVG, poseSVG, divisionSVG } from "./visuels.js";

const NS = "http://www.w3.org/2000/svg";
const ANNULE = Symbol("annule");
const CRAIE = "'Segoe Print','Bradley Hand','Comic Sans MS',cursive,system-ui,sans-serif";
// Réservé aux tests automatiques : ?vitesse=8 accélère l'horloge (jamais utilisé par un élève).
const VITESSE = Math.min(20, Number(new URLSearchParams(location.search).get("vitesse")) || 1);
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

// Positions des 12 galettes : posées dans l'assiette (4 × 3), puis regroupées en 3 tas de 4.
const assiette = (k) => ({ x: 129 + (k % 4) * 34, y: 66 + Math.floor(k / 4) * 34 });
const DECALES = [[-14, -14], [14, -14], [-14, 14], [14, 14]];
const TAS_X = [72, 180, 288];
const tas = (k, y = 104) => ({ x: TAS_X[Math.floor(k / 4)] + DECALES[k % 4][0], y: y + DECALES[k % 4][1] });

export function creerVideo(C, racine, { surFin } = {}) {
  const V = C.video;
  racine.innerHTML = `
    <div class="video">
      <svg class="tableau" viewBox="0 0 360 203" role="img" aria-label="Tableau dessiné : ${V.titre}">
        <rect width="360" height="203" rx="10" fill="#1f3d36"/>
        <rect x="3" y="3" width="354" height="197" rx="8" fill="none" stroke="#2f5a4f" stroke-width="2"/>
        <g id="scene"></g>
      </svg>
      <div class="sous-titre" id="v-st" aria-live="polite">&nbsp;</div>
      <div class="lecteur">
        <button class="rond" id="v-play" aria-label="Pause">⏸</button>
        <div class="barre-v" role="progressbar" aria-valuemin="0" aria-valuemax="${V.duree}"><i id="v-prog"></i></div>
        <span id="v-temps" class="discret">0:00 / ${fmt(V.duree)}</span>
        <button class="rond" id="v-rejouer" aria-label="Recommencer">↺</button>
      </div>
    </div>`;
  const $ = (s) => racine.querySelector(s);
  const scene = $("#scene"), st = $("#v-st"), bPlay = $("#v-play"), prog = $("#v-prog"), tmps = $("#v-temps");

  // Horloge qui sait faire pause : tout le déroulé se cale dessus.
  const h = { t: 0, pause: false, run: 0, attentes: [], fini: false, detruit: false };
  const timer = setInterval(() => {
    if (h.pause || h.detruit) return;
    h.t += 0.05 * VITESSE;
    prog.style.width = `${Math.min(100, (h.t / V.duree) * 100)}%`;
    tmps.textContent = `${fmt(Math.min(h.t, V.duree))} / ${fmt(V.duree)}`;
    h.attentes = h.attentes.filter((a) => { if (h.t >= a.cible) { a.res(); return false; } return true; });
  }, 50);
  const jusqua = (cible, run) => new Promise((res, rej) => {
    const ok = () => (run !== h.run || h.detruit ? rej(ANNULE) : res());
    if (h.t >= cible) ok(); else h.attentes.push({ cible, res: ok });
  });

  /* --- petites briques de dessin --- */
  const el = (html) => { scene.insertAdjacentHTML("beforeend", html); return scene.lastElementChild; };
  const voir = (e) => setTimeout(() => e.classList.add("vu"), 30); // délai court : fonctionne aussi quand l'onglet est en arrière-plan
  const texte = (id, s, x, y, taille, couleur = "#fff") =>
    el(`<text id="${id}" class="el" x="${x}" y="${y}" font-size="${taille}" font-weight="700" fill="${couleur}" text-anchor="middle" font-family="${CRAIE}">${s}</text>`);
  const galette = (k, p, cls = "") =>
    el(`<g id="gal${k}" class="el gal ${cls}" style="transform:translate(${p.x}px,${p.y}px)"><circle r="12" fill="#e0a24a" stroke="#8a5a1e" stroke-width="1.6"/><circle cx="-4" cy="-4" r="2" fill="#f6d28a"/><circle cx="4" cy="3" r="1.6" fill="#f6d28a"/><circle cx="-3" cy="5" r="1.4" fill="#f6d28a"/></g>`);
  const ovale = (cx, cy, couleur = "#ffe066") =>
    el(`<ellipse class="el" cx="${cx}" cy="${cy}" rx="38" ry="38" fill="rgba(255,224,102,.14)" stroke="${couleur}" stroke-width="3"/>`);
  const effacer = async (run) => {
    scene.querySelectorAll(".el").forEach((e) => e.classList.remove("vu"));
    await jusqua(h.t + 0.6, run);
    scene.innerHTML = "";
  };

  async function lireParties(run) {
    for (const seg of V.segments) {
      for (const p of seg.parties) {
        (async () => {
          try {
            await jusqua(seg.debut + p.t, run);
            st.textContent = p.texte;
            await lire(p.texte);
          } catch (e) { if (e !== ANNULE) throw e; }
        })();
      }
      (async () => { try { await jusqua(seg.fin - 0.2, run); st.innerHTML = "&nbsp;"; } catch (e) { if (e !== ANNULE) throw e; } })();
    }
  }

  async function derouler(run) {
    const at = (t) => jusqua(t, run);
    try {
      lireParties(run);
      /* 0:00–0:15 · une assiette, 12 galettes comptables */
      await at(0.2);
      voir(el(`<ellipse id="assiette" class="el" cx="180" cy="100" rx="98" ry="64" fill="#e9e4d6" stroke="#b9b09a" stroke-width="3"/>`));
      for (let k = 0; k < 12; k++) { await at(4 + k * 0.4); voir(galette(k, assiette(k))); }

      /* 0:15–0:40 · la fraction 2/3 et ses flèches */
      await at(15); await effacer(run);
      await at(16);
      voir(el(`<g id="frac" class="el"><text id="num" x="180" y="92" font-size="66" font-weight="700" fill="#fff" text-anchor="middle" font-family="${CRAIE}">2</text><path d="M146 104 H214" stroke="#fff" stroke-width="5" stroke-linecap="round"/><text id="den" x="180" y="168" font-size="66" font-weight="700" fill="#fff" text-anchor="middle" font-family="${CRAIE}">3</text></g>`));
      await at(19.5);
      voir(el(`<g class="el" fill="none" stroke="#6fe3d8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M280 176 Q248 176 218 160"/><path d="M226 170 L216 160 L230 156"/></g>`));
      scene.querySelector("#den").setAttribute("fill", "#6fe3d8");
      await at(26.5);
      voir(el(`<g class="el" fill="none" stroke="#ffe066" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M280 40 Q248 40 218 70"/><path d="M228 58 L216 71 L232 74"/></g>`));
      scene.querySelector("#num").setAttribute("fill", "#ffe066");

      /* 0:40–1:15 · 12 galettes en 3 tas de 4, puis 12 ÷ 3 = 4 */
      await at(40); await effacer(run);
      await at(40.8);
      for (let k = 0; k < 12; k++) voir(galette(k, assiette(k)));
      await at(41.8);
      for (let k = 0; k < 12; k++) scene.querySelector(`#gal${k}`).style.transform = `translate(${tas(k).x}px,${tas(k).y}px)`;
      await at(48.5);
      voir(texte("eq1", "12 ÷ 3 = 4", 180, 186, 30, "#ffe066"));
      await at(56.5);
      for (let i = 0; i < 3; i++) voir(texte(`q${i}`, "4", TAS_X[i], 56, 30, "#6fe3d8"));

      /* 1:15–1:45 · on prend 2 parts : 4 × 2 = 8 */
      await at(76);
      voir(ovale(72, 104)); voir(ovale(180, 104));
      await at(82.5);
      scene.querySelectorAll("[id^=q]").forEach((e) => e.remove());
      scene.querySelector("#eq1").remove();
      voir(texte("eq2", "4 × 2 = 8", 180, 186, 30, "#ffe066"));
      await at(89.5);
      for (let k = 0; k < 8; k++) scene.querySelector(`#gal${k}`).classList.add("pris");
      for (let k = 8; k < 12; k++) scene.querySelector(`#gal${k}`).style.opacity = ".3";

      /* 1:45–2:05 · la carte de la règle */
      await at(105); await effacer(run);
      await at(105.4);
      voir(el(`<rect class="el" x="50" y="34" width="260" height="136" rx="16" fill="#f6ebd3" stroke="#c58a52" stroke-width="5"/>`));
      await at(106);
      voir(texte("regle1", "bas : on partage", 180, 90, 28, "#2b1d4a"));
      await at(108.5);
      voir(texte("regle2", "haut : on prend", 180, 140, 28, "#2b1d4a"));
      await at(113.5); scene.querySelector("#regle1").setAttribute("fill", "#0e7f74");
      await at(116); scene.querySelector("#regle1").setAttribute("fill", "#2b1d4a"); scene.querySelector("#regle2").setAttribute("fill", "#b45309");

      /* 2:05–2:35 · l'erreur fréquente : 12 ÷ 2 = 6, barré */
      await at(125); await effacer(run);
      await at(126.5);
      voir(texte("faux", "12 ÷ 2 = 6", 180, 52, 34, "#fff"));
      await at(131.5);
      voir(el(`<path class="el" d="M104 30 L256 62 M256 30 L104 62" stroke="#ff6b6b" stroke-width="6" stroke-linecap="round"/>`));
      await at(132);
      for (let k = 0; k < 12; k++) voir(galette(k, tas(k, 122)));
      await at(135.5);
      voir(ovale(72, 122)); voir(ovale(180, 122));

      /* 2:35–2:50 · Pourquoi ? trois parts égales */
      await at(155); await effacer(run);
      await at(155.3);
      voir(texte("pq", "Pourquoi ?", 180, 52, 40, "#ffe066"));
      await at(159.5);
      for (let k = 0; k < 12; k++) voir(galette(k, tas(k, 118)));
      voir(texte("eg1", "=", 126, 128, 34, "#6fe3d8")); voir(texte("eg2", "=", 234, 128, 34, "#6fe3d8"));
      await at(163.5);
      for (const x of TAS_X) voir(el(`<rect class="el" x="${x - 34}" y="${118 - 34}" width="68" height="68" rx="12" fill="rgba(111,227,216,.14)" stroke="#6fe3d8" stroke-width="3"/>`));

      /* 2:50–3:10 · à toi ! 3/4 de 8, pause, puis la solution */
      await at(170); await effacer(run);
      await at(170.5);
      voir(texte("tq", "3/4 de 8 ?", 180, 84, 52, "#ffe066"));
      await at(179.5);
      voir(texte("s1", "8 ÷ 4 = 2", 180, 128, 38, "#fff"));
      await at(183.5);
      voir(texte("s2", "2 × 3 = 6", 180, 176, 38, "#6fe3d8"));
      await at(V.duree);
      h.fini = true;
      if (surFin) surFin();
    } catch (e) { if (e !== ANNULE) throw e; }
  }

  /**
   * Vidéo décrite en données : chaque segment peut avoir une liste `etapes` d'actions minutées.
   * Actions : effacer, ecrire, fraction, fleche, barre, disque, objets, ovale, croix, colorier, couleur, supprimer, carte.
   * Coordonnées dans le tableau de 360 × 203. Les éléments apparaissent en fondu (jamais plus de 3 idées à la fois).
   */
  async function deroulerDonnees(run) {
    const at = (t) => jusqua(t, run);
    const poser = (html, id) => { const e = el(html); if (id) e.id = id; voir(e); return e; };
    try {
      lireParties(run);
      const evts = V.segments.flatMap((s) => (s.etapes || []).map((e) => ({ ...e, abs: s.debut + e.t }))).sort((a, b) => a.abs - b.abs);
      for (const e of evts) {
        await at(e.abs);
        switch (e.a) {
          case "effacer": await effacer(run); break;
          case "ecrire": poser(`<text class="el" x="${e.x}" y="${e.y}" font-size="${e.taille || 34}" font-weight="700" fill="${e.couleur || "#fff"}" text-anchor="middle" font-family="${CRAIE}">${e.texte}</text>`, e.id); break;
          case "fraction": poser(`<g class="el"><text x="${e.x}" y="${e.y - 6}" font-size="${e.taille || 56}" font-weight="700" fill="${e.couleurHaut || "#fff"}" text-anchor="middle" font-family="${CRAIE}">${e.num}</text><path d="M${e.x - (e.taille || 56) * 0.5} ${e.y + 4} H${e.x + (e.taille || 56) * 0.5}" stroke="#fff" stroke-width="5" stroke-linecap="round"/><text x="${e.x}" y="${e.y + (e.taille || 56) * 0.95}" font-size="${e.taille || 56}" font-weight="700" fill="${e.couleurBas || "#fff"}" text-anchor="middle" font-family="${CRAIE}">${e.den}</text></g>`, e.id); break;
          case "fleche": {
            const [x1, y1] = e.de, [x2, y2] = e.vers, c = e.couleur || "#ffe066", dx = x2 - x1, dy = y2 - y1, n = Math.hypot(dx, dy) || 1, ux = dx / n, uy = dy / n;
            poser(`<g class="el" stroke="${c}" stroke-width="5" stroke-linecap="round" fill="none"><path d="M${x1} ${y1} L${x2} ${y2}"/><path d="M${x2 - ux * 12 + uy * 8} ${y2 - uy * 12 - ux * 8} L${x2} ${y2} L${x2 - ux * 12 - uy * 8} ${y2 - uy * 12 + ux * 8}"/></g>`, e.id); break;
          }
          case "barre": poser(`<g class="el">${barreSVG({ x: e.x, y: e.y, w: e.w || 220, h: e.h || 40, den: e.den, num: e.num || 0, choisies: e.choisies, coupes: e.coupes, ids: true, couleur: e.couleur || "#ffd166" })}</g>`, e.id); break;
          case "disque": poser(`<g class="el">${disqueSVG({ cx: e.cx, cy: e.cy, r: e.r || 50, den: e.den, num: e.num || 0, choisies: e.choisies, coupes: e.coupes, ids: true, couleur: e.couleur || "#ffd166" })}</g>`, e.id); break;
          case "objets": poser(`<g class="el">${objetsSVG({ genre: e.genre, n: e.n, x: e.x, y: e.y, colonnes: e.colonnes || e.n, pas: e.pas || 26, taille: e.taille || 22 })}</g>`, e.id); break;
          case "pose": { // multiplication posée (état donné : résultat déjà écrit, retenues, colonne active)
            const svg = poseSVG({ a: e.n1, b: e.n2, resultat: e.resultat || [], retenues: e.retenues || {}, actif: e.actif ?? -1 }).replace("<svg ", '<svg width="300" height="190" ');
            poser(`<g class="el" transform="translate(${e.x ?? 60} ${e.y ?? 6}) scale(${e.echelle || 0.98})">${svg}</g>`, e.id); break;
          }
          case "division": {
            const svg = divisionSVG({ a: e.n1, d: e.n2, quotient: e.quotient || "", lignes: e.lignes || [] });
            const h = svg.match(/viewBox="0 0 300 (\d+)"/)[1];
            poser(`<g class="el" transform="translate(${e.x ?? 60} ${e.y ?? 6}) scale(${e.echelle || 0.98})">${svg.replace("<svg ", `<svg width="300" height="${h}" `)}</g>`, e.id); break;
          }
          case "ovale": poser(`<ellipse class="el" cx="${e.cx}" cy="${e.cy}" rx="${e.rx || 36}" ry="${e.ry || 34}" fill="rgba(255,224,102,.14)" stroke="${e.couleur || "#ffe066"}" stroke-width="3"/>`, e.id); break;
          case "croix": poser(`<path class="el" d="M${e.x1} ${e.y1} L${e.x2} ${e.y2} M${e.x2} ${e.y1} L${e.x1} ${e.y2}" stroke="#ff6b6b" stroke-width="6" stroke-linecap="round"/>`, e.id); break;
          case "colorier": { const g = scene.querySelector(`#${e.id}`); if (g) for (const k of e.parts) { const p = g.querySelector(`[data-part="${k}"]`); if (p) p.setAttribute("fill", e.couleur || "#ffd166"); } break; }
          case "couleur": { const x = scene.querySelector(`#${e.id}`); if (x) x.setAttribute("fill", e.fill); break; }
          case "supprimer": { const x = scene.querySelector(`#${e.id}`); if (x) x.remove(); break; }
          case "carte": {
            poser(`<rect class="el" x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" rx="16" fill="#f6ebd3" stroke="#c58a52" stroke-width="5"/>`, e.id);
            (e.lignes || []).forEach((l, k) => { (async () => { await at(e.abs + (l.t || 0)); poser(`<text class="el" x="${e.x + e.w / 2}" y="${e.y + 46 + k * 48}" font-size="26" font-weight="700" fill="${l.couleur || "#2b1d4a"}" text-anchor="middle" font-family="${CRAIE}">${l.texte}</text>`); })().catch((x) => { if (x !== ANNULE) throw x; }); });
            break;
          }
          default: throw new Error(`action de vidéo inconnue : ${e.a}`);
        }
      }
      await at(V.duree);
      h.fini = true;
      if (surFin) surFin();
    } catch (x) { if (x !== ANNULE) throw x; }
  }

  function demarrer() {
    h.run++; h.t = 0; h.attentes = []; h.fini = false; h.pause = false;
    scene.innerHTML = ""; st.innerHTML = "&nbsp;"; prog.style.width = "0%"; bPlay.textContent = "⏸"; bPlay.setAttribute("aria-label", "Pause");
    arreter();
    if (V.segments.some((s) => s.etapes)) deroulerDonnees(h.run); else derouler(h.run);
  }

  bPlay.addEventListener("click", () => {
    if (h.fini) return demarrer();
    h.pause = !h.pause;
    pauseVoix(h.pause);
    bPlay.textContent = h.pause ? "▶" : "⏸";
    bPlay.setAttribute("aria-label", h.pause ? "Lecture" : "Pause");
  });
  $("#v-rejouer").addEventListener("click", demarrer);

  return {
    demarrer,
    /** Saute à la fin (pour passer la vidéo) sans lancer d'erreur. */
    detruire() { h.detruit = true; clearInterval(timer); arreter(); }
  };
}
