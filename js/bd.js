// BD « L'aventure des sacs » : 8 cases dessinées en SVG. Les objets mathématiques sont exacts
// (20 sacs, 5 tas de 4, 12 et 8). Les textes ne sont PAS dans l'image : ils sont dans le contenu (n22.json).
import { matheo, mamie, anita, kola, maitreLeo, fragmentBoussole } from "./art.js";

const L = 360, H = 230;

/** Place un personnage (chaîne SVG) à la position et à la largeur voulues. */
function placer(svg, x, y, w) {
  const m = svg.match(/viewBox="-?\d+ -?\d+ (\d+) (\d+)"/);
  const h = (w * m[2]) / m[1];
  return svg.replace(/<svg /, `<svg x="${x}" y="${y}" width="${w}" height="${h.toFixed(1)}" `);
}

/** Dessine n sacs en grille (colonnes), partant du coin haut-gauche (x, y). */
function sacs(n, x, y, { colonnes = 2, pas = 20, taille = 24, c = "#dcb67f", c2 = "#c79a5f", classe = "" } = {}) {
  let s = "";
  for (let i = 0; i < n; i++) {
    s += `<use href="#sac" x="${x + (i % colonnes) * pas}" y="${y + Math.floor(i / colonnes) * (pas - 1)}" width="${taille}" height="${taille + 2}" class="${classe}" style="--c:${c};--c2:${c2}"/>`;
  }
  return s;
}

const ciel = (haut = 150) => `<rect width="${L}" height="${H}" fill="url(#g-ciel)"/><circle cx="296" cy="${haut - 30}" r="26" fill="#ffd9a0" opacity=".85"/>`;
const sol = (y = 140) => `<rect y="${y}" width="${L}" height="${H - y}" fill="#8a5a2b"/><rect y="${y}" width="${L}" height="5" fill="#a9733a"/><rect y="${y + 5}" width="${L}" height="${H - y}" fill="#946332" opacity=".5"/>`;
const sable = `<ellipse cx="190" cy="196" rx="230" ry="46" fill="#e6c58a"/><ellipse cx="190" cy="190" rx="200" ry="34" fill="#efd39b" opacity=".7"/>`;
const craie = (txt, x, y, taille, extra = "") => `<text x="${x}" y="${y}" font-size="${taille}" font-weight="700" fill="#fff" stroke="#2b1d4a" stroke-width="3" paint-order="stroke" font-family="'Segoe Print','Comic Sans MS',system-ui,sans-serif" ${extra}>${txt}</text>`;
const dansLeSable = (txt, x, y, taille) => `<text x="${x}" y="${y}" font-size="${taille}" font-style="italic" font-weight="600" fill="#8f6a2f" font-family="'Segoe Print','Comic Sans MS',system-ui,sans-serif">${txt}</text>`;

function charrette(x, y) {
  return `<g><path d="M${x - 26} ${y + 6} L${x} ${y + 2}" stroke="#5c3a1b" stroke-width="5" stroke-linecap="round"/>
    <rect x="${x}" y="${y}" width="200" height="18" rx="3" fill="url(#g-bois)"/><rect x="${x}" y="${y}" width="200" height="4" fill="#c58a52"/>
    <g fill="#6e3f1f" stroke="#3b2210" stroke-width="2"><circle cx="${x + 30}" cy="${y + 26}" r="17"/><circle cx="${x + 170}" cy="${y + 26}" r="17"/></g>
    <g fill="#c58a52"><circle cx="${x + 30}" cy="${y + 26}" r="5"/><circle cx="${x + 170}" cy="${y + 26}" r="5"/></g></g>`;
}

const ecole = `<rect x="0" y="70" width="${L}" height="70" fill="#f0d49a"/><path d="M-10 72 L${L / 2} 20 L${L + 10} 72Z" fill="#a8432a"/>
  <rect x="150" y="84" width="60" height="56" rx="3" fill="#6e3f1f"/><rect x="40" y="88" width="46" height="30" rx="3" fill="#8ecae6" stroke="#6e3f1f" stroke-width="3"/><rect x="274" y="88" width="46" height="30" rx="3" fill="#8ecae6" stroke="#6e3f1f" stroke-width="3"/>
  <g stroke="#6e3f1f" stroke-width="2"><path d="M63 88 V118 M40 103 H86 M297 88 V118 M274 103 H320"/></g>`;

