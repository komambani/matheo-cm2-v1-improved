# 00 — Vision du projet (v1.0)

Statut : document de travail pour la refonte V1. Construit à partir du canon
existant du dépôt original (`CLAUDE-GIT-HUB-MATHEO`, commit `eb75607`) :
`docs/Bible_narrative_Matheo_v0.2.md`, `journal/refonte_histoire_v1.1.md`,
`docs/Scenario_N22_pilote_v0.1.md`. Rien n'est inventé ici qui contredise ces
sources ; les ajouts non confirmés par le canon sont marqués **[PROPOSITION]**.

## Nom du projet

« Mathéo — La Quête des Étoiles » (nom de travail hérité du canon : la V1
originale utilise déjà « Mathéo » comme titre et héros).

## En une phrase

Une nuit, les douze étoiles de la Grande Pirogue se sont éteintes au-dessus
d'un village du Bénin. Mathéo — une petite étoile tombée du ciel, pas un
robot — demande à l'enfant de l'aider à les rallumer une à une en résolvant
de vrais problèmes de mathématiques de CM2. (Source : `journal/refonte_histoire_v1.1.md` §1,
corrigé sur un point : le prompt maître V2 de l'utilisateur précise que Mathéo
« n'est pas un robot » — le document `Bible_narrative_Matheo_v0.2.md` §4 avait
décrit Mathéo comme un « petit être de la taille d'une calebasse » sans jamais
dire « robot » : il n'y a donc PAS de contradiction factuelle à corriger dans
le code existant, seulement une clarification à documenter ici pour que plus
aucun agent ne décrive Mathéo comme un robot.)

## Ce que cette V1 améliorée démontre

Un seul parcours complet, extrêmement fini, pour UNE notion de CM2
(voir `14_DECISIONS.md` pour le choix exact), qui prouve :
- la qualité pédagogique (l'enfant comprend réellement la notion) ;
- la qualité narrative (Kola + Mathéo + l'univers des étoiles) ;
- la qualité de la voix (ElevenLabs, voix Antoine testée et validée) ;
- un nouvel ordre pédagogique : **leçon vidéo avant les exercices**
  (rupture assumée avec la V1 originale, qui plaçait déjà BD+vidéo avant
  le défi depuis `refonte_histoire_v1.1.md`, mais sans vraie micro-leçon
  structurée en 10 temps).

## Ce que cette V1 n'est PAS

- Pas un remplacement des 12 notions déjà produites dans l'original (elles
  restent dans le dépôt original, intact).
- Pas une v2 complète du jeu.
- Pas une 3D complexe : la 3D n'est utilisée que si elle sert la pédagogie
  (cf. verdict `B_prototype_3D_N10_v0.1.md` : prototype jugé "jouet", non
  généralisé faute de test utilisateurs réels).

## Chaîne de production cible

Claude Sonnet 5 (cerveau) → Hermes (orchestration) → scripts/CLI → média
→ contrôle qualité → résultat vérifié → publication Netlify → test réel.
