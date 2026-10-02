// Visuels mathématiques en SVG : barres, disques, objets. Fonctions pures (elles renvoient du texte SVG),
// réutilisées par les scènes, la vidéo, les quiz et les manipulations. Les comptes sont exacts.

export const COUL = { part: "#ffd166", fond: "rgba(255,255,255,.14)", bord: "#f6ebd3", alt: "#6fe3d8", rouge: "#ff8f6b" };

/** Bornes (en fraction de la largeur) d'une barre découpée en `den` parts égales, ou selon `coupes` (parts inégales). */
function bornes(den, coupes) {
  if (coupes) return [0, ...coupes, 1];
  return Array.from({ length: den + 1 }, (_, i) => i / den);
}

/**
 * Barre découpée en parts. `num` parts coloriées à partir de la gauche, ou les indices de `choisies`.
 * `coupes` : positions des traits (0 à 1) pour dessiner des parts INÉGALES.
 */
export function barreSVG({ x = 0, y = 0, w = 200, h = 36, den = 4, num = 0, choisies = null, coupes = null, couleur = COUL.part, fond = COUL.fond, bord = COUL.bord, classe = "", ids = false } = {}) {
  const b = bornes(den, coupes);
  const parts = b.length - 1;
  let s = `<g class="${classe}">`;
  for (let i = 0; i < parts; i++) {
    const colo = choisies ? choisies.includes(i) : i < num;
    s += `<rect ${ids ? `data-part="${i}"` : ""} class="part" x="${(x + b[i] * w).toFixed(2)}" y="${y}" width="${((b[i + 1] - b[i]) * w).toFixed(2)}" height="${h}" fill="${colo ? couleur : fond}" stroke="${bord}" stroke-width="2.4"/>`;
  }
  return s + "</g>";
}

/** Disque (galette) découpé en parts égales ; `num` parts coloriées depuis le haut, dans le sens des aiguilles d'une montre. */
export function disqueSVG({ cx = 100, cy = 100, r = 60, den = 4, num = 0, choisies = null, coupes = null, couleur = COUL.part, fond = COUL.fond, bord = COUL.bord, ids = false, classe = "" } = {}) {
  let s = `<g class="${classe}">`;
  const b = bornes(den, coupes);
  if (b.length - 1 === 1) {
    return s + `<circle ${ids ? 'data-part="0"' : ""} class="part" cx="${cx}" cy="${cy}" r="${r}" fill="${(choisies ? choisies.includes(0) : num >= 1) ? couleur : fond}" stroke="${bord}" stroke-width="2.4"/></g>`;
  }
  for (let i = 0; i < b.length - 1; i++) {
    const a0 = -Math.PI / 2 + b[i] * 2 * Math.PI, a1 = -Math.PI / 2 + b[i + 1] * 2 * Math.PI;
    const p = (a) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
    const colo = choisies ? choisies.includes(i) : i < num;
    s += `<path ${ids ? `data-part="${i}"` : ""} class="part" d="M${cx} ${cy} L${p(a0)} A${r} ${r} 0 ${b[i + 1] - b[i] > 0.5 ? 1 : 0} 1 ${p(a1)} Z" fill="${colo ? couleur : fond}" stroke="${bord}" stroke-width="2.4" stroke-linejoin="round"/>`;
  }
  return s + "</g>";
}

/** Une galette entière dorée (pour illustrer le « tout »). */
export function galetteSVG({ cx = 0, cy = 0, r = 14 } = {}) {
  return `<g><circle cx="${cx}" cy="${cy}" r="${r}" fill="#e0a24a" stroke="#8a5a1e" stroke-width="1.6"/><circle cx="${cx - r * 0.3}" cy="${cy - r * 0.3}" r="${r * 0.16}" fill="#f6d28a"/><circle cx="${cx + r * 0.3}" cy="${cy + r * 0.2}" r="${r * 0.13}" fill="#f6d28a"/><circle cx="${cx - r * 0.2}" cy="${cy + r * 0.4}" r="${r * 0.11}" fill="#f6d28a"/></g>`;
}

