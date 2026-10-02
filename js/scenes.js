// Scènes décrites en données (JSON) : décor + personnages + objets. Sert aux illustrations de mission et aux cases de BD.
// Exemple : { "fond": "cour", "personnages": [{ "qui": "Anita", "x": 10, "y": 120, "w": 60 }], "objets": [{ "t": "disque", "cx": 200, "cy": 120, "r": 50, "den": 4, "num": 3 }] }
import { matheo, mamie, anita, kola, maitreLeo, fragmentBoussole, nuageParesse, sceneMarche } from "./art.js";
import { barreSVG, disqueSVG, objetsSVG, galetteSVG } from "./visuels.js";
import { caseBD } from "./bd.js";

const L = 360, H = 230;

/** Place un personnage (chaîne SVG) à la position et à la largeur voulues. */
export function placer(svg, x, y, w) {
  const m = svg.match(/viewBox="-?\d+ -?\d+ (\d+) (\d+)"/);
  const h = (w * m[2]) / m[1];
  return svg.replace(/<svg /, `<svg x="${x}" y="${y}" width="${w}" height="${h.toFixed(1)}" `);
}

const PERSOS = {
  "Mathéo": (o) => matheo({ humeur: o.humeur || "content" }),
  "Mamie Sègla": () => mamie(),
  "Anita": () => anita(),
  "Kola": () => kola(),
  "Maître Léo": () => maitreLeo()
};

const ciel = (hSoleil = 150) => `<rect width="${L}" height="${H}" fill="url(#g-ciel)"/><circle cx="296" cy="${hSoleil - 30}" r="26" fill="#ffd9a0" opacity=".85"/>`;
const sol = (y = 140, couleur = "#8a5a2b") => `<rect y="${y}" width="${L}" height="${H - y}" fill="${couleur}"/><rect y="${y}" width="${L}" height="5" fill="#a9733a" opacity=".8"/>`;

const FONDS = {
  marche: () => `${ciel(150)}${sol(142)}<path d="M18 58 H252 L236 96 H34Z" fill="#c1440e"/><g fill="#f6e7c1"><path d="M34 96 L52 58 H70 L56 96Z"/><path d="M92 96 L106 58 H124 L116 96Z"/><path d="M150 96 L160 58 H178 L176 96Z"/><path d="M206 96 L214 58 H232 L236 96Z"/></g><rect x="30" y="94" width="5" height="48" fill="#6e3f1f"/><rect x="236" y="94" width="5" height="48" fill="#6e3f1f"/><rect x="22" y="128" width="226" height="16" rx="3" fill="url(#g-bois)"/>`,
  cour: () => `${ciel(120)}${sol(150, "#b98a4b")}<rect x="40" y="70" width="14" height="86" fill="#6e3f1f"/><circle cx="47" cy="62" r="40" fill="#3f7d3a"/><circle cx="26" cy="78" r="26" fill="#4f8a2b"/><circle cx="70" cy="76" r="26" fill="#4f8a2b"/><rect x="240" y="96" width="110" height="60" fill="#f0d49a"/><path d="M232 98 L295 62 L358 98Z" fill="#a8432a"/>`,
  ecole: () => `${ciel(120)}<rect x="0" y="70" width="${L}" height="70" fill="#f0d49a"/><path d="M-10 72 L${L / 2} 20 L${L + 10} 72Z" fill="#a8432a"/><rect x="150" y="84" width="60" height="56" rx="3" fill="#6e3f1f"/><rect x="40" y="88" width="46" height="30" rx="3" fill="#8ecae6" stroke="#6e3f1f" stroke-width="3"/><rect x="274" y="88" width="46" height="30" rx="3" fill="#8ecae6" stroke="#6e3f1f" stroke-width="3"/>${sol(140)}`,
  champ: () => `<rect width="${L}" height="${H}" fill="url(#g-ciel)"/>${sol(120, "#6b8e23")}<g stroke="#4f6b17" stroke-width="3" opacity=".6"><path d="M0 150 H360 M0 176 H360 M0 202 H360"/></g><g fill="#3f7d3a"><circle cx="60" cy="130" r="9"/><circle cx="130" cy="136" r="9"/><circle cx="210" cy="130" r="9"/><circle cx="290" cy="138" r="9"/></g>`,
  sable: () => `${ciel(110)}${sol(112)}<ellipse cx="190" cy="196" rx="230" ry="46" fill="#e6c58a"/><ellipse cx="190" cy="190" rx="200" ry="34" fill="#efd39b" opacity=".7"/>`,
  classe: () => `<rect width="${L}" height="${H}" fill="#e8d3a8"/><rect y="170" width="${L}" height="60" fill="#b98a4b"/><rect x="40" y="26" width="280" height="110" rx="8" fill="#2e4a3a" stroke="#6e3f1f" stroke-width="7"/><rect x="40" y="136" width="280" height="8" fill="#6e3f1f"/>`,
  mur: () => `<rect width="${L}" height="${H}" fill="#d9b98a"/><g stroke="#b8935f" stroke-width="2" opacity=".6"><path d="M0 46 H360 M0 92 H360 M0 138 H360 M0 184 H360"/></g>`,
  nuit: () => `<rect width="${L}" height="${H}" fill="#1b1446"/><rect width="${L}" height="${H}" fill="url(#g-halo)" opacity=".25"/>${[[30, 28], [96, 60], [320, 40], [290, 150], [50, 170], [200, 20], [120, 200], [340, 205]].map(([x, y]) => `<use href="#etoile" x="${x}" y="${y}" width="10" height="10" color="#fff" opacity=".8"/>`).join("")}`
};

