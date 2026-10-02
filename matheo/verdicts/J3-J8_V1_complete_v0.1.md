# Verdict – Jalons 3 à 8 : V1 complète (12 notions et éléments transversaux) – v0.1

**Livrables** : moteur générique d'étapes et de scènes, 12 notions (N10, N11, N17 à N23, N62 à N64) avec vidéo, BD, quiz, boss et voix ; Épisode 0 et tutoriel ; test de positionnement ; révision ; sujet blanc du CEP ; finale du chapitre Fractions ; « Vérifie ma réponse » ; espace adulte.
**Évaluateur** : Claude (évaluateur unique, par décision du porteur du projet). **Limite d'indépendance** : le même agent a écrit et évalué. Les contrôles sont automatisés et reproductibles pour compenser ; ils ne remplacent ni la porte 4 (humains) ni une relecture indépendante.

## Verdict : APPROUVÉ SOUS RÉSERVES (prêt pour le pilote, pas pour les élèves sans les validations humaines)

### Contrôles réussis (voir `README.md` pour les lancer)
| Contrôle | Résultat |
|---|---|
| Parcours élève automatique, une page par notion (`tests/notion.html?id=…`) : textes exacts, chaque erreur déclenche le message prévu, vidéo, BD, quiz, boss, fin, sauvegarde | réussi pour les 12 notions (70 à 80 contrôles chacune) |
| Opérations posées guidées (`tests/operations.html`) | environ 8 000 multiplications et 8 000 divisions : résultat, quotient, reste et vérification exacts |
| Éléments transversaux (`tests/extras.html`) | 57/57 : positionnement (deux profils), Épisode 0 et tutoriel, finale (verrouillage, réussite, échec), CEP (score, explications), révision, tuteur, espace adulte |
| Parcours N22 d'origine (`tests/parcours.html`) et générateur (`tests/index.html`) | 62/62 et 18/18, inchangés après la refonte |
| Contrôle des contenus (`tests/contenus.html`) | structure en 12 étapes, 8 questions A-D avec trois mauvaises réponses codées E1 à E10 et expliquées, 2 à 6 minutes de vidéo, BD de 4 à 8 cases (≤ 2 bulles, ≤ 25 mots), phrases courtes, interdits, calculs recalculés, voix de chaque phrase |
| Poids | application hors voix : 0,4 Mo ; avec les 1743 voix Piper (mp3) : environ 34 Mo au total (budget : plusieurs Go) ; le premier chargement hors ligne télécharge donc ~34 Mo, à valider sur le réseau réel |
| Accessibilité automatique | zones tactiles portées à 44 px, schémas étiquetés, `lang="fr"`, animations désactivables |

### Défauts trouvés et corrigés pendant les tests
Génération : parts de plus d'un demi-disque mal tracées ; message d'erreur visant la bonne réponse quand le reste vaut 0 ; dernière retenue manquante dans les multiplications posées ; consigne remplaçant trop vite le message de fin d'étape ; temporisations suspendues quand l'onglet est masqué ; choix trop bas sur l'écran. Voix : génération par phrase trop lente, remplacée par une synthèse en un seul chargement du modèle.

### Réserves (à lever avant le pilote)
1. **Porte 4 (humains)** : enseignant béninois, relecteur local, test avec 15 à 20 élèves. Tous les textes de l'architecte portent `architecte-v0.2`. **[HUMAIN]**
2. **Banque d'erreurs** : elle vient du document maître et de la recherche générale, pas de relevés d'enseignants béninois. **[HUMAIN]**
3. **Voix** : jamais écoutées par l'évaluateur (contrôle de présence et de durée seulement) ; voix unique « siwis » modulée par la hauteur ; licence à vérifier avant diffusion publique. **[HUMAIN]**
4. **Hors ligne et performance** : service worker écrit, non testé sur appareil réel ; mesures sur la tablette de référence manquantes. **[HUMAIN]**
5. **Chat guidé du tuteur et suivi par classe** : non faits, car ils exigent un serveur, une clé d'API et un accord de protection des données (voir la feuille de route).
6. **Vidéos et BD** : dessins par code, apparence des personnages `[À VALIDER]` ; le minutage voix/image n'a pas été vérifié à l'oreille.
7. **Seuils** : seuils du positionnement et critères de maîtrise (étoiles) à fixer avec les enseignants.
8. **Multiplicateur à deux chiffres** : la multiplication posée est guidée pour un multiplicateur à un chiffre ; deux chiffres se décomposent (non couvert par un parcours guidé).

## Étape suivante
Ouvrir le pilote supervisé : validation par un enseignant béninois, relecteur local, mesures sur tablette, test avec les élèves ; puis décision sur le serveur (suivi par classe, tuteur par IA).
