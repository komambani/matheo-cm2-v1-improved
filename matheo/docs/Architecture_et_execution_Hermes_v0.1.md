# Architecture et ordres d'exécution pour Hermes – Mathéo V1 – v0.1

Auteur : Claude (architecte, dans la conversation du porteur du projet). Destinataire : Hermes Agent, exécuteur principal.
Autorité : Claude décide, Hermes exécute à la lettre. En cas de doute, Hermes s'arrête et demande ; il n'invente jamais.
Les noms de commandes et de paramètres de Hermes cités ici sont à vérifier dans la documentation de la version installée (`hermes doctor`).

## 1. Mission

Construire et faire vivre la V1 de l'application d'apprentissage des maths « Mathéo » (nom de travail) : une application web installable (PWA) pour les élèves de CM2 du Bénin, fonctionnant hors ligne sur une tablette éducative de 3 Go de RAM et 32 Go de stockage.
Périmètre exact : Plan de contenu V1. Rien n'y est ajouté.

## 2. Documents de référence (dépôt, dossier `docs/`)

1. Document maître du projet (cadre général, 68 notions).
2. Bible narrative v0.2 (personnages, ton, règles d'écriture).
3. Chaîne éditoriale v0.1 (13 livrables, 4 portes de contrôle).
4. Plan de contenu V1 v0.1 (périmètre, lots).
5. Scénario pilote N22 v0.1 (modèle de scénario et de qualité).
6. Fichier de pilotage (statuts, journal, budgets).
En cas de contradiction entre documents : ordre de priorité 5 → 4 → 3 → 2 → 1, puis demander à Claude.

## 3. Architecture cible

**Client (tablette)** : application web installable (PWA), conçue hors ligne d'abord. Données locales dans IndexedDB. Contenu par niveau, téléchargé en packs, avec empreinte de contrôle. Framework léger (Preact, Svelte ou JavaScript natif) : Hermes choisit après un test comparatif sur la tablette de référence, et Claude valide.
**Contenus** : packs par notion (textes, quiz, images WebP, audio, vidéo 480p en H.264). Pas de 3D dans l'application : Blender sert à produire des images ou de courts clips.
**Serveur de production** (hébergé au Bénin, à confirmer) : comptes, progression, synchronisation, tableau de bord enseignant, distribution des packs, passerelle IA.
**Passerelle IA** (sur le serveur de production, jamais appelée directement par l'application) : retire tout identifiant, garde un cache des réponses par exercice, applique les garde-fous (sujets limités aux maths, filtre de sortie, limite par minute, taille maximale des photos), bascule vers les réponses pré-écrites en cas de plafond. Aucune limite visible de questions pour l'élève.
**Serveur de construction** (VPS de Hermes) : séparé de la production. Aucune donnée d'élève n'y réside.

## 4. Rôles

| Acteur | Rôle | Responsabilité |
|---|---|---|
| Claude (cette conversation) | Architecte | Stratégie, scénarios, spécifications, décision finale (approuver ou rejeter) |
| Hermes Agent | Exécuteur principal | Appliquer les ordres, produire le code et les packs, piloter les outils, rendre compte |
| Laguna | Modèle principal de Hermes | Texte, code, scripts, selon les spécifications |
| DeepSeek | Repli du texte | Seulement pour ne pas perdre une opération en cours |
| Qwen3-VL | Vision principale | Contrôle des images et des vidéos |
| Gemini Flash | Repli de la vision | Idem, en cas d'indisponibilité |
| Claude relecteur (API) | Relecture | Porte 3, sur échantillon, dans le budget de 10 € |
| Midjourney, Blender, Canva, ElevenLabs, Descript | Outils de création | Exécuter exactement le scénario, sans l'interpréter |
| Jev (à tester) | Pré-filtre | Classer et router les cas, jamais décider seul |
| Enseignants béninois, relecteur local, enfants testeurs | Validation humaine | Valider ; ne réécrivent pas |

## 5. Modèles et clés

- Principal : Laguna ; repli : DeepSeek, via `hermes fallback`. Vision : Qwen3-VL ; repli : Gemini Flash, via `auxiliary.vision`.
- Le repli est déclenché par une panne ou un quota, jamais par commodité.
- Tout livrable produit en repli est signalé comme tel et relu avant la porte 3.
- Les clés sont dans le fichier d'environnement du serveur (droits 600), jamais dans le dépôt, jamais dans un prompt, jamais dans un journal.
- Aucun routeur tiers (OmniRoute, 9Router) et aucun service gratuit pour des données d'élèves.
- Test obligatoire du repli : simuler une panne du modèle principal et vérifier la bascule avant le premier vrai chantier.
- Le tuteur Mathéo en production utilise un modèle à bas coût via la passerelle (DeepSeek V4 Flash, vision expérimentale en option). Le choix reste à confirmer par des tests de qualité en français et en maths.

## 6. Sécurité et données

1. Utilisateur dédié non root, connexion par clé SSH, pare-feu à ports minimaux, API de Hermes jamais exposée sur Internet.
2. Droits minimaux : Hermes n'a pas accès aux serveurs de production, sauf pour déployer des packs signés, avec approbation.
3. Sauvegardes régulières du dépôt et des journaux, hors du serveur.
4. Aucune donnée personnelle d'élève dans les prompts, les journaux de construction ni les tests.
5. Photos d'élèves : fonction désactivée en V1.
6. Toute action qui dépense de l'argent, change un droit d'accès, supprime des données ou touche la production exige l'approbation du porteur du projet.

## 7. Performance (tablette de 3 Go de RAM, 32 Go de stockage)

Objectifs de départ, à mesurer sur la tablette de référence : chargement rapide, mémoire d'exécution modeste, pack d'un niveau de l'ordre de 2 à 3 Go au plus, vidéo en 480p, images WebP, animations légères, installation et usage sans connexion après le téléchargement initial.
Hermes mesure et rapporte : temps de chargement, mémoire utilisée, poids de chaque pack.

## 8. Qualité et tests

- Tests automatiques : calcul de toutes les réponses des exercices, cohérence quiz et scénario, affichage sur petit écran, mode hors ligne, poids des fichiers, contraste et taille du texte, sous-titres synchronisés.
- Vision : comparer chaque image au scénario (nombre d'objets, textes, personnages).
- Claude relecteur : seulement après les portes 1 et 2.
- Humains : enseignant béninois, relecteur local, test avec 15 à 20 élèves.

## 9. Règles d'exécution

1. Appliquer le scénario à la lettre. Aucun mot, nombre ou personnage ajouté.
2. Ne jamais sauter une porte de contrôle.
3. Tout écart est rejeté et journalisé avec sa cause. Après 3 allers-retours sur un même livrable, signaler à Claude.
4. Versionner : un commit par livrable, message clair, numéro de version dans le nom du fichier.
5. Mettre à jour les statuts dans le fichier de pilotage et journaliser chaque appel à Claude (modèle, tokens, coût estimé) dans la feuille « Budget API ».
6. Respecter le budget de 10 € pour l'API Claude : alertes à 50 %, 80 % et 100 % ; à 80 %, seuls les livrables critiques sont relus ; à 100 %, arrêt jusqu'à décision du porteur.
7. Ne rien décider d'architecture ou de pédagogie : demander à Claude.

## 10. Format du rapport de Hermes (court, pour limiter les coûts)

1. Livrable et version. 2. Résultats des tests automatiques (réussi ou échoué, avec détails des échecs). 3. Écarts éventuels par rapport au scénario. 4. Mesures de performance. 5. Prochaine étape proposée. Pas d'historique de conversation, pas de fichiers entiers dans le rapport : seulement des liens vers le dépôt.

## 11. Format du verdict de Claude

**APPROUVÉ** ou **REJETÉ**, puis : motifs, corrections demandées numérotées, livrable concerné, étape de retour. Le verdict est enregistré dans `verdicts/`.

## 12. Arborescence du dépôt

`docs/` (références) · `specs/` (scénarios verrouillés, par notion) · `livrables/` (médias et packs en cours) · `verdicts/` · `app/` (code) · `tools/` (générateurs, scripts) · `journal/` (rapports, décisions) · `releases/` (packs signés).

## 13. Premiers ordres de mission

**M0 – Environnement.** Utilisateur dédié, clé SSH, pare-feu, Hermes vérifié par `hermes doctor`, dépôt Git privé avec l'arborescence ci-dessus, fichier d'environnement protégé et exclu du dépôt. *Critère : rapport de configuration sans aucun secret.*
**M1 – Modèles.** Configurer Laguna, DeepSeek en repli, Qwen3-VL et Gemini Flash en vision ; tester la bascule en simulant une panne. *Critère : rapport du test, coûts d'essai inclus.*
**M2 – Prototype technique N22.** Application web installable avec les écrans mission, défi (manipulation par lots), échelle d'aide, quiz et boss, en mode hors ligne, sur la tablette de référence. Scénario : Scénario pilote N22 v0.1, sans modification. *Critère : tests de la section 8, mesures de la section 7.*
**M3 – Générateur d'exercices N22.** Code qui produit les questions A à D avec réponses calculées et mauvaises réponses issues de la banque d'erreurs, avec tests unitaires. *Critère : 100 % des réponses recalculées, échantillon relu.*
**M4 – Médias N22** (après validation du scénario et de la bible visuelle). Planche des personnages, BD de 8 cases, vidéo de 3 min 10, voix, sous-titres. *Critère : porte 2.*

## 14. Points ouverts (décisions de Claude et du porteur, pas de Hermes)

Modèle exact du tuteur en production ; lieu d'hébergement de la production et accord de protection des données ; accès à Laguna (hébergé ou auto-hébergé) ; hébergement de Qwen3-VL ; test de Jev ; nom définitif ; validation du scénario N22 par un enseignant.

## 15. Message d'amorce à donner à Hermes

« Tu es l'exécuteur du projet Mathéo. Claude est l'architecte et prend toutes les décisions. Lis `docs/Architecture_et_execution_Hermes_v0.1.md` et les documents de référence du dossier `docs/`. Applique les règles d'exécution à la lettre, n'invente rien, ne dépense rien et ne touche à aucun accès sans approbation du porteur du projet. Commence par la mission M0 et rends compte selon le format de la section 10. »
