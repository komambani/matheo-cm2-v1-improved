# 14 — Décisions (journal décisionnel, horodaté)

Toute décision qui engage la production est actée ici avant d'être exécutée.
Format : `[DÉCISION] date — texte — justification`.

## 2026-10-02 — Choix de la notion démonstrateur

[DÉCISION] La V1 améliorée porte sur **N22 — Prendre une fraction d'une
quantité** (3/4 de 24 mangues, marché de Mamie Sègla).

Justification :
- C'est la SEULE notion du canon dont le scénario est entièrement écrit,
  vérifié et chiffré (`docs/Scenario_N22_pilote_v0.1.md`, section 9 : tous
  les calculs recalculés et validés).
- Le prompt maître interdit d'inventer du contenu pédagogique nouveau sans
  base canon. Réutiliser N22 respecte cette règle : zéro nombre inventé,
  zéro personnage inventé.
- Elle a déjà une implémentation fonctionnelle dans l'original
  (`app/content/n22.json`), donc la refonte peut être mesurée par
  comparaison directe avant/après sur la même notion.

## 2026-10-02 — Mathéo n'est pas un robot

[CONSTAT] Le prompt maître V2 insiste : « Mathéo n'est PAS un robot ». Le
canon existant (`Bible_narrative_Matheo_v0.2.md` §4) ne le décrit jamais
comme un robot non plus — il est déjà « un petit être de la taille d'une
calebasse, lumineux, amical » / dans `refonte_histoire_v1.1.md` : « une
petite étoile tombée dans la cour d'Anita et Kola ».
[DÉCISION] Aucune correction de contenu nécessaire sur ce point précis ;
seule la bible visuelle doit désormais représenter Mathéo explicitement
comme une étoile (pas un androïde/robot), ce qui est fait dans
`03_MATHEO.md` et l'image de référence `ART/bible-visuelle/matheo_turnaround_v1.jpg`.

## 2026-10-02 — Personnage retenu pour le parcours démonstrateur : Kola

[CONSTAT] Le prompt maître V2 nomme « Kola » comme personnage principal
joueur. Le canon existant nomme aussi Kola (cousin d'Anita, 9 ans, rapide,
blagueur, erreur par précipitation) — personnage confirmé, pas inventé.
[DÉCISION] Le parcours démonstrateur met en scène Kola comme héros actif
(celui qui résout, aidé par Mathéo), conformément au canon ET au prompt
maître. Anita et Mamie Sègla apparaissent avec leurs rôles canon exacts
(Anita : rend le raisonnement visible ; Mamie Sègla : donne la situation
concrète du marché). Leur rôle n'est PAS réinventé.

## 2026-10-02 — Voix ElevenLabs retenue pour Mathéo

[CONSTAT] Essai réel effectué : voix `nbiTBaMRdSobTQJDzIWm` ("Antoine -
E-learning Instructor"), modèle `eleven_multilingual_v2`, avec balises
d'émotion `[joyeux] [chuchote] [pause] [encourageant]`. Fichier conservé :
`AUDIO/tests-voix/antoine_matheo_test1.mp3` (10.9s, 141 kbps, généré le
2026-10-02).
[DÉCISION] Antoine est retenu comme voix de narration/Mathéo pour ce
parcours démonstrateur, conformément à la consigne explicite de
l'utilisateur. Les balises d'émotion sont bien interprétées par le modèle
`eleven_multilingual_v2` (ton joyeux perceptible, chuchotement marqué).

## 2026-10-02 — Portée technique de la "vidéo de cours"

[CONSTAT] Cet environnement (VPS headless, sans Blender animation-rendering
pipeline opérationnel pour de l'animation de personnage, sans After
Effects/Premiere) ne permet pas de produire un rendu vidéo MP4 façon studio
d'animation dans le temps imparti.
[DÉCISION] La "micro-leçon audiovisuelle" du parcours démonstrateur est
construite comme une séquence HTML/CSS/SVG animée et synchronisée à l'audio
(animations CSS/JS déclenchées sur timeline, dans le navigateur), et non
comme un fichier vidéo MP4 pré-rendu. C'est une différence technique
assumée et documentée : le résultat final, vécu par l'enfant dans son
navigateur, respecte la structure pédagogique en 10 temps demandée
(accroche, objectif, découverte, explication, visualisation, exemple
guidé, erreur fréquente, 2e exemple, résumé, mini-défi), avec narration
audio ElevenLabs réelle et animations réelles synchronisées — mais ce
n'est pas un fichier .mp4 exportable isolément. Si un .mp4 est requis plus
tard, il peut être produit en capturant cette séquence avec ffmpeg
(screen-record headless) une fois le HTML validé — non fait dans cette
itération.
