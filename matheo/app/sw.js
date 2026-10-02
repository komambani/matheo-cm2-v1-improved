// Service worker : l'application fonctionne hors ligne après la première visite.
// Stratégie : le « socle » (code) est mis en cache à l'installation, puis tous les contenus de notions et toutes les voix ;
// ensuite, chaque fichier est servi du cache et mis à jour en arrière-plan.
const VERSION = "matheo-v0.5.1";
const SOCLE = [
  "./", "index.html", "manifest.webmanifest", "icon.svg", "icon-192.png", "icon-512.png", "css/style.css",
  "audio/index.json", "content/index.json",
  "js/main.js", "js/ui.js", "js/notion.js", "js/art.js", "js/scenes.js", "js/visuels.js", "js/lots.js", "js/sfx.js", "js/store.js",
  "js/voix.js", "js/phrases.js", "js/bd.js", "js/video.js", "js/generators/fractions.js",
  "js/defis/lots.js", "js/defis/etapes.js", "js/defis/etapes3d.js", "js/defis/pose.js", "js/vendor/marche3d.js"
];

self.addEventListener("install", (e) => {
  // Le socle est obligatoire ; contenus et voix sont ajoutés ensuite (leur échec ne bloque pas l'installation).
  e.waitUntil(caches.open(VERSION).then(async (c) => {
    await c.addAll(SOCLE);
    try {
      const notions = await (await fetch("content/index.json", { cache: "no-cache" })).json();
      await Promise.all(notions.notions.map((n) => c.add(`content/${n.fichier}`).catch(() => {})));
      for (const extra of notions.extras || []) await c.add(`content/${extra}`).catch(() => {});
    } catch { /* contenus : seront mis en cache à la première utilisation */ }
    try {
      const index = await (await fetch("audio/index.json", { cache: "no-cache" })).json();
      await Promise.all(Object.values(index).map((f) => c.add(`audio/${f}`).catch(() => {})));
    } catch { /* pas de voix : le texte reste affiché */ }
  }).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  // On prend d'abord le contrôle des pages (l'ancien worker devient inactif et cesse d'écrire dans son cache), PUIS on supprime les anciens caches.
  e.waitUntil(self.clients.claim().then(() => caches.keys()).then((cles) => Promise.all(cles.filter((k) => k !== VERSION).map((k) => caches.delete(k)))));
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then((cache) => {
      const reseau = fetch(e.request).then((r) => {
        if (r && r.ok) { const copie = r.clone(); caches.open(VERSION).then((c) => c.put(e.request, copie)); }
        return r;
      }).catch(() => cache);
      return cache || reseau;
    })
  );
});