const ICONES = {
  mangue: (x, y, t) => `<use href="#mangue" x="${x}" y="${y}" width="${t}" height="${t}"/>`,
  sac: (x, y, t) => `<use href="#sac" x="${x}" y="${y}" width="${t}" height="${t + 2}"/>`,
  galette: (x, y, t) => galetteSVG({ cx: x + t / 2, cy: y + t / 2, r: t / 2 - 1 }),
  bille: (x, y, t) => `<circle cx="${x + t / 2}" cy="${y + t / 2}" r="${t / 2 - 2}" fill="#4cc9f0" stroke="#1d6f94" stroke-width="1.5"/><circle cx="${x + t * 0.38}" cy="${y + t * 0.36}" r="${t * 0.1}" fill="#fff" opacity=".7"/>`,
  cahier: (x, y, t) => `<rect x="${x + 2}" y="${y}" width="${t - 4}" height="${t}" rx="2" fill="#f6ebd3" stroke="#7a4a1f" stroke-width="1.5"/><path d="M${x + t * 0.3} ${y} V${y + t}" stroke="#c1440e" stroke-width="2"/><path d="M${x + t * 0.45} ${y + t * 0.3} H${x + t - 6} M${x + t * 0.45} ${y + t * 0.55} H${x + t - 6}" stroke="#7a4a1f" stroke-width="1.2"/>`,
  eleve: (x, y, t) => `<circle cx="${x + t / 2}" cy="${y + t * 0.26}" r="${t * 0.2}" fill="#8a5a3a"/><path d="M${x + t * 0.15} ${y + t} Q${x + t / 2} ${y + t * 0.42} ${x + t * 0.85} ${y + t} Z" fill="#2f6fd6"/>`,
  crayon: (x, y, t) => `<rect x="${x + t * 0.38}" y="${y}" width="${t * 0.24}" height="${t * 0.78}" fill="#ffd23f" stroke="#7a5a00" stroke-width="1.2"/><path d="M${x + t * 0.38} ${y + t * 0.78} L${x + t / 2} ${y + t} L${x + t * 0.62} ${y + t * 0.78}Z" fill="#e8c9a0" stroke="#7a5a00" stroke-width="1.2"/>`
};

/** `n` objets du même genre rangés en grille (colonnes), tous distincts et comptables. */
export function objetsSVG({ genre = "mangue", n = 12, x = 0, y = 0, colonnes = 6, pas = 28, taille = 26, classe = "" } = {}) {
  const icone = ICONES[genre] || ICONES.mangue;
  let s = `<g class="${classe}">`;
  for (let i = 0; i < n; i++) s += icone(x + (i % colonnes) * pas, y + Math.floor(i / colonnes) * pas, taille);
  return s + "</g>";
}

export const GENRES = Object.keys(ICONES);

/** Contenu SVG d'un visuel simple (barre, disque, objets) dans une zone largeur × hauteur. */
function contenuVisuel(v, largeur, hauteur) {
  if (v.t === "barre") return barreSVG({ x: 4, y: hauteur / 2 - Math.min(18, hauteur * 0.4), w: largeur - 8, h: Math.min(36, hauteur * 0.8), den: v.den, num: v.num || 0, choisies: v.choisies, coupes: v.coupes });
  if (v.t === "disque") return disqueSVG({ cx: largeur / 2, cy: hauteur / 2, r: Math.min(largeur, hauteur) / 2 - 4, den: v.den, num: v.num || 0, choisies: v.choisies, coupes: v.coupes });
  if (v.t === "objets") {
    const colonnes = v.colonnes || Math.ceil(Math.sqrt(v.n));
    const pas = Math.min(26, (largeur - 6) / colonnes);
    return objetsSVG({ genre: v.genre || "mangue", n: v.n, x: 3, y: 3, colonnes, pas, taille: pas - 2 });
  }
  return "";
}

const MONO = "Consolas,Menlo,'DejaVu Sans Mono',monospace";

/** Multiplication posée : `resultat` = chiffres déjà écrits (de droite à gauche), `retenues` = { colonne: chiffre }. */
export function poseSVG({ a, b, resultat = [], retenues = {}, actif = -1 } = {}) {
  const L = 300, H = 190, cw = 34, droite = L - 56;
  const sa = String(a).split("").reverse(), sb = String(b).split("").reverse();
  const cols = Math.max(sa.length + 1, resultat.length, sb.length);
  const x = (c) => droite - c * cw;
  const stylo = (taille, couleur) => `font-family="${MONO}" font-size="${taille}" font-weight="700" fill="${couleur}" text-anchor="middle"`;
  let s = "";
  if (actif >= 0) s += `<rect x="${x(actif) - cw / 2}" y="34" width="${cw}" height="144" rx="8" fill="rgba(255,224,102,.16)"/>`;
  Object.entries(retenues).forEach(([c, v]) => { s += `<text x="${x(+c) + 2}" y="30" ${stylo(20, "#ffd166")}>${v}</text>`; });
  sa.forEach((d, c) => { s += `<text x="${x(c)}" y="76" ${stylo(38, "#fff")}>${d}</text>`; });
  sb.forEach((d, c) => { s += `<text x="${x(c)}" y="118" ${stylo(38, "#fff")}>${d}</text>`; });
  s += `<text x="${x(Math.max(sa.length, 2)) - 4}" y="118" ${stylo(34, "#ff8f6b")}>×</text>`;
  s += `<path d="M${x(cols) + cw / 2} 130 H${x(0) + cw / 2}" stroke="#f6ebd3" stroke-width="3" stroke-linecap="round"/>`;
  resultat.forEach((d, c) => { s += `<text x="${x(c)}" y="168" ${stylo(38, "#6fe3d8")}>${d}</text>`; });
  return `<svg viewBox="0 0 ${L} ${H}" class="visuel pose" role="img" aria-label="Multiplication posée : ${a} fois ${b}">${s}</svg>`;
}

