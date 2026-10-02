# Script de la micro-leçon vidéo — N22 : Prendre une fraction d'une quantité

Statut : v0.1, écrit par Claude (architecte), base canon exclusive
(`docs/Scenario_N22_pilote_v0.1.md` §4 et §9 — tous les calculs y sont déjà
vérifiés). Aucun nombre nouveau n'est introduit : l'exemple principal
(12 galettes, 2/3) et le mini-défi final (8 et 3/4) sont repris tels quels
du scénario canon pour ne jamais risquer une erreur mathématique non
vérifiée. Durée cible : 2min50 à 3min10 (canon : 3min10, conservé).

Format du tableau, conforme à l'étape 22 du prompt maître (gabarit
obligatoire) :
SCÈNE / OBJECTIF PÉDAGOGIQUE / VOIX / DIALOGUE / ÉMOTION / VISUEL /
ANIMATION / MUSIQUE / SFX / TEXTE ÉCRAN / INTERACTION / TRANSITION

Voix : Mathéo, voix ElevenLabs Antoine (`nbiTBaMRdSobTQJDzIWm`),
`eleven_multilingual_v2`.

---

## Séquence 1 — Accroche (0:00–0:15)

- OBJECTIF PÉDAGOGIQUE : capter l'attention avec une situation concrète,
  pas un cours.
- VOIX : Mathéo
- DIALOGUE : `[joyeux, énergique] Bip ! Aujourd'hui, une fraction d'une
  quantité. [pause courte] Mamie Sègla a 12 galettes. Elle donne les deux
  tiers à sa voisine. [curieux] Combien de galettes ?`
- ÉMOTION : joyeux puis curieux
- VISUEL : une assiette avec 12 galettes rondes, comptables, dessinées
  nettement, alignées 3 par 3 (préfigure le partage en 3).
- ANIMATION : les 12 galettes apparaissent une à une (apparition
  progressive, 0.1s d'intervalle) pour que l'enfant puisse les compter.
- MUSIQUE : thème principal doux, intensité basse (découverte).
- SFX : petit "pop" à chaque galette qui apparaît.
- TEXTE ÉCRAN : « 12 galettes. 2/3 données. Combien ? »
- INTERACTION : aucune (regarder).
- TRANSITION : zoom léger sur l'écriture "2/3" qui apparaît.

## Séquence 2 — Objectif (0:15–0:25)

- OBJECTIF PÉDAGOGIQUE : l'enfant sait ce qu'il va apprendre.
- VOIX : Mathéo
- DIALOGUE : `[clair, posé] Aujourd'hui, je vais t'apprendre à prendre une
  fraction d'une quantité. [encourageant] Après cette vidéo, tu sauras
  trouver "les 3/4 de 24 mangues" tout seul.`
- ÉMOTION : posé, confiant
- VISUEL : écran titre simple « Objectif : prendre une fraction d'une
  quantité », fond étoilé discret.
- ANIMATION : le texte s'écrit progressivement (effet machine à écrire
  lent, lisible).
- MUSIQUE : identique, transition douce.
- SFX : aucun.
- TEXTE ÉCRAN : titre identique au dialogue.
- INTERACTION : aucune.
- TRANSITION : fondu vers la Séquence 3.

## Séquence 3 — Découverte (0:25–0:40)

- OBJECTIF PÉDAGOGIQUE : partir d'un exemple simple, nommer les éléments.
- VOIX : Mathéo
- DIALOGUE : `[explicatif] Regarde 2/3. [pause] Le 3, en bas, dit en
  combien de parts partager. [pause] Le 2, en haut, dit combien de parts
  on prend.`
- ÉMOTION : pédagogue, posé
- VISUEL : la fraction "2/3" s'affiche en grand. Une flèche pointe vers le
  3 (en bas), puis vers le 2 (en haut).
- ANIMATION : flèche qui glisse du 3 vers le texte "on partage", puis du 2
  vers le texte "on prend". Surlignage de chaque chiffre au moment où il
  est nommé.
- MUSIQUE : identique, légère emphase rythmique sur chaque flèche.
- SFX : "whoosh" discret à chaque flèche.
- TEXTE ÉCRAN : « bas = on partage » / « haut = on prend » (apparaissent
  l'un après l'autre).
- INTERACTION : aucune.
- TRANSITION : les 12 galettes de la Séquence 1 réapparaissent.

## Séquence 4 — Explication, étape par étape (0:40–1:15)

- OBJECTIF PÉDAGOGIQUE : exécuter le partage réel, sans sauter d'étape.
- VOIX : Mathéo
- DIALOGUE : `[concentré, pas à pas] D'abord, je partage 12 en 3 parts
  égales. [pause] 12 divisé par 3... [suspense court] ...égale 4. [content]
  Chaque part a 4 galettes.`
