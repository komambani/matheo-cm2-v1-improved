# Verdict – Jalon 2 : N22 complet (voix, vidéo, BD) – v0.1

**Livrable** : voix Piper (131 phrases), vidéo animée de 3 min 10, BD « L'aventure des sacs » (8 cases), intégration au parcours, tests.
**Évaluateur** : Claude (évaluateur unique, par décision du porteur du projet). **Limite d'indépendance** : le même agent a écrit et évalué ; contrôles automatisés et reproductibles pour compenser, sans remplacer la porte 4 (humains).

## Verdict : APPROUVÉ SOUS RÉSERVES

### Contrôles réussis
| Contrôle | Résultat |
|---|---|
| `tests/index.html` : générateur, calculs, scénario, vidéo, BD, voix | 18/18 |
| `tests/parcours.html` : mission → défi → vidéo → BD → quiz → boss → fin | 62/62 |
| Voix de la vidéo = texte du scénario, minutage 0:00 à 3:10 par segment | oui (test) |
| BD : 8 cases, ≤ 2 bulles et ≤ 25 mots par case, textes et légendes exacts | oui (test) |
| Nombre exact de sacs dessinés : 20 (cases 1, 4, 5, 6), 12 (case 7) | oui (test) |
| Chaque phrase prononcée a son fichier audio | 131/131 (test) |
| Vidéo déroulée en entier (3 min 10), dernière image conforme | oui (accéléré) |

### Défauts trouvés et corrigés pendant les tests
1. Conflit de noms entre la lecture des voix et la sauvegarde (écran vide). Corrigé.
2. `requestAnimationFrame` suspendu quand l'onglet est masqué : éléments de la vidéo restant transparents. Remplacé par un court délai.
3. Flèches de la vidéo partiellement affichées. Regroupées.
4. `ffmpeg` avalait la liste des phrases (3 voix sur 91 au premier essai). Corrigé (`-nostdin`).

### Réserves (à lever avant le pilote)
1. **Écoute réelle de la qualité des voix** : je n'ai pas pu les écouter ; seules la durée et la présence des fichiers sont contrôlées. Tester la compréhension de la voix « siwis » et des variations de hauteur par personnage. Licence de la voix à vérifier avant diffusion publique.
2. **Vidéo : minutage de la voix** : les phrases sont déclenchées aux instants prévus ; si une voix est plus longue que l'intervalle, la phrase suivante la coupe. À contrôler à l'oreille.
3. **Hors ligne non vérifié** (service worker) : à tester sur un vrai Chrome puis sur la tablette.
4. **Poids** : voix 3 Mo environ ; l'application seule reste légère. Mesure sur tablette à faire.
5. **Personnages et décors** : apparence `[À VALIDER]` (relecteur béninois, test enfants).
6. **« Au plus 3 éléments à l'écran »** : respecté par groupes (galettes, annotation, écriture) mais non vérifié automatiquement.
7. Textes `architecte-v0.2` à faire valider par un enseignant.

## Étape suivante
J3 : moteur générique de notion, pour produire les 11 autres notions sans réécrire l'application.
