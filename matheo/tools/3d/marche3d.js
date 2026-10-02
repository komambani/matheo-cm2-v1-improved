// Scène 3D « Le marché de Ouidah au coucher du soleil » (étoile n°1, notion N10 : multiplier).
// Source de app/js/vendor/marche3d.js : compilé par tools/3d/build.ps1 (esbuild + Three.js, une seule fois).
// Tout est fabriqué par code (aucun modèle téléchargé) : formes simples, lumière chaude, brume, lucioles.
// Principe pédagogique : 6 rangées de 47 sacs ; chaque étape réussie du défi fait « voler » des sacs dans la charrette,
// jusqu'aux 282 sacs, puis l'étoile de Mathéo se rallume dans le ciel.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Fog, HemisphereLight, DirectionalLight, PointLight,
  Mesh, MeshStandardMaterial, MeshBasicMaterial, BoxGeometry, SphereGeometry, CylinderGeometry, ConeGeometry,
  CapsuleGeometry, TorusGeometry, PlaneGeometry, CircleGeometry, InstancedMesh, Object3D, Group,
  BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, AdditiveBlending, BackSide,
  CanvasTexture, Sprite, SpriteMaterial, DynamicDrawUsage, MathUtils, SRGBColorSpace
} from "three";

export const RANGEES = 6, PAR_RANGEE = 47, TOTAL = RANGEES * PAR_RANGEE;

/** Le téléphone sait-il afficher de la 3D, sans souffrir ? */
export function peut3D() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return false;
    if ((navigator.deviceMemory || 4) < 1.5) return false;
    return true;
  } catch { return false; }
}

const alea = (graine) => { let a = graine >>> 0; return () => ((a = (Math.imul(a, 1664525) + 1013904223) >>> 0) / 4294967296); };
const lisse = (t) => t * t * (3 - 2 * t);

function lueur(couleur, taille = 128) {
  const c = document.createElement("canvas"); c.width = c.height = taille;
  const g = c.getContext("2d"), r = taille / 2;
  const d = g.createRadialGradient(r, r, 0, r, r, r);
  d.addColorStop(0, couleur); d.addColorStop(0.35, couleur.replace(/[\d.]+\)$/, "0.35)")); d.addColorStop(1, couleur.replace(/[\d.]+\)$/, "0)"));
  g.fillStyle = d; g.fillRect(0, 0, taille, taille);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t;
}

function ciel() {
  // Grande sphère dont les sommets sont colorés du zénith (nuit) à l'horizon (orange) : dégradé de coucher de soleil.
  const g = new SphereGeometry(120, 24, 16);
  const haut = new Color("#1d1450"), milieu = new Color("#a3426f"), bas = new Color("#ff9d5c"), c = new Color();
  const col = [];
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const h = MathUtils.clamp(p.getY(i) / 120, -0.1, 1);
    if (h < 0.25) c.copy(bas).lerp(milieu, Math.max(0, h) / 0.25); else c.copy(milieu).lerp(haut, Math.min(1, (h - 0.25) / 0.6));
    col.push(c.r, c.g, c.b);
  }
  g.setAttribute("color", new Float32BufferAttribute(col, 3));
  return new Mesh(g, new MeshBasicMaterial({ vertexColors: true, side: BackSide, fog: false }));
}

function sol() {
  const g = new PlaneGeometry(90, 90, 36, 36); g.rotateX(-Math.PI / 2);
  const r = alea(5), col = [], c = new Color();
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { c.set("#d9a35f").lerp(new Color("#b67c3e"), r() * 0.55); col.push(c.r, c.g, c.b); }
  g.setAttribute("color", new Float32BufferAttribute(col, 3));
  return new Mesh(g, new MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true }));
}