- ÉMOTION : concentré puis content
- VISUEL : les 12 galettes se regroupent visuellement en 3 tas de 4,
  séparés par un espace net. L'opération "12 ÷ 3 = 4" s'écrit au fur et à
  mesure sous les tas.
- ANIMATION : les galettes glissent doucement vers leur tas (300ms,
  easing out), un son de glissement léger ; le nombre "4" grossit
  brièvement quand il apparaît sous chaque tas.
- MUSIQUE : légère montée d'intensité (explication active).
- SFX : glissement + "ding" léger à l'apparition du résultat.
- TEXTE ÉCRAN : « 12 ÷ 3 = 4 (galettes par part) »
- INTERACTION : aucune.
- TRANSITION : les 3 tas restent visibles, on enchaîne direct.

## Séquence 5 — Visualisation : on prend les parts (1:15–1:45)

- OBJECTIF PÉDAGOGIQUE : visualiser concrètement la multiplication finale.
- VOIX : Mathéo
- DIALOGUE : `[enthousiaste] Maintenant, je prends 2 parts. [pause] 2 fois
  4... [petit suspense] ...égale 8 ! [joyeux] Mamie donne 8 galettes.`
- ÉMOTION : enthousiaste, joyeux à la résolution
- VISUEL : 2 des 3 tas s'entourent d'un halo doré lumineux (cohérent avec
  la palette "étoile" du personnage Mathéo) ; le 3e tas reste neutre.
- ANIMATION : halo qui pulse doucement sur les 2 tas sélectionnés ;
  écriture progressive de "4 × 2 = 8" avec le "8" final qui grossit et
  brille.
- MUSIQUE : pic d'intensité modéré (petite réussite).
- SFX : "étincelle" discrète sur le halo, "ding" de validation sur le 8.
- TEXTE ÉCRAN : « 4 × 2 = 8 »
- INTERACTION : aucune.
- TRANSITION : coupe nette vers la règle résumée.

## Séquence 6 — La règle (1:45–2:05)

- OBJECTIF PÉDAGOGIQUE : fixer la règle générale, mémorisable.
- VOIX : Mathéo
- DIALOGUE : `[clair, assuré] Le bas s'appelle le dénominateur. Le haut
  s'appelle le numérateur. [rythmé] On partage avec le bas. On prend avec
  le haut.`
- ÉMOTION : assuré, rythmé (presque scandé, pour la mémorisation)
- VISUEL : carte-résumé avec les deux mots affichés sous les deux chiffres
  de la fraction 2/3 déjà connue de l'enfant.
- ANIMATION : les deux mots "dénominateur" / "numérateur" apparaissent
  avec un léger rebond (bounce), pour marquer le moment "à retenir".
- MUSIQUE : pause légère (moment de mémorisation, pas de surcharge).
- SFX : aucun (silence relatif pour laisser respirer la règle).
- TEXTE ÉCRAN : « bas : dénominateur, on partage » / « haut : numérateur,
  on prend »
- INTERACTION : aucune.
- TRANSITION : fondu vers l'erreur fréquente.

## Séquence 7 — Erreur fréquente (2:05–2:35)

- OBJECTIF PÉDAGOGIQUE : désamorcer l'erreur typique AVANT qu'elle ne soit
  commise par l'enfant (erreur canon E2 : diviser par le numérateur).
- VOIX : Mathéo
- DIALOGUE : `[alerte douce, jamais moqueur] Attention ! Certains divisent
  par le 2 et trouvent 6. [pause] Vérifions ensemble. [posé] Deux parts
  font 8 galettes, pas 6.`
- ÉMOTION : alerte bienveillante, jamais moqueuse — puis posé/rassurant
- VISUEL : "12 ÷ 2 = 6" s'écrit puis se barre d'un trait rouge doux (pas
  agressif) ; juste à côté, les 3 tas de 4 réapparaissent avec 2 tas
  surlignés = 8, pour comparaison visuelle immédiate.
- ANIMATION : le barré apparaît en un geste fluide (trait qui se dessine),
  suivi d'un geste de la main de Mathéo qui désigne les 8 vraies galettes.
- MUSIQUE : légère baisse d'intensité (moment d'attention).
- SFX : "non" sonore doux (pas une alarme stridente — buzzer soft).
- TEXTE ÉCRAN : « 12 ÷ 2 = 6 → faux. Vérifié : 2 parts = 8 galettes. »
- INTERACTION : aucune.
- TRANSITION : Mathéo prononce sa phrase signature.

## Séquence 7bis — Phrase signature (2:35–2:40)

- VOIX : Mathéo
- DIALOGUE : `[chaleureux] Vérifions ensemble !` (phrase signature canon,
  utilisée ici car c'est exactement le moment de vérification — cohérent
  avec le registre de continuité canon de N22).