/** Division posée : le quotient s'écrit sous le diviseur ; les lignes de calcul sous le dividende. */
export function divisionSVG({ a, d, quotient = "", lignes = [] } = {}) {
  const sa = String(a).split(""), cw = 28, x0 = 24;
  const barre = x0 + sa.length * cw + 6;
  const H = 110 + lignes.length * 26;
  const stylo = (taille, couleur, ancre = "start") => `font-family="${MONO}" font-size="${taille}" font-weight="700" fill="${couleur}" text-anchor="${ancre}"`;
  let s = sa.map((c, i) => `<text x="${x0 + i * cw}" y="52" ${stylo(36, "#fff")}>${c}</text>`).join("");
  s += `<path d="M${barre} 20 V${H - 14} M${barre} 62 H${barre + 90}" stroke="#f6ebd3" stroke-width="3" stroke-linecap="round" fill="none"/>`;
  s += `<text x="${barre + 18}" y="52" ${stylo(36, "#ffd166")}>${d}</text>`;
  if (quotient !== "") s += `<text x="${barre + 18}" y="98" ${stylo(36, "#6fe3d8")}>${quotient}</text>`;
  lignes.forEach((l, k) => { s += `<text x="${x0}" y="${86 + k * 26}" ${stylo(22, k % 2 === 0 ? "#ff8f6b" : "#fff")}>${k % 2 === 0 ? "− " : ""}${l}</text>`; });
  return `<svg viewBox="0 0 300 ${H}" class="visuel pose" role="img" aria-label="Division posée : ${a} divisé par ${d}">${s}</svg>`;
}

/**
 * Petit visuel autonome (pour un énoncé ou un choix de quiz) : barre, disque, objets,
 * ou une « paire » de deux visuels à comparer ({ t: "paire", a, b, sens: "h" | "v", etiquettes: ["1/2", "1/4"] }).
 */
export function visuelSVG(v, { largeur = 120, hauteur = 70 } = {}) {
  if (v.t === "pose") return poseSVG(v);
  if (v.t === "division") return divisionSVG(v);
  if (v.t === "paire") {
    const vertical = (v.sens || (v.a.t === "barre" ? "v" : "h")) === "v";
    const et = v.etiquettes || [];
    const police = Math.max(11, Math.min(18, hauteur * 0.2));
    const style = `font-size="${police}" font-weight="700" fill="#fff" text-anchor="middle" font-family="system-ui,sans-serif"`;
    if (vertical) {
      const sub = hauteur * 0.5, total = hauteur * 1.05;
      const bloc = (s, k, y) => `<g transform="translate(0 ${y})">${contenuVisuel(s, largeur - 34, sub)}${et[k] ? `<text x="${largeur - 17}" y="${sub / 2 + police / 3}" ${style}>${et[k]}</text>` : ""}</g>`;
      return `<svg viewBox="0 0 ${largeur} ${total}" class="visuel" role="img" aria-label="${v.alt || "deux schémas à comparer"}">${bloc(v.a, 0, 0)}${bloc(v.b, 1, sub + 4)}</svg>`;
    }
    const demi = largeur / 2, zone = hauteur - police - 4;
    const bloc = (s, k, x) => `<g transform="translate(${x} 0)">${contenuVisuel(s, demi - 8, zone)}${et[k] ? `<text x="${demi / 2 - 4}" y="${hauteur - 3}" ${style}>${et[k]}</text>` : ""}</g>`;
    return `<svg viewBox="0 0 ${largeur} ${hauteur}" class="visuel" role="img" aria-label="${v.alt || "deux schémas à comparer"}">${bloc(v.a, 0, 0)}${bloc(v.b, 1, demi)}</svg>`;
  }
  return `<svg viewBox="0 0 ${largeur} ${hauteur}" class="visuel" role="img" aria-label="${v.alt || "schéma"}">${contenuVisuel(v, largeur, hauteur)}</svg>`;
}