function etal(x, z, couleurs, orientation = 0) {
  const g = new Group(); g.position.set(x, 0, z); g.rotation.y = orientation;
  const bois = new MeshStandardMaterial({ color: "#7a4a24", roughness: 0.9, flatShading: true });
  for (const [dx, dz] of [[-1.7, -1], [1.7, -1], [-1.7, 1], [1.7, 1]]) {
    const p = new Mesh(new CylinderGeometry(0.08, 0.1, 3, 6), bois); p.position.set(dx, 1.5, dz); g.add(p);
  }
  const table = new Mesh(new BoxGeometry(3.6, 0.18, 2.2), bois); table.position.y = 1.05; g.add(table);
  // toit en bandes de couleurs, légèrement incliné
  couleurs.forEach((c, i) => {
    const bande = new Mesh(new BoxGeometry(3.9 / couleurs.length, 0.1, 2.8), new MeshStandardMaterial({ color: c, roughness: 0.8, flatShading: true }));
    bande.position.set(-1.95 + (i + 0.5) * (3.9 / couleurs.length), 3.05, 0); bande.rotation.x = -0.12; g.add(bande);
  });
  // quelques mangues sur la table
  const m = new MeshStandardMaterial({ color: "#f08a24", roughness: 0.55 });
  const r = alea(Math.floor(x * 31 + z * 7 + 3));
  for (let i = 0; i < 9; i++) { const f = new Mesh(new SphereGeometry(0.19, 8, 6), m); f.scale.set(1, 0.85, 0.9); f.position.set(-1.4 + (i % 5) * 0.7 + r() * 0.1, 1.28, -0.4 + Math.floor(i / 5) * 0.8); g.add(f); }
  return g;
}

function palmier(x, z, hauteur = 6, inclinaison = 0.15) {
  const g = new Group(); g.position.set(x, 0, z); g.rotation.z = inclinaison;
  const tronc = new Mesh(new CylinderGeometry(0.18, 0.3, hauteur, 6), new MeshStandardMaterial({ color: "#8a5a32", roughness: 1, flatShading: true }));
  tronc.position.y = hauteur / 2; g.add(tronc);
  const feuille = new MeshStandardMaterial({ color: "#2f8f4a", roughness: 0.8, flatShading: true, side: 2 });
  for (let i = 0; i < 7; i++) {
    const f = new Mesh(new ConeGeometry(0.45, 3.2, 4), feuille);
    f.position.y = hauteur; f.rotation.z = Math.PI / 2 - 0.35; f.rotation.y = (i / 7) * Math.PI * 2;
    const pivot = new Group(); pivot.position.y = hauteur; pivot.rotation.y = (i / 7) * Math.PI * 2;
    f.rotation.y = 0; f.position.set(1.5, 0, 0); f.rotation.z = -Math.PI / 2 - 0.4; pivot.add(f); g.add(pivot);
  }
  return g;
}

function mamie() {
  const g = new Group();
  const pagne = new MeshStandardMaterial({ color: "#c1440e", roughness: 0.8, flatShading: true });
  const peau = new MeshStandardMaterial({ color: "#8d5a3c", roughness: 0.7 });
  const foulard = new MeshStandardMaterial({ color: "#2a9d8f", roughness: 0.7, flatShading: true });
  const corps = new Mesh(new ConeGeometry(0.62, 1.7, 10), pagne); corps.position.y = 0.85; g.add(corps);
  const buste = new Mesh(new SphereGeometry(0.42, 10, 8), new MeshStandardMaterial({ color: "#f3d9a4", roughness: 0.8 })); buste.position.y = 1.7; buste.scale.set(1, 0.8, 0.8); g.add(buste);
  const tete = new Mesh(new SphereGeometry(0.34, 12, 10), peau); tete.position.y = 2.2; g.add(tete);
  const coiffe = new Mesh(new SphereGeometry(0.37, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), foulard); coiffe.position.y = 2.27; g.add(coiffe);
  const noeud = new Mesh(new TorusGeometry(0.16, 0.07, 6, 10), foulard); noeud.position.set(0.28, 2.5, 0); noeud.rotation.y = 1.2; g.add(noeud);
  for (const s of [-1, 1]) { const oeil = new Mesh(new SphereGeometry(0.045, 6, 6), new MeshBasicMaterial({ color: "#2b1d1a" })); oeil.position.set(s * 0.12, 2.24, 0.3); g.add(oeil); }
  const bras = new Group(); bras.position.set(0.5, 1.85, 0.05);
  const b = new Mesh(new CapsuleGeometry(0.1, 0.55, 4, 8), peau); b.position.y = -0.3; bras.add(b); g.add(bras); g.userData.bras = bras;
  return g;
}