/** Un objet de la scène (voir les types ci-dessous). */
function objet(o) {
  switch (o.t) {
    case "objets": return objetsSVG({ genre: o.genre, n: o.n, x: o.x, y: o.y, colonnes: o.colonnes || o.n, pas: o.pas || 24, taille: o.taille || 22 });
    case "barre": return barreSVG({ x: o.x, y: o.y, w: o.w || 200, h: o.h || 34, den: o.den, num: o.num || 0, choisies: o.choisies, coupes: o.coupes, couleur: o.couleur || undefined });
    case "disque": return disqueSVG({ cx: o.cx, cy: o.cy, r: o.r || 50, den: o.den, num: o.num || 0, choisies: o.choisies, coupes: o.coupes });
    case "galette": return galetteSVG({ cx: o.cx, cy: o.cy, r: o.r || 30 });
    case "ovale": return `<ellipse cx="${o.cx}" cy="${o.cy}" rx="${o.rx || 30}" ry="${o.ry || 28}" fill="${o.rempli ? "rgba(255,209,102,.25)" : "none"}" stroke="${o.couleur || "#ffd166"}" stroke-width="3" ${o.pointille ? 'stroke-dasharray="6 5"' : ""}/>`;
    case "texte": return `<text x="${o.x}" y="${o.y}" font-size="${o.taille || 30}" font-weight="700" fill="${o.couleur || "#fff"}" ${o.craie === false ? "" : 'stroke="#2b1d4a" stroke-width="3" paint-order="stroke"'} text-anchor="${o.ancre || "middle"}" font-family="'Segoe Print','Comic Sans MS',system-ui,sans-serif">${o.texte}</text>`;
    case "tableau": return `<rect x="${o.x}" y="${o.y}" width="${o.w || 120}" height="${o.h || 100}" rx="8" fill="#2e4a3a" stroke="#6e3f1f" stroke-width="6"/>`;
    case "fragment": return placer(fragmentBoussole(), o.x, o.y, o.w || 30);
    case "nuage": return placer(nuageParesse({ humeur: o.humeur }), o.x, o.y, o.w || 60);
    case "ligne": return `<path d="M${o.x1} ${o.y1} L${o.x2} ${o.y2}" stroke="${o.couleur || "#2b1d4a"}" stroke-width="${o.epaisseur || 6}" stroke-linecap="round"/>`;
    case "fleche": {
      const [x1, y1] = o.de, [x2, y2] = o.vers, dx = x2 - x1, dy = y2 - y1, n = Math.hypot(dx, dy) || 1, ux = dx / n, uy = dy / n;
      return `<g stroke="${o.couleur || "#ffe066"}" stroke-width="5" stroke-linecap="round" fill="none"><path d="M${x1} ${y1} L${x2} ${y2}"/><path d="M${x2 - ux * 12 + uy * 8} ${y2 - uy * 12 - ux * 8} L${x2} ${y2} L${x2 - ux * 12 - uy * 8} ${y2 - uy * 12 + ux * 8}"/></g>`;
    }
    default: return "";
  }
}

/** Rend une scène complète en SVG (360 × 230). */
export function rendreScene(d, { aria = "Illustration" } = {}) {
  if (d.special === "marche") return sceneMarche({ mangues: d.mangues || 24 });
  if (d.special === "n22-bd") return caseBD(d.n);
  const fond = (FONDS[d.fond] || FONDS.cour)();
  const objets = (d.objets || []).map(objet).join("");
  const persos = (d.personnages || []).map((p) => (PERSOS[p.qui] ? placer(PERSOS[p.qui](p), p.x, p.y, p.w || 56) : "")).join("");
  return `<svg viewBox="0 0 ${L} ${H}" class="scene case-bd" role="img" aria-label="${aria}">${fond}${d.devant ? "" : objets}${persos}${d.devant ? objets : ""}</svg>`;
}