- ÉMOTION : chaleureux
- TRANSITION : enchaîne directement sur le "pourquoi".

## Séquence 8 — Deuxième exemple / le "pourquoi" (2:35–2:50 ajusté 2:40–2:55)

- OBJECTIF PÉDAGOGIQUE : donner le sens, pas seulement la mécanique.
- VOIX : Mathéo
- DIALOGUE : `[réfléchit, puis clair] Pourquoi partager d'abord ? [pause]
  Pour que chaque part soit égale. [simple] Le bas donne la taille d'une
  part.`
- ÉMOTION : réfléchi puis clair
- VISUEL : mot "Pourquoi ?" en grand, puis les 3 tas de 4 galettes
  réapparaissent, bien égaux, pour illustrer visuellement l'égalité des
  parts.
- ANIMATION : les 3 tas "respirent" légèrement en synchronisation (léger
  scale pulse) pour montrer qu'ils sont de même taille.
- MUSIQUE : douce, stable.
- SFX : aucun.
- TEXTE ÉCRAN : « Pourquoi partager d'abord ? Pour que chaque part soit
  égale. »
- INTERACTION : aucune.
- TRANSITION : fondu vers le résumé.

## Séquence 9 — Résumé, trois idées maximum (2:55–3:05 ajusté)

- OBJECTIF PÉDAGOGIQUE : fixer 3 idées essentielles, pas plus (consigne
  explicite du prompt maître §6).
- VOIX : Mathéo
- DIALOGUE : `[calme, synthétique] Retenons trois choses. [pause] Un : le
  bas partage. [pause] Deux : le haut prend. [pause] Trois : chaque part
  doit être égale.`
- ÉMOTION : calme, didactique
- VISUEL : 3 lignes qui s'affichent l'une après l'autre, numérotées,
  chacune avec une petite icône (partage / prise / balance égale).
- ANIMATION : apparition séquentielle avec un léger temps de pause entre
  chaque ligne pour laisser le temps de lire/écouter.
- MUSIQUE : stable, douce.
- SFX : "tic" léger à l'apparition de chaque ligne.
- TEXTE ÉCRAN : « 1. Le bas partage. 2. Le haut prend. 3. Chaque part est
  égale. »
- INTERACTION : aucune.
- TRANSITION : coupe vers le mini-défi.

## Séquence 10 — Mini-défi (3:05–3:10, extensible si besoin de pause)

- OBJECTIF PÉDAGOGIQUE : vérification immédiate de compréhension (mini
  interaction, pas un gros test — conforme étape 3 du prompt maître).
- VOIX : Mathéo
- DIALOGUE : `[motivant] À toi ! [pause] Trouve les 3/4 de 8. [malicieux]
  Mets la vidéo en pause... [pause longue] ...Réponse : 8 divisé par 4
  égale 2. 2 fois 3 égale 6.`
- ÉMOTION : motivant puis malicieux, puis neutre/clair pour la réponse
- VISUEL : écran "3/4 de 8 ?" avec un gros bouton pause suggéré visuellement
  (icône pause clignotante douce) ; après la pause audio, la réponse
  s'affiche avec le calcul détaillé.
- ANIMATION : clignotement doux de l'icône pause (incite réellement
  l'enfant à mettre en pause) ; apparition progressive du calcul réponse.
- MUSIQUE : suspendue pendant le temps de réflexion (3 secondes de silence
  quasi total, conforme canon : "pause de 3 secondes").
- SFX : "tic-tac" très léger optionnel pendant la pause, pour ne pas
  laisser un silence total déstabilisant.
- TEXTE ÉCRAN : « 3/4 de 8 ? » puis « 8 ÷ 4 = 2, 2 × 3 = 6 »
- INTERACTION : VRAIE interaction ensuite dans l'étape 3 du parcours
  (mini-vérification cliquable, hors vidéo) — pas pendant la vidéo
  elle-même.
- TRANSITION : fondu vers la fin de la leçon, retour au parcours (mission).

---

## Vérification des calculs utilisés dans ce script

| Calcul | Résultat | Source canon vérifiée |
|---|---|---|
| 2/3 de 12 | 12÷3=4 ; 4×2=8 | `Scenario_N22_pilote_v0.1.md` §9, ligne "2/3 de 12 (vidéo)" |
| 12÷2=6 (erreur) | 6 (faux pour la question posée) | `Scenario_N22_pilote_v0.1.md` §4, ligne 2:05-2:35 |
| 3/4 de 8 (mini-défi) | 8÷4=2 ; 2×3=6 | `Scenario_N22_pilote_v0.1.md` §9, ligne "3/4 de 8 (vidéo)" |

Aucun nombre dans ce script n'a été inventé : les trois calculs ci-dessus
sont des copies exactes du scénario canon déjà vérifié par son auteur.