function matheoMesh() {
  const g = new Group();
  const corps = new Mesh(new SphereGeometry(0.8, 20, 16), new MeshStandardMaterial({ color: "#ffe066", emissive: "#ffb92e", emissiveIntensity: 0.9, roughness: 0.4 }));
  corps.scale.set(0.92, 1, 0.92); g.add(corps);
  for (const s of [-1, 1]) {
    const oeil = new Mesh(new SphereGeometry(0.12, 8, 8), new MeshBasicMaterial({ color: "#2b1d4a" })); oeil.position.set(s * 0.27, 0.12, 0.7); g.add(oeil);
    const reflet = new Mesh(new SphereGeometry(0.04, 6, 6), new MeshBasicMaterial({ color: "#fff" })); reflet.position.set(s * 0.25, 0.18, 0.8); g.add(reflet);
    const ant = new Mesh(new CylinderGeometry(0.025, 0.025, 0.7, 5), new MeshBasicMaterial({ color: "#ffbf2e" })); ant.position.set(s * 0.32, 1.05, 0); ant.rotation.z = -s * 0.45; g.add(ant);
    const bout = new Mesh(new SphereGeometry(0.1, 8, 8), new MeshBasicMaterial({ color: "#fffbd0" })); bout.position.set(s * 0.5, 1.38, 0); g.add(bout);
  }
  const bouche = new Mesh(new TorusGeometry(0.16, 0.035, 6, 12, Math.PI), new MeshBasicMaterial({ color: "#7a3b00" })); bouche.position.set(0, -0.12, 0.76); bouche.rotation.z = Math.PI; g.add(bouche);
  const halo = new Sprite(new SpriteMaterial({ map: lueur("rgba(255,224,102,0.9)"), blending: AdditiveBlending, depthWrite: false, transparent: true }));
  halo.scale.set(5, 5, 1); g.add(halo); g.userData.halo = halo;
  return g;
}

function charrette() {
  const g = new Group();
  const bois = new MeshStandardMaterial({ color: "#a8683a", roughness: 0.9, flatShading: true });
  const sombre = new MeshStandardMaterial({ color: "#6e3f1f", roughness: 0.9, flatShading: true });
  const plateau = new Mesh(new BoxGeometry(8, 0.35, 5), bois); plateau.position.y = 0.95; g.add(plateau);
  for (const [w, h, d, x, z] of [[8, 0.9, 0.18, 0, 2.5], [8, 0.9, 0.18, 0, -2.5], [0.18, 0.9, 5, 4, 0], [0.18, 0.9, 5, -4, 0]]) {
    const c = new Mesh(new BoxGeometry(w, h, d), sombre); c.position.set(x, 1.45, z); g.add(c);
  }
  for (const [x, z] of [[-3, 2.7], [3, 2.7], [-3, -2.7], [3, -2.7]]) {
    const r = new Mesh(new CylinderGeometry(0.85, 0.85, 0.22, 16), sombre); r.rotation.x = Math.PI / 2; r.position.set(x, 0.85, z); g.add(r);
    const moyeu = new Mesh(new CylinderGeometry(0.2, 0.2, 0.3, 8), bois); moyeu.rotation.x = Math.PI / 2; moyeu.position.set(x, 0.85, z); g.add(moyeu);
  }
  const timon = new Mesh(new BoxGeometry(0.2, 0.2, 4), bois); timon.position.set(0, 0.8, 5); timon.rotation.x = 0.1; g.add(timon);
  return g;
}

