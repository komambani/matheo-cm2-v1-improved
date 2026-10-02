// Micro-leçon premium N22 — "La Quête des Étoiles", refonte V1 améliorée.
// Diffère du moteur vidéo générique (video.js, voix Piper) : ici la voix est
// une narration ElevenLabs réelle pré-générée (voix Antoine), avec une
// structure pédagogique en 10 temps (voir LESSONS/N22/script_video_N22_v0.1.md).
// N'affecte AUCUNE des 11 autres notions : celles-ci gardent le moteur vidéo
// existant (video.js) inchangé.
//
// Synchronisation : chaque bloc audio (A, B, C, D) a une durée réelle mesurée
// par ffprobe. À l'intérieur d'un bloc, les instants d'apparition des
// éléments visuels sont calés proportionnellement à la position du texte
// prononcé dans la phrase (approximation par nombre de mots), car ElevenLabs
// ne renvoie pas de timestamps mot-à-mot dans ce pipeline. C'est documenté
// ici comme une limite connue, pas caché.

const NS = "http://www.w3.org/2000/svg";
const CRAIE = "'Segoe Print','Bradley Hand','Comic Sans MS',cursive,system-ui,sans-serif";

// Durées réelles mesurées (ffprobe) le 2026-10-02 — à régénérer si l'audio change.
const BLOCS = [
  { id: "A", fichier: "audio/lecons/n22/bloc_A.mp3", duree: 23.92,
    sous_titres: [
      { frac: 0.00, texte: "Bip ! Aujourd'hui, une fraction d'une quantité." },
      { frac: 0.22, texte: "Mamie Sègla a 12 galettes." },
      { frac: 0.42, texte: "Elle donne les 2/3 à sa voisine. Combien de galettes ?" },
      { frac: 0.60, texte: "Je vais t'apprendre à prendre une fraction d'une quantité." },
      { frac: 0.82, texte: "Après cette vidéo, tu sauras trouver les 3/4 de 24 mangues tout seul." }
    ]},
  { id: "B", fichier: "audio/lecons/n22/bloc_B.mp3", duree: 31.35,
    sous_titres: [
      { frac: 0.00, texte: "Regarde 2/3." },
      { frac: 0.10, texte: "Le 3, en bas, dit en combien de parts partager." },
      { frac: 0.30, texte: "Le 2, en haut, dit combien de parts on prend." },
      { frac: 0.50, texte: "D'abord, je partage 12 en 3 parts égales." },
      { frac: 0.65, texte: "12 divisé par 3 égale 4. Chaque part a 4 galettes." },
      { frac: 0.82, texte: "Maintenant, je prends 2 parts. 2 fois 4 égale 8 !" },
      { frac: 0.95, texte: "Mamie donne 8 galettes." }
    ]},
  { id: "C", fichier: "audio/lecons/n22/bloc_C.mp3", duree: 34.46,
    sous_titres: [
      { frac: 0.00, texte: "Le bas s'appelle le dénominateur. Le haut, le numérateur." },
      { frac: 0.20, texte: "On partage avec le bas. On prend avec le haut." },
      { frac: 0.35, texte: "Attention ! Certains divisent par le 2 et trouvent 6." },
      { frac: 0.52, texte: "Vérifions ensemble. Deux parts font 8 galettes, pas 6." },
      { frac: 0.68, texte: "Vérifions ensemble !" },
      { frac: 0.76, texte: "Pourquoi partager d'abord ?" },
      { frac: 0.86, texte: "Pour que chaque part soit égale." },
      { frac: 0.94, texte: "Le bas donne la taille d'une part." }
    ]},
  { id: "D", fichier: "audio/lecons/n22/bloc_D.mp3", duree: 26.47,
    sous_titres: [
      { frac: 0.00, texte: "Retenons trois choses." },
      { frac: 0.12, texte: "Un : le bas partage." },
      { frac: 0.25, texte: "Deux : le haut prend." },
      { frac: 0.37, texte: "Trois : chaque part doit être égale." },
      { frac: 0.52, texte: "À toi ! Trouve les 3/4 de 8." },
      { frac: 0.68, texte: "Mets la vidéo en pause..." },
      { frac: 0.85, texte: "Réponse : 8 ÷ 4 = 2. 2 × 3 = 6." }
    ]}
];

const DUREE_TOTALE = BLOCS.reduce((s, b) => s + b.duree, 0);
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const assiette = (k) => ({ x: 129 + (k % 4) * 34, y: 66 + Math.floor(k / 4) * 34 });
const DECALES = [[-14, -14], [14, -14], [-14, 14], [14, 14]];
const TAS_X = [72, 180, 288];
const tas = (k, y = 104) => ({ x: TAS_X[Math.floor(k / 4)] + DECALES[k % 4][0], y: y + DECALES[k % 4][1] });