const cases = {
  1: () => `${ciel(150)}${sol(142)}
    <g>${charrette(104, 134)}${sacs(10, 108, 106, { colonnes: 10, pas: 19.2, taille: 22 })}${sacs(10, 108, 87, { colonnes: 10, pas: 19.2, taille: 22 })}</g>
    <rect x="308" y="52" width="46" height="36" rx="6" fill="#f6ebd3" stroke="#6e3f1f" stroke-width="3"/><path d="M331 88 V142" stroke="#6e3f1f" stroke-width="4"/>${craie("20", 316, 80, 26).replace('fill="#fff" stroke="#2b1d4a"', 'fill="#c1440e" stroke="#f6ebd3"')}
    ${placer(mamie(), 6, 128, 62)}${placer(anita(), 74, 140, 52)}${placer(kola(), 296, 142, 52)}
    <g>${placer(matheo({ humeur: "content" }), 236, 156, 44)}${placer(fragmentBoussole(), 218, 176, 28)}</g>`,

  2: () => `${ciel(120)}${sol(120)}${sable}
    ${placer(kola(), 24, 56, 120)}
    ${dansLeSable("20 ÷ 3 = 6 reste 2", 150, 205, 18)}
    <text x="298" y="96" font-size="34" font-weight="700" fill="#6fe3d8" stroke="#2b1d4a" stroke-width="3" paint-order="stroke">?</text>${placer(matheo({ humeur: "surpris" }), 262, 100, 78)}`,

  3: () => `<rect width="${L}" height="${H}" fill="#d9b98a"/><g stroke="#b8935f" stroke-width="2" opacity=".6"><path d="M0 46 H360 M0 92 H360 M0 138 H360 M0 184 H360"/></g>
    <rect x="224" y="52" width="122" height="104" rx="8" fill="#2e4a3a" stroke="#6e3f1f" stroke-width="6"/>${craie("3/5", 238, 124, 56)}
    ${placer(kola(), 146, 96, 88)}${placer(anita(), 8, 26, 156)}`,

  4: () => `${ciel(110)}${sol(112)}${sable}
    ${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="${40 + i * 70}" cy="150" rx="31" ry="28" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="6 5" opacity=".9"/>${sacs(4, 40 + i * 70 - 21, 130, { colonnes: 2, pas: 20, taille: 22 })}`).join("")}
    ${placer(anita(), 0, 150, 56)}${placer(kola(), 304, 150, 56)}`,

  5: () => `${ciel(110)}${sol(112)}${sable}
    ${[0, 1, 2, 3, 4].map((i) => {
      const pris = i < 3;
      return `<ellipse cx="${40 + i * 70}" cy="150" rx="31" ry="28" fill="${pris ? "rgba(255,209,102,.3)" : "none"}" stroke="${pris ? "#ffd166" : "#fff"}" stroke-width="${pris ? 3 : 2.5}" ${pris ? "" : 'stroke-dasharray="6 5"'} opacity=".95"/>${sacs(4, 40 + i * 70 - 21, 130, { colonnes: 2, pas: 20, taille: 22, c: pris ? "#ffb347" : "#dcb67f", c2: pris ? "#e08a1e" : "#c79a5f" })}`;
    }).join("")}
    ${placer(anita(), 0, 150, 56)}${placer(matheo({ humeur: "joie" }), 304, 152, 50)}`,

  6: () => `${ciel(110)}${sol(112)}${sable}
    ${[0, 1, 2].map((i) => `<ellipse cx="${46 + i * 58}" cy="160" rx="26" ry="26" fill="rgba(255,209,102,.3)" stroke="#ffd166" stroke-width="3"/>${sacs(4, 46 + i * 58 - 19, 142, { colonnes: 2, pas: 18, taille: 20, c: "#ffb347", c2: "#e08a1e" })}`).join("")}
    ${[0, 1].map((i) => `<ellipse cx="${248 + i * 58}" cy="160" rx="26" ry="26" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="6 5"/>${sacs(4, 248 + i * 58 - 19, 142, { colonnes: 2, pas: 18, taille: 20 })}`).join("")}
    <g font-weight="700" font-family="system-ui,sans-serif" text-anchor="middle"><circle cx="104" cy="100" r="22" fill="#ffd166"/><text x="104" y="109" font-size="26" fill="#3a2200">12</text>
    <circle cx="277" cy="100" r="22" fill="#f6ebd3"/><text x="277" y="109" font-size="26" fill="#2b1d4a">8</text></g>
    ${placer(anita(), 8, 168, 46)}${placer(matheo({ humeur: "content" }), 158, 172, 46)}`,

  7: () => `${ciel(120)}${ecole}${sol(140)}
    ${sacs(12, 64, 128, { colonnes: 4, pas: 21, taille: 24 })}
    ${placer(maitreLeo(), 154, 60, 66)}
    <g>${charrette(236, 152).replace("width=\"200\"", "width=\"130\"")}</g>
    ${placer(matheo({ humeur: "joie" }), 270, 142, 50)}<g class="eclat">${placer(fragmentBoussole(), 246, 150, 40)}</g>`,

  8: () => `<rect width="${L}" height="${H}" fill="#1b1446"/><rect width="${L}" height="${H}" fill="url(#g-halo)" opacity=".25"/>
    ${[[30, 28], [96, 60], [320, 40], [290, 150], [50, 170], [200, 20], [120, 200], [340, 205]].map(([x, y]) => `<use href="#etoile" x="${x}" y="${y}" width="10" height="10" color="#fff" opacity=".8"/>`).join("")}
    ${placer(matheo({ humeur: "content" }), 100, 8, 160)}`
};

/** SVG complet d'une case de BD (1 à 8). */
export function caseBD(n) {
  return `<svg viewBox="0 0 ${L} ${H}" class="case-bd" role="img" aria-label="Case ${n} de la BD">${cases[n]()}</svg>`;
}
