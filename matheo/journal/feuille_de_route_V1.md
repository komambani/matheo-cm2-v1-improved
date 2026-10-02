# Feuille de route V1 – Mathéo

Tenue par l'architecte-évaluateur. Dernière mise à jour : fin de la production automatisable de la V1.

## Principe de production

Tout ce qui peut être produit sans compte, sans clé et sans dépense l'a été par code : illustrations et animations en SVG, sons générés, voix Piper (gratuit, local), textes de scénario, générateurs d'exercices, tests automatiques. Rien d'autre n'est inventé : ce qui exige des humains est marqué **[HUMAIN]** et reste « en attente ».

## État du périmètre V1 (plan de contenu V1 v0.1)

| Élément du plan | État |
|---|---|
| 12 notions complètes : N10, N11, N17 à N23, N62 à N64 | **Produites et testées** : mission, défi guidé avec échelle d'aide à 5 niveaux, remédiation, vidéo animée, BD, quiz A-D (8 questions), boss, fiche de révision, voix |
| Épisode 0 (BD d'arrivée) et tutoriel d'utilisation | **Produits** (5 cases, tutoriel de 3 gestes) |
| Test de positionnement (≈ 15 questions) | **Produit** (15 questions, 4 compétences, orientation vers une notion) ; seuils **[HUMAIN]** |
| Boss du domaine Fractions et finale du chapitre | **Produits** (verrouillée tant que N17 à N23 ne sont pas réussies) |
| Rubrique Révision (fiche + QCM mélangés et espacés) | **Produite** (pondérée par les erreurs de l'enfant) |
| Rubrique Prépare le CEP (sujet blanc, correction automatique, explication des erreurs) | **Produite** (1 sujet blanc de 10 questions) |
| Mathéo tuteur : indices, « Vérifie ma réponse » | **Produits** (échelle d'aide, vérificateur pas à pas) ; **chat guidé : non fait** (voir ci-dessous) |
| Tableau de bord enseignant minimal | **Produit sur l'appareil** (progression par notion, erreurs fréquentes, export anonyme) ; **suivi par classe : non fait** (voir ci-dessous) |

## Ce qui n'est pas fait, et pourquoi

1. **Chat guidé du tuteur** (modèle de langage via la passerelle IA) : il exige un serveur de production, une clé d'API et des garde-fous testés. L'architecture l'interdit en direct depuis l'application. **[HUMAIN + serveur]**
2. **Suivi par classe et comptes** : il exige un serveur, un hébergement et un accord de protection des données. En V1, aucune donnée ne quitte l'appareil. **[HUMAIN + serveur]**
3. **Validations de la porte 4** : enseignant béninois (exactitude, vocabulaire, niveau, fréquence réelle des erreurs), relecteur local (décor, noms, tenues, nourriture), test avec 15 à 20 élèves. **[HUMAIN]**
4. **Mesures sur la tablette de référence** (3 Go de RAM) : temps de chargement, mémoire, fluidité, mode hors ligne réel. **[HUMAIN]**
5. **Écoute et choix des voix** : la voix Piper « siwis » est gratuite mais peu expressive ; sa licence est à vérifier avant diffusion publique. **[HUMAIN]**
6. **Fusion des pull requests** dans `main` : réservée au porteur du projet (refusée à l'agent).
7. **Services avec compte** (Midjourney, ElevenLabs, Descript, Laguna) : non utilisés ; remplacés par SVG et Piper.

## Risques connus

- Tous les textes écrits par l'architecte portent la marque `architecte-v0.2` ou `[À VALIDER]` : ils attendent la porte 4.
- Les erreurs types viennent du document maître, pas de relevés d'enseignants : la banque d'erreurs est à confronter à la réalité.
- Les apparences des personnages et la palette sont des propositions (bible visuelle v0.1).