export function creerLeconN22(racine, { surFin, surPasser } = {}) {
  racine.innerHTML = `
    <div class="video lecon-premium">
      <div class="lecon-badge">Leçon de Mathéo · voix réelle</div>
      <svg class="tableau" viewBox="0 0 360 203" role="img" aria-label="Tableau animé de la leçon">
        <rect width="360" height="203" rx="10" fill="#1f3d36"/>
        <rect x="3" y="3" width="354" height="197" rx="8" fill="none" stroke="#2f5a4f" stroke-width="2"/>
        <g id="scene-lecon"></g>
      </svg>
      <div class="sous-titre" id="l-st" aria-live="polite">&nbsp;</div>
      <div class="lecteur">
        <button class="rond" id="l-play" aria-label="Pause">⏸</button>
        <div class="barre-v" role="progressbar" aria-valuemin="0" aria-valuemax="${DUREE_TOTALE}"><i id="l-prog"></i></div>
        <span id="l-temps" class="discret">0:00 / ${fmt(DUREE_TOTALE)}</span>
        <button class="rond" id="l-passer" aria-label="Passer la leçon">⏭</button>
      </div>
    </div>`;
  const $ = (s) => racine.querySelector(s);
  const scene = $("#scene-lecon"), st = $("#l-st"), bPlay = $("#l-play"), prog = $("#l-prog"), tmps = $("#l-temps");

  const el = (html) => { scene.insertAdjacentHTML("beforeend", html); return scene.lastElementChild; };
  const voir = (e) => setTimeout(() => e.classList.add("vu"), 30);
  const texte = (id, s, x, y, taille, couleur = "#fff") =>
    el(`<text id="${id}" class="el" x="${x}" y="${y}" font-size="${taille}" font-weight="700" fill="${couleur}" text-anchor="middle" font-family="${CRAIE}">${s}</text>`);
  const galette = (k, p) =>
    el(`<g id="gal${k}" class="el gal" style="transform:translate(${p.x}px,${p.y}px)"><circle r="12" fill="#e0a24a" stroke="#8a5a1e" stroke-width="1.6"/><circle cx="-4" cy="-4" r="2" fill="#f6d28a"/><circle cx="4" cy="3" r="1.6" fill="#f6d28a"/><circle cx="-3" cy="5" r="1.4" fill="#f6d28a"/></g>`);
  const ovale = (cx, cy, couleur = "#ffe066") =>
    el(`<ellipse class="el" cx="${cx}" cy="${cy}" rx="38" ry="38" fill="rgba(255,224,102,.14)" stroke="${couleur}" stroke-width="3"/>`);
  const vider = () => { scene.innerHTML = ""; };

  let audioEls = BLOCS.map((b) => { const a = new Audio(b.fichier); a.preload = "auto"; return a; });
  let blocActuel = -1, tempsAccumule = 0, enPause = false, detruit = false, fini = false;
  let rafId = null;

  const SCENES = {
    A: () => {
      vider();
      el(`<ellipse id="assiette" class="el" cx="180" cy="100" rx="98" ry="64" fill="#e9e4d6" stroke="#b9b09a" stroke-width="3"/>`);
      for (let k = 0; k < 12; k++) voir(galette(k, assiette(k)));
      setTimeout(() => voir(texte("obj", "Objectif : fractions", 180, 190, 18, "#6fe3d8")), 14000);
    },
    B: () => {
      vider();
      voir(el(`<g id="frac" class="el"><text x="180" y="60" font-size="46" font-weight="700" fill="#ffe066" text-anchor="middle" font-family="${CRAIE}">2</text><path d="M152 70 H208" stroke="#fff" stroke-width="4" stroke-linecap="round"/><text x="180" y="110" font-size="46" font-weight="700" fill="#6fe3d8" text-anchor="middle" font-family="${CRAIE}">3</text></g>`));
      setTimeout(() => {
        for (let k = 0; k < 12; k++) voir(galette(k, assiette(k)));
      }, 9500);
      setTimeout(() => {
        for (let k = 0; k < 12; k++) { const g = scene.querySelector(`#gal${k}`); if (g) g.style.transform = `translate(${tas(k).x}px,${tas(k).y}px)`; }
        voir(texte("eq1", "12 ÷ 3 = 4", 180, 186, 26, "#ffe066"));
      }, 16000);
      setTimeout(() => {
        voir(ovale(72, 104)); voir(ovale(180, 104));
        const e1 = scene.querySelector("#eq1"); if (e1) e1.remove();
        voir(texte("eq2", "4 × 2 = 8", 180, 186, 26, "#ffe066"));
        for (let k = 0; k < 8; k++) { const g = scene.querySelector(`#gal${k}`); if (g) g.classList.add("pris"); }
      }, 25800);
    },
    C: () => {
      vider();
      voir(el(`<rect class="el" x="50" y="34" width="260" height="90" rx="16" fill="#f6ebd3" stroke="#c58a52" stroke-width="5"/>`));
      voir(texte("r1", "bas : on partage", 180, 72, 24, "#2b1d4a"));
      voir(texte("r2", "haut : on prend", 180, 104, 24, "#2b1d4a"));
      setTimeout(() => {
        vider();
        voir(texte("faux", "12 ÷ 2 = 6", 180, 52, 30, "#fff"));
        voir(el(`<path class="el" d="M104 30 L256 62 M256 30 L104 62" stroke="#ff6b6b" stroke-width="5" stroke-linecap="round"/>`));
        for (let k = 0; k < 12; k++) voir(galette(k, tas(k, 122)));
        voir(ovale(72, 122)); voir(ovale(180, 122));
      }, 12000);
      setTimeout(() => {
        vider();
        voir(texte("pq", "Pourquoi ?", 180, 50, 36, "#ffe066"));
        for (let k = 0; k < 12; k++) voir(galette(k, tas(k, 116)));
        for (const x of TAS_X) voir(el(`<rect class="el" x="${x - 34}" y="${116 - 34}" width="68" height="68" rx="12" fill="rgba(111,227,216,.14)" stroke="#6fe3d8" stroke-width="3"/>`));
      }, 26200);
    },
    D: () => {
      vider();
      voir(texte("rs1", "1. Le bas partage", 180, 50, 20, "#fff"));
      setTimeout(() => voir(texte("rs2", "2. Le haut prend", 180, 80, 20, "#fff")), 3300);
      setTimeout(() => voir(texte("rs3", "3. Chaque part égale", 180, 110, 20, "#fff")), 6600);
      setTimeout(() => {
        vider();
        voir(texte("defi", "3/4 de 8 ?", 180, 70, 42, "#ffe066"));
        voir(el(`<text class="el" x="180" y="100" font-size="16" fill="#6fe3d8" text-anchor="middle">mets en pause et cherche</text>`));
      }, 13800);
      setTimeout(() => {
        voir(texte("s1", "8 ÷ 4 = 2", 180, 150, 28, "#fff"));
        voir(texte("s2", "2 × 3 = 6", 180, 180, 28, "#6fe3d8"));
      }, 22500);
    }
  };

  function majSousTitre(bloc, tEcoule) {
    const liste = bloc.sous_titres;
    let actif = liste[0];
    for (const s of liste) { if (tEcoule / bloc.duree >= s.frac) actif = s; }
    if (st.textContent !== actif.texte) st.textContent = actif.texte;
  }

  function boucle() {
    if (detruit) return;
    if (!enPause && blocActuel >= 0) {
      const a = audioEls[blocActuel];
      const bloc = BLOCS[blocActuel];
      const tBloc = a.currentTime || 0;
      majSousTitre(bloc, tBloc);
      const tTotal = tempsAccumule + tBloc;
      prog.style.width = `${Math.min(100, (tTotal / DUREE_TOTALE) * 100)}%`;
      tmps.textContent = `${fmt(Math.min(tTotal, DUREE_TOTALE))} / ${fmt(DUREE_TOTALE)}`;
    }
    rafId = requestAnimationFrame(boucle);
  }

  function jouerBloc(i) {
    if (i >= BLOCS.length) {
      fini = true;
      st.innerHTML = "&nbsp;";
      bPlay.textContent = "↺";
      bPlay.setAttribute("aria-label", "Recommencer");
      if (surFin) surFin();
      return;
    }
    blocActuel = i;
    SCENES[BLOCS[i].id]();
    const a = audioEls[i];
    a.currentTime = 0;
    a.onended = () => { tempsAccumule += BLOCS[i].duree; jouerBloc(i + 1); };
    a.play().catch(() => { tempsAccumule += BLOCS[i].duree; jouerBloc(i + 1); });
  }

  function demarrer() {
    tempsAccumule = 0; fini = false; enPause = false;
    bPlay.textContent = "⏸"; bPlay.setAttribute("aria-label", "Pause");
    jouerBloc(0);
    boucle();
  }

  // Politique autoplay des navigateurs : la lecture audio ne peut démarrer
  // qu'après un vrai geste utilisateur (clic/tap). On affiche donc un écran
  // de démarrage explicite au lieu de tenter un autoplay qui échouerait
  // silencieusement et ferait défiler la leçon sans aucun son ni attente.
  st.textContent = "Touche ▶ pour commencer la leçon avec le son.";
  bPlay.textContent = "▶";
  bPlay.setAttribute("aria-label", "Démarrer la leçon");
  let demarre = false;
  bPlay.addEventListener("click", () => {
    if (!demarre) { demarre = true; demarrer(); return; }
    if (fini) return demarrer();
    enPause = !enPause;
    const a = audioEls[blocActuel];
    if (a) { if (enPause) a.pause(); else a.play().catch(() => {}); }
    bPlay.textContent = enPause ? "▶" : "⏸";
    bPlay.setAttribute("aria-label", enPause ? "Lecture" : "Pause");
  });
  $("#l-passer").addEventListener("click", () => {
    detruit = true;
    audioEls.forEach((a) => a.pause());
    if (rafId) cancelAnimationFrame(rafId);
    if (surPasser) surPasser();
  });

  return {
    detruire() {
      detruit = true;
      audioEls.forEach((a) => { a.pause(); a.src = ""; });
      if (rafId) cancelAnimationFrame(rafId);
    }
  };
}