/**
 * Crée la scène dans `hote` (un élément DOM). Renvoie une commande :
 *   progres(p)  : p entre 0 et 1, charge proportionnellement les sacs (animation) ;
 *   finir()     : place tout de suite les 282 sacs et allume l'étoile ;
 *   etoile()    : lance la célébration (étoile dans le ciel) ;
 *   etat()      : nombres de sacs chargés / total (pour les tests) ;
 *   rendre()    : dessine une image tout de suite (tests) ;
 *   detruire()  : libère la carte graphique.
 */
export function creerMarche(hote, { basseQualite = false } = {}) {
  const renderer = new WebGLRenderer({ antialias: !basseQualite, alpha: false, powerPreference: "low-power", preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, basseQualite ? 1 : 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.domElement.setAttribute("role", "img");
  renderer.domElement.setAttribute("aria-label", "Le marché de Ouidah au coucher du soleil : 6 rangées de 47 sacs et une charrette");
  renderer.domElement.style.cssText = "width:100%;height:100%;display:block;touch-action:pan-y;border-radius:18px";
  hote.appendChild(renderer.domElement);

  const scene = new Scene();
  scene.background = new Color("#a3426f");
  scene.fog = new Fog("#e58a5f", 26, 80);
  scene.add(ciel());
  scene.add(new HemisphereLight("#ffd9a8", "#7a4a8a", 1.15));
  const soleil = new DirectionalLight("#ffb36b", 2.1); soleil.position.set(-14, 9, -10); scene.add(soleil);
  const solLisse = sol(); scene.add(solLisse);

  // grand soleil bas sur l'horizon
  const disque = new Sprite(new SpriteMaterial({ map: lueur("rgba(255,214,140,1)", 256), blending: AdditiveBlending, depthWrite: false, transparent: true, fog: false }));
  disque.scale.set(46, 46, 1); disque.position.set(-30, 10, -70); scene.add(disque);

  // décor : étals au fond, palmiers sur les côtés
  scene.add(etal(-5.5, -17, ["#e63946", "#f1faee", "#e63946", "#f1faee"]));
  scene.add(etal(0.5, -19, ["#2a9d8f", "#e9c46a", "#2a9d8f", "#e9c46a"]));
  scene.add(etal(6.5, -16.5, ["#f4a261", "#264653", "#f4a261", "#264653"], -0.15));
  scene.add(palmier(-9.5, -6, 7, 0.12)); scene.add(palmier(9.8, -9, 8, -0.1)); scene.add(palmier(-10.5, 6, 6.5, 0.18));

  // 6 piles de 47 sacs (une par rangée), en 2 colonnes × 3 lignes
  const piles = [];
  const posPile = (k) => ({ x: (k % 2 === 0 ? -2.7 : 2.7), z: -11.6 + Math.floor(k / 2) * 4.7 });
  const teintes = ["#dcb67f", "#d3a96a", "#e0be8a", "#cfa163", "#d8b077", "#e2c391"];
  const sacGeo = new CapsuleGeometry(0.3, 0.62, 3, 8); sacGeo.rotateZ(Math.PI / 2);
  const sacs = new InstancedMesh(sacGeo, new MeshStandardMaterial({ roughness: 0.95, flatShading: true }), TOTAL);
  sacs.instanceMatrix.setUsage(DynamicDrawUsage);
  const r = alea(11);
  const dummy = new Object3D();
  const sac = []; // état de chaque sac
  for (let k = 0; k < RANGEES; k++) {
    const { x, z } = posPile(k);
    piles.push({ x, z });
    for (let i = 0; i < PAR_RANGEE; i++) {
      const couche = Math.floor(i / 6), reste = i % 6, cx = reste % 3, cz = Math.floor(reste / 3);
      const px = x + (cx - 1) * 0.98 + (r() - 0.5) * 0.06, pz = z + (cz - 0.5) * 0.82 + (r() - 0.5) * 0.05, py = 0.32 + couche * 0.56;
      const ry = (couche % 2) * 0.15 + (r() - 0.5) * 0.12;
      const idx = k * PAR_RANGEE + i;
      // destination dans la charrette : grille 11 × 6, sacs plus petits
      const j = idx % 66, cj = Math.floor(idx / 66);
      const tx = -3.25 + (j % 11) * 0.65, tz = 6.55 + (Math.floor(j / 11) - 2.5) * 0.78, ty = 1.35 + cj * 0.36;
      sac.push({ home: [px, py, pz, ry], cible: [tx, ty, tz, (r() - 0.5) * 0.3], etat: 0, t: 0 });
      dummy.position.set(px, py, pz); dummy.rotation.set(0, ry, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix();
      sacs.setMatrixAt(idx, dummy.matrix);
      sacs.setColorAt(idx, new Color(teintes[k]).offsetHSL(0, 0, (r() - 0.5) * 0.06));
    }
  }
  scene.add(sacs);
  // un numéro coloré au-dessus de chaque rangée : « 6 rangées » se voit au premier regard
  const couleursRangee = ["#ff5d73", "#ffa23a", "#ffd83d", "#4cd48a", "#47b8ff", "#b08cff"];
  const etiquettes = [];
  piles.forEach((pl, k) => {
    const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d");
    g.fillStyle = couleursRangee[k]; g.beginPath(); g.arc(64, 64, 58, 0, Math.PI * 2); g.fill();
    g.lineWidth = 8; g.strokeStyle = "#fff"; g.stroke();
    g.fillStyle = "#2b1d4a"; g.font = "800 78px system-ui, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(k + 1), 64, 70);
    const tx = new CanvasTexture(c); tx.colorSpace = SRGBColorSpace;
    const etiq = new Sprite(new SpriteMaterial({ map: tx, depthTest: false, transparent: true })); etiq.scale.set(1.9, 1.9, 1); etiq.position.set(pl.x, 5.6, pl.z); etiq.renderOrder = 10; scene.add(etiq); etiquettes.push(etiq);
  });

  const cart = charrette(); cart.position.set(0, 0, 6.55); scene.add(cart);
  // les sacs sont posés en coordonnées monde : on place la charrette en conséquence (cible déjà en monde, charrette centrée en z=6.55)
  cart.position.z = 6.55;

  const mamieM = mamie(); mamieM.position.set(-5.2, 0, 2.6); mamieM.rotation.y = 0.6; mamieM.scale.setScalar(1.15); scene.add(mamieM);
  const mathM = matheoMesh(); mathM.position.set(4.6, 5.4, 1.6); mathM.scale.setScalar(0.85); scene.add(mathM);
  const lumiere = new PointLight("#ffd36b", 36, 14, 1.6); mathM.add(lumiere);

  // lucioles
  const nb = basseQualite ? 40 : 90, pos = new Float32Array(nb * 3), ra = alea(77);
  for (let i = 0; i < nb; i++) { pos[i * 3] = (ra() - 0.5) * 24; pos[i * 3 + 1] = 0.6 + ra() * 6; pos[i * 3 + 2] = -14 + ra() * 26; }
  const lg = new BufferGeometry(); lg.setAttribute("position", new Float32BufferAttribute(pos, 3));
  const lucioles = new Points(lg, new PointsMaterial({ size: 0.28, map: lueur("rgba(255,240,150,1)", 64), transparent: true, blending: AdditiveBlending, depthWrite: false, color: "#fff2a6" }));
  scene.add(lucioles);

  // l'étoile (apparaît à la fin dans le ciel)
  const etoileGroupe = new Group();
  const branches = [];
  const pts = []; for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? 0.55 : 1.4; pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
  const etoileGeo = new BufferGeometry(); const sommets = [];
  for (let i = 0; i < 10; i++) { const a = pts[i], b = pts[(i + 1) % 10]; sommets.push(0, 0, 0, a[0], a[1], 0, b[0], b[1], 0); }
  etoileGeo.setAttribute("position", new Float32BufferAttribute(sommets, 3));
  const etoileMesh = new Mesh(etoileGeo, new MeshBasicMaterial({ color: "#fff1a0", side: 2, fog: false })); etoileGroupe.add(etoileMesh);
  const etoileHalo = new Sprite(new SpriteMaterial({ map: lueur("rgba(255,236,150,1)", 256), blending: AdditiveBlending, depthWrite: false, transparent: true, fog: false })); etoileHalo.scale.set(9, 9, 1); etoileGroupe.add(etoileHalo);
  etoileGroupe.position.set(0, 4.2, -4.2); etoileGroupe.scale.setScalar(0.001); etoileGroupe.renderOrder = 20; scene.add(etoileGroupe);

  // caméra
  const cam = new PerspectiveCamera(52, 1, 0.1, 300);
  let azimut = 0, azimutCible = 0, vue = { x: 0, y: 14.5, z: 13.8 };
  function ajuster() {
    const w = hote.clientWidth || 300, h = hote.clientHeight || 300;
    renderer.setSize(w, h, false); cam.aspect = w / h;
    // portrait : on recule pour que les 2 colonnes de piles et la charrette tiennent dans la largeur
    const recul = Math.max(1, 0.78 / Math.min(1, cam.aspect * 1.1));
    vue = { x: 0, y: 14.5 * recul, z: 13.8 * recul };
    cam.updateProjectionMatrix();
  }
  const obs = typeof ResizeObserver !== "undefined" ? new ResizeObserver(ajuster) : null;
  if (obs) obs.observe(hote);
  ajuster();

  // glisser pour tourner un peu autour de la scène
  let glisse = null;
  const dom = renderer.domElement;
  dom.addEventListener("pointerdown", (e) => { glisse = e.clientX; });
  window.addEventListener("pointermove", (e) => { if (glisse !== null) { azimutCible = MathUtils.clamp(azimutCible + (e.clientX - glisse) * 0.006, -0.55, 0.55); glisse = e.clientX; } });
  window.addEventListener("pointerup", () => { glisse = null; });

  // animation
  let cibleChargee = 0, lances = 0, atterris = 0, derniereLance = 0, tFinal = -1, vivant = true, t0 = performance.now() / 1000, temps = 0;
  const DUREE_VOL = 0.95, ECART = 0.04;
  const m = new Object3D();

  function placerSac(i, x, y, z, ry, ech = 1, rx = 0) {
    m.position.set(x, y, z); m.rotation.set(rx, ry, 0); m.scale.setScalar(ech); m.updateMatrix(); sacs.setMatrixAt(i, m.matrix);
  }
  function mettreAJourSacs(dt) {
    let change = false;
    // lancements échelonnés
    derniereLance += dt;
    // le rythme s'accélère quand beaucoup de sacs attendent (l'enfant a enchaîné les étapes) : jamais plus de ~4 s de retard
    const rythme = (cibleChargee - lances) > 40 ? ECART * 0.3 : ECART;
    while (lances < cibleChargee && derniereLance >= rythme) { derniereLance -= rythme; sac[lances].etat = 1; sac[lances].t = 0; lances++; }
    if (lances >= cibleChargee) derniereLance = 0;
    for (let i = 0; i < lances; i++) {
      const s = sac[i];
      if (s.etat !== 1) continue;
      s.t += dt / DUREE_VOL;
      const u = Math.min(1, s.t), e = lisse(u);
      const [hx, hy, hz, hr] = s.home, [cx, cy, cz, cr] = s.cible;
      const x = hx + (cx - hx) * e, z = hz + (cz - hz) * e, y = hy + (cy - hy) * e + Math.sin(u * Math.PI) * 4.2;
      placerSac(i, x, y, z, hr + (cr - hr) * e, 1 - 0.38 * e, u * Math.PI * 2 * (i % 2 ? 1 : -1) * (u < 1 ? 1 : 0));
      if (u >= 1) { s.etat = 2; atterris++; placerSac(i, cx, cy, cz, cr, 0.62); }
      change = true;
    }
    if (change) sacs.instanceMatrix.needsUpdate = true;
  }

  function dessiner(dt) {
    temps += dt;
    azimut += (azimutCible - azimut) * Math.min(1, dt * 4);
    cam.position.set(Math.sin(azimut) * vue.z + Math.sin(temps * 0.25) * 0.35, vue.y + Math.sin(temps * 0.3) * 0.15, Math.cos(azimut) * vue.z);
    cam.lookAt(0, 0.6, -2.6);
    mathM.position.y = 5.4 + Math.sin(temps * 1.6) * 0.28; mathM.rotation.y = Math.sin(temps * 0.7) * 0.4;
    mathM.userData.halo.material.opacity = 0.75 + Math.sin(temps * 2.2) * 0.2;
    mamieM.userData.bras.rotation.z = 0.5 + Math.sin(temps * 3) * 0.35;
    lucioles.rotation.y = temps * 0.02; lucioles.material.opacity = 0.65 + Math.sin(temps * 1.3) * 0.2;
    mettreAJourSacs(dt);
    // le numéro d'une rangée s'éteint quand tous ses sacs sont partis
    etiquettes.forEach((e, k) => { const parti = Math.max(0, Math.min(1, (lances - k * PAR_RANGEE) / PAR_RANGEE)); e.material.opacity = 1 - lisse(Math.min(1, Math.max(0, (parti - 0.85) / 0.15))); e.visible = e.material.opacity > 0.02; });
    if (tFinal >= 0) {
      const u = Math.min(1, (temps - tFinal) / 1.6), e = lisse(u);
      etoileGroupe.scale.setScalar(0.001 + e * 1.15); etoileGroupe.rotation.z = Math.sin(temps * 1.2) * 0.15;
      etoileGroupe.position.y = 3.6 + e * 1.0 + Math.sin(temps * 1.4) * 0.2;
      etoileHalo.material.opacity = 0.6 + Math.sin(temps * 3) * 0.25;
      lumiere.intensity = 36 + e * 40;
    }
    renderer.render(scene, cam);
  }

  let derniere = performance.now();
  function boucle() {
    if (!vivant) return;
    const now = performance.now(), dt = Math.min(0.05, (now - derniere) / 1000); derniere = now;
    if (!document.hidden) dessiner(dt);
    requestAnimationFrame(boucle);
  }
  requestAnimationFrame(boucle);

  return {
    progres(p) { cibleChargee = Math.max(cibleChargee, Math.min(TOTAL, Math.round(p * TOTAL))); },
    finir() {
      for (let i = 0; i < TOTAL; i++) { const s = sac[i]; s.etat = 2; placerSac(i, s.cible[0], s.cible[1], s.cible[2], s.cible[3], 0.62); }
      lances = atterris = cibleChargee = TOTAL; sacs.instanceMatrix.needsUpdate = true;
    },
    etoile() { if (tFinal < 0) tFinal = temps; },
    etat() { return { charges: atterris, lances, total: TOTAL, etoile: tFinal >= 0, canvas: dom.width + "x" + dom.height }; },
    rendre() { dessiner(0.016); },
    lirePixel(x, y) { const gl = renderer.getContext(); const b = new Uint8Array(4); gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, b); return Array.from(b); },
    detruire() {
      vivant = false; if (obs) obs.disconnect();
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((mm) => { if (mm.map) mm.map.dispose(); mm.dispose(); }); });
      renderer.dispose(); renderer.forceContextLoss(); dom.remove();
    }
  };
}
