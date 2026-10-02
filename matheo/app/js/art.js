// Illustrations SVG de Mathéo, dessinées par code : légères (quelques Ko), nettes à toute taille,
// avec le nombre exact d'objets demandé par le scénario. Apparence des personnages : [À VALIDER] (bible visuelle v0.1).

export const DEFS = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
  <radialGradient id="g-mangue" cx="35%" cy="30%" r="85%"><stop offset="0" stop-color="#ffd166"/><stop offset=".55" stop-color="#f77f00"/><stop offset="1" stop-color="#c8321c"/></radialGradient>
  <radialGradient id="g-matheo" cx="40%" cy="33%" r="78%"><stop offset="0" stop-color="#fffdd9"/><stop offset=".55" stop-color="#ffe066"/><stop offset="1" stop-color="#ffbf2e"/></radialGradient>
  <radialGradient id="g-halo"><stop offset="0" stop-color="#6fe3d8" stop-opacity=".9"/><stop offset=".6" stop-color="#6fe3d8" stop-opacity=".25"/><stop offset="1" stop-color="#6fe3d8" stop-opacity="0"/></radialGradient>
  <linearGradient id="g-ciel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1f5e"/><stop offset=".45" stop-color="#a3426f"/><stop offset=".8" stop-color="#f08a5d"/><stop offset="1" stop-color="#ffc77a"/></linearGradient>
  <linearGradient id="g-bois" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8683a"/><stop offset="1" stop-color="#6e3f1f"/></linearGradient>
  <linearGradient id="g-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3b0"/><stop offset=".5" stop-color="#e8b84a"/><stop offset="1" stop-color="#9c6a1c"/></linearGradient>
  <symbol id="mangue" viewBox="-20 -20 40 40">
    <ellipse rx="15" ry="12" transform="rotate(-20)" fill="url(#g-mangue)" stroke="#8f2410" stroke-width="1.2"/>
    <path d="M2,-12 C6,-20 14,-19 15,-15 C10,-14 6,-12 2,-12Z" fill="#4f8a2b" stroke="#2f5d17" stroke-width="1"/>
    <ellipse cx="-5" cy="-3" rx="4" ry="2.2" fill="#fff" opacity=".4" transform="rotate(-30 -5 -3)"/>
  </symbol>
  <symbol id="sac" viewBox="-14 -16 28 30">
    <path d="M-9,-6 Q-12,6 -9,12 Q0,14.5 9,12 Q12,6 9,-6 Z" style="fill:var(--c,#dcb67f)" stroke="#7a5528" stroke-width="1.2"/>
    <path d="M-6,-6 L-5,-12 Q0,-14.5 5,-12 L6,-6 Z" style="fill:var(--c2,#c79a5f)" stroke="#7a5528" stroke-width="1.2"/>
    <path d="M-6.5,-7 Q0,-4.5 6.5,-7" stroke="#7a5528" stroke-width="1.3" fill="none"/>
    <circle cx="-2.5" cy="3" r="1.5" fill="#fff" opacity=".35"/>
  </symbol>
  <symbol id="etoile" viewBox="-10 -10 20 20"><path d="M0,-9 L2.4,-2.6 L9,-2.2 L3.8,2 L5.6,8.6 L0,4.8 L-5.6,8.6 L-3.8,2 L-9,-2.2 L-2.4,-2.6Z" fill="currentColor"/></symbol>
</defs></svg>`;

/** Mathéo : petit être lumineux de la taille d'une calebasse. humeur : content | surpris | pense | joie */
export function matheo({ humeur = "content", classe = "" } = {}) {
  const bouche = {
    content: '<path d="M51 86 q9 10 18 0" stroke="#7a3b00" stroke-width="3" fill="none" stroke-linecap="round"/>',
    joie: '<path d="M48 84 q12 16 24 0 z" fill="#7a3b00"/><path d="M52 90 q8 5 16 0" fill="#ff8f6b"/>',
    surpris: '<ellipse cx="60" cy="88" rx="5" ry="6.5" fill="#7a3b00"/>',
    pense: '<path d="M52 89 q8 -4 16 0" stroke="#7a3b00" stroke-width="3" fill="none" stroke-linecap="round"/>'
  }[humeur] || "";
  return `<svg viewBox="0 0 120 140" class="matheo ${classe}" role="img" aria-label="Mathéo, un petit visiteur lumineux">
    <circle cx="60" cy="82" r="58" fill="url(#g-halo)" class="halo"/>
    <path d="M46 40 Q38 20 30 12" stroke="#ffbf2e" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    <circle cx="29" cy="11" r="5.5" fill="#fffbd0" class="pointe"/>
    <path d="M74 40 Q82 20 90 12" stroke="#ffbf2e" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    <circle cx="91" cy="11" r="5.5" fill="#fffbd0" class="pointe p2"/>
    <ellipse cx="60" cy="82" rx="40" ry="44" fill="url(#g-matheo)" stroke="#e3a300" stroke-width="2"/>
    <ellipse cx="46" cy="76" rx="7" ry="9.5" fill="#2b1d4a"/><ellipse cx="74" cy="76" rx="7" ry="9.5" fill="#2b1d4a"/>
    <circle cx="43.6" cy="72" r="2.8" fill="#fff"/><circle cx="71.6" cy="72" r="2.8" fill="#fff"/>
    ${bouche}
  </svg>`;
}

/** Mamie Sègla : commerçante calme et malicieuse (foulard, pagne). */
export function mamie({ classe = "" } = {}) {
  return `<svg viewBox="0 0 100 140" class="personnage ${classe}" role="img" aria-label="Mamie Sègla, commerçante">
    <path d="M18 138 L26 80 Q50 66 74 80 L82 138Z" fill="#c1440e"/>
    <g fill="#f6e7c1" opacity=".9"><circle cx="34" cy="106" r="3"/><circle cx="50" cy="114" r="3"/><circle cx="66" cy="106" r="3"/><circle cx="42" cy="124" r="3"/><circle cx="58" cy="124" r="3"/><circle cx="50" cy="96" r="3"/></g>
    <path d="M30 82 Q50 70 70 82 L66 96 Q50 88 34 96Z" fill="#f3d9a4"/>
    <rect x="43" y="62" width="14" height="14" rx="5" fill="#8a5738"/>
    <circle cx="50" cy="44" r="21" fill="#8d5a3c"/>
    <path d="M28 44 Q26 20 50 20 Q74 20 72 44 Q64 34 50 33 Q36 34 28 44Z" fill="#2a9d8f"/>
    <path d="M66 24 Q86 14 82 34 Q76 28 70 30Z" fill="#2a9d8f"/>
    <g fill="#f6e7c1"><circle cx="38" cy="26" r="2.2"/><circle cx="50" cy="23" r="2.2"/><circle cx="62" cy="26" r="2.2"/><circle cx="78" cy="24" r="2"/></g>
    <ellipse cx="42" cy="46" rx="2.6" ry="3.4" fill="#2b1d1a"/><ellipse cx="58" cy="46" rx="2.6" ry="3.4" fill="#2b1d1a"/>
    <path d="M38 40 q4 -3 8 -1 M54 39 q4 -2 8 1" stroke="#3a2418" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M42 56 q8 6 17 0 q-1 -1 -3 -1" stroke="#5c2d1c" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <circle cx="29" cy="50" r="2.6" fill="#e8b84a"/><circle cx="71" cy="50" r="2.6" fill="#e8b84a"/>
  </svg>`;
}

/** Panier d'osier ; les objets déposés s'affichent au-dessus. */
export function panierSymbole() {
  return `<g class="panier">
    <ellipse cx="0" cy="0" rx="46" ry="11" fill="#7a4a1f"/>
    <path d="M-44 0 Q-40 38 -24 42 L24 42 Q40 38 44 0Z" fill="#c98a42" stroke="#7a4a1f" stroke-width="2"/>
    <g stroke="#a56b2c" stroke-width="2" fill="none"><path d="M-36 12 H36 M-32 22 H32 M-28 32 H28"/><path d="M-20 4 V40 M-8 4 V42 M8 4 V42 M20 4 V40"/></g>
    <ellipse cx="0" cy="0" rx="46" ry="11" fill="none" stroke="#e0b070" stroke-width="3"/>
  </g>`;
}

/** Étoile de la Grande Pirogue (nom historique : fragmentBoussole) : une étoile à cinq branches qui brille. */
export function fragmentBoussole({ classe = "" } = {}) {
  return `<svg viewBox="0 0 120 120" class="fragment ${classe}" role="img" aria-label="Une étoile qui brille">
    <circle cx="60" cy="60" r="58" fill="url(#g-halo)" class="halo"/>
    <path d="M60 8 L73 42 L110 45 L81 68 L91 104 L60 84 L29 104 L39 68 L10 45 L47 42Z" fill="url(#g-metal)" stroke="#8a5a10" stroke-width="3" stroke-linejoin="round"/>
    <path d="M60 22 L68 46 L94 48 L74 64 L81 90 L60 76 L39 90 L46 64 L26 48 L52 46Z" fill="#fff6b8" opacity=".75"/>
    <circle cx="52" cy="54" r="3.4" fill="#fff"/><circle cx="68" cy="54" r="3.4" fill="#fff"/>
    <path d="M52 66 q8 7 16 0" stroke="#8a5a10" stroke-width="3" fill="none" stroke-linecap="round"/>
  </svg>`;
}

/** Le Nuage-Paresse : un nuage grognon et endormi, qui souffle sur les étoiles quand on abandonne. Pour rire, jamais méchant. */
export function nuageParesse({ humeur = "endormi", classe = "" } = {}) {
  const yeux = humeur === "fond"
    ? '<path d="M46 66 q6 -8 12 0 M82 66 q6 -8 12 0" stroke="#3a3466" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M60 82 q10 12 20 0" stroke="#3a3466" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
    : '<path d="M44 68 q7 5 14 0 M82 68 q7 5 14 0" stroke="#3a3466" stroke-width="3.5" fill="none" stroke-linecap="round"/><ellipse cx="70" cy="86" rx="7" ry="5" fill="#3a3466"/><text x="104" y="48" font-size="15" font-weight="800" fill="#cfd6ff">z</text><text x="114" y="36" font-size="11" font-weight="800" fill="#cfd6ff">z</text>';
  return `<svg viewBox="0 0 140 110" class="nuage ${classe}" role="img" aria-label="Le Nuage-Paresse">
    <g fill="#8d93d6" stroke="#5c62a8" stroke-width="3" stroke-linejoin="round">
      <path d="M26 92 Q6 92 8 72 Q10 54 30 56 Q32 30 58 32 Q72 14 92 28 Q114 24 118 48 Q136 54 130 74 Q128 92 108 92Z"/>
    </g>
    <path d="M34 62 Q36 44 56 44" stroke="#b6bbf0" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>
    ${yeux}
  </svg>`;
}
/** Ciel étoilé animé (arrière-plan), reproductible grâce à la graine. */
export function ciel(graine = 7, nombre = 46) {
  let a = graine >>> 0;
  const alea = () => ((a = (Math.imul(a, 1664525) + 1013904223) >>> 0) / 4294967296);
  let html = "";
  for (let i = 0; i < nombre; i++) {
    const x = (alea() * 100).toFixed(1), y = (alea() * 100).toFixed(1);
    const t = (1 + alea() * 2.2).toFixed(1), d = (alea() * 4).toFixed(1), o = (0.35 + alea() * 0.6).toFixed(2);
    html += `<i style="left:${x}%;top:${y}%;width:${t}px;height:${t}px;animation-delay:${d}s;opacity:${o}"></i>`;
  }
  return `<div class="ciel" aria-hidden="true">${html}</div>`;
}

/**
 * Scène du marché au coucher du soleil : étal, balance (le fragment sert de poids), 24 mangues, panier vide.
 * Les mangues sont des objets distincts et comptables.
 */
export function sceneMarche({ mangues = 24, fragment = true } = {}) {
  let m = "";
  const colonnes = 8;
  for (let i = 0; i < mangues; i++) {
    const c = i % colonnes, l = Math.floor(i / colonnes);
    const x = 42 + c * 25 + (l % 2) * 6, y = 168 - l * 22;
    m += `<use href="#mangue" x="${x - 12}" y="${y - 12}" width="24" height="24" class="m-sc"/>`;
  }
  return `<svg viewBox="0 0 360 250" class="scene" role="img" aria-label="Le marché de Mamie Sègla : un étal avec ${mangues} mangues, une balance et un panier vide">
    <rect width="360" height="250" fill="url(#g-ciel)"/>
    <circle cx="288" cy="150" r="30" fill="#ffd9a0" opacity=".9"/><circle cx="288" cy="150" r="46" fill="#ffd9a0" opacity=".25"/>
    <g fill="#fff" opacity=".8"><use href="#etoile" x="28" y="14" width="9" height="9" color="#fff"/><use href="#etoile" x="96" y="30" width="6" height="6" color="#fff"/><use href="#etoile" x="210" y="12" width="8" height="8" color="#fff"/><use href="#etoile" x="320" y="26" width="7" height="7" color="#fff"/><use href="#etoile" x="170" y="44" width="5" height="5" color="#fff"/></g>
    <path d="M0 190 Q90 168 180 184 T360 178 V250 H0Z" fill="#6e3f1f" opacity=".5"/>
    <rect y="196" width="360" height="54" fill="#8a5a2b"/><rect y="196" width="360" height="5" fill="#a9733a"/>
    <path d="M18 58 H252 L236 96 H34Z" fill="#c1440e"/>
    <g fill="#f6e7c1"><path d="M34 96 L52 58 H70 L56 96Z"/><path d="M92 96 L106 58 H124 L116 96Z"/><path d="M150 96 L160 58 H178 L176 96Z"/><path d="M206 96 L214 58 H232 L236 96Z"/></g>
    <rect x="30" y="94" width="5" height="102" fill="#6e3f1f"/><rect x="236" y="94" width="5" height="102" fill="#6e3f1f"/>
    <rect x="22" y="178" width="226" height="22" rx="3" fill="url(#g-bois)"/><rect x="22" y="178" width="226" height="4" fill="#c58a52"/>
    ${m}
    <g transform="translate(150 112)"><path d="M0 -26 V12" stroke="#5c3a1b" stroke-width="3"/><path d="M-34 -14 H34" stroke="#5c3a1b" stroke-width="3"/>
      <path d="M-34 -14 L-42 4 H-26Z M34 -14 L26 4 H42Z" fill="#a9733a" stroke="#5c3a1b" stroke-width="1.5"/>
      ${fragment ? '<g transform="translate(34 -4)" class="poids"><circle r="14" fill="url(#g-halo)"/><path d="M0 0 L0 -9 A9 9 0 0 1 9 0Z" fill="url(#g-metal)" stroke="#7a5214" stroke-width="1"/></g>' : ""}
    </g>
    <g transform="translate(298 205) scale(.8)">${panierSymbole()}</g>
    <g transform="translate(266 66) scale(.72)">${mamie().replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")}</g>
  </svg>`;
}

/** Anita, 9 ans : curieuse, patiente, tresses, craie à la main. [À VALIDER] */
export function anita({ classe = "" } = {}) {
  return `<svg viewBox="0 0 100 140" class="personnage ${classe}" role="img" aria-label="Anita, 9 ans">
    <path d="M24 138 L31 90 Q50 80 69 90 L76 138Z" fill="#2f6fd6"/>
    <path d="M31 92 Q50 80 69 92 L67 106 Q50 99 33 106Z" fill="#ffd23f"/>
    <rect x="43" y="70" width="14" height="14" rx="5" fill="#76492f"/>
    <path d="M69 94 Q82 100 80 114" stroke="#7f5236" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="77" y="112" width="4" height="9" rx="1.5" fill="#fff" transform="rotate(-12 79 116)"/>
    <path d="M30 52 Q22 66 26 84" stroke="#1d1410" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M70 52 Q78 66 74 84" stroke="#1d1410" stroke-width="7" fill="none" stroke-linecap="round"/>
    <circle cx="26" cy="86" r="3.4" fill="#ff7aa2"/><circle cx="74" cy="86" r="3.4" fill="#6fe3d8"/>
    <circle cx="50" cy="48" r="21" fill="#7f5236"/>
    <path d="M29 46 Q28 24 50 24 Q72 24 71 46 Q63 36 50 35 Q37 36 29 46Z" fill="#1d1410"/>
    <path d="M50 24 L50 35" stroke="#7f5236" stroke-width="1.6"/>
    <ellipse cx="42" cy="50" rx="2.7" ry="3.6" fill="#2b1d1a"/><ellipse cx="58" cy="50" rx="2.7" ry="3.6" fill="#2b1d1a"/>
    <path d="M37 44 q5 -4 10 -1 M53 43 q5 -3 10 1" stroke="#1d1410" stroke-width="1.7" fill="none" stroke-linecap="round"/>
    <path d="M43 59 q7 6 14 0" stroke="#5c2d1c" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  </svg>`;
}

/** Kola, 9 ans : rapide, blagueur, sourire large. [À VALIDER] */
export function kola({ classe = "" } = {}) {
  return `<svg viewBox="0 0 100 140" class="personnage ${classe}" role="img" aria-label="Kola, 9 ans">
    <rect x="34" y="106" width="13" height="30" rx="5" fill="#7f5236"/><rect x="53" y="106" width="13" height="30" rx="5" fill="#7f5236"/>
    <path d="M30 106 L33 130 L67 130 L70 106Z" fill="#3b4a8f"/>
    <path d="M26 98 L32 82 Q50 74 68 82 L74 98 L66 104 L66 90 L34 90 L34 104Z" fill="#2fb36b"/><path d="M32 82 Q50 74 68 82 L70 108 L30 108Z" fill="#2fb36b"/>
    <rect x="43" y="68" width="14" height="14" rx="5" fill="#8a5a3a"/>
    <circle cx="50" cy="46" r="21" fill="#8a5a3a"/>
    <path d="M30 42 Q32 22 50 22 Q68 22 70 42 Q64 32 50 32 Q36 32 30 42Z" fill="#1d1410"/>
    <ellipse cx="42" cy="48" rx="2.7" ry="3.6" fill="#2b1d1a"/><ellipse cx="58" cy="48" rx="2.7" ry="3.6" fill="#2b1d1a"/>
    <path d="M37 41 q5 -3 9 0 M54 41 q5 -3 9 0" stroke="#1d1410" stroke-width="1.7" fill="none" stroke-linecap="round"/>
    <path d="M40 56 q10 12 20 0 z" fill="#7a2b1a"/><path d="M43 57 h14" stroke="#fff" stroke-width="2.2"/>
  </svg>`;
}

/** Maître Léo : instituteur, rare et bienveillant. [À VALIDER] */
export function maitreLeo({ classe = "" } = {}) {
  return `<svg viewBox="0 0 100 150" class="personnage ${classe}" role="img" aria-label="Maître Léo, instituteur">
    <rect x="36" y="112" width="12" height="34" rx="4" fill="#2b2f4a"/><rect x="52" y="112" width="12" height="34" rx="4" fill="#2b2f4a"/>
    <path d="M24 114 L30 80 Q50 70 70 80 L76 114Z" fill="#8ecae6"/>
    <path d="M44 74 L50 90 L56 74Z" fill="#fff"/>
    <rect x="43" y="62" width="14" height="14" rx="5" fill="#6d4128"/>
    <circle cx="50" cy="42" r="21" fill="#7a4a2e"/>
    <path d="M30 38 Q32 18 50 18 Q68 18 70 38 Q64 28 50 28 Q36 28 30 38Z" fill="#1d1410"/>
    <ellipse cx="42" cy="44" rx="2.6" ry="3.4" fill="#2b1d1a"/><ellipse cx="58" cy="44" rx="2.6" ry="3.4" fill="#2b1d1a"/>
    <path d="M36 38 q6 -3 11 0 M53 38 q6 -3 11 0" stroke="#1d1410" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M43 54 q7 5 14 0" stroke="#4a2414" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  </svg>`;
}
