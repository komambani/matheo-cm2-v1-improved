# Mathéo (nom de travail) – application de maths pour le CM2 au Bénin

Dépôt privé du projet. Architecte : Claude. Exécutant : Hermes Agent. Porteur du projet : voir le fichier de pilotage.

## Pour commencer (Hermes)
1. Lire `docs/Architecture_et_execution_Hermes_v0.1.md`, puis les autres documents du dossier `docs/`.
2. Appliquer les règles d'exécution à la lettre. Rien n'est inventé, rien n'est dépensé sans approbation du porteur du projet.
3. Commencer par la mission M0 et rendre compte selon le format de la section 10 du document d'architecture.

## Structure
- `docs/` : documents de référence (bible narrative, chaîne éditoriale, plan V1, architecture, scénario pilote N22, document maître, fichier de pilotage).
- `specs/` : scénarios verrouillés par notion. Le scénario N22 y sera déplacé après son verrouillage en v1.0.
- `livrables/` : médias et packs en cours de production.
- `verdicts/` : verdicts d'approbation ou de rejet de Claude.
- `app/` : code de l'application web.
- `tools/` : générateurs d'exercices et scripts.
- `journal/` : rapports et décisions.
- `releases/` : packs de contenu signés.

## Lancer, tester, produire (V1)

L'application est une PWA sans dépendance : aucun `npm`, aucune compilation.

| Besoin | Commande ou page |
|---|---|
| Lancer l'application en local | `powershell -File tools\serve.ps1` puis ouvrir http://localhost:8080/app/ |
| Contenus d'une notion | `app/content/nXX.json` (scénario, quiz, boss, vidéo, BD en données) ; la liste est dans `app/content/index.json` |
| Tests du générateur et de N22 | http://localhost:8080/tests/ et `tests/parcours.html` |
| Parcours élève automatique d'une notion | `tests/notion.html?id=N17` (joue la notion comme un enfant, erreurs volontaires comprises) |
| Opérations posées (multiplication, division) | `tests/operations.html` (≈ 16 000 opérations vérifiées) |
| Éléments transversaux (positionnement, épisode 0, révision, CEP, finale, tuteur, espace adulte) | `tests/extras.html` |
| Contrôle de toutes les contenus (structure, langue, calculs, voix) | `tests/contenus.html` |
| Régénérer les voix (Piper, gratuit) | ouvrir `tools/voix/lister.html` puis `powershell -File tools\voix\generer_voix.ps1` (incrémental) |

Ajouter une notion : écrire `app/content/nXX.json` sur le modèle de `n17.json`, l'ajouter à `index.json`, lancer `tests/notion.html?id=NXX`, générer les voix, lancer `tests/contenus.html`.

## Règles
- **Aucun secret dans le dépôt** (clés d'API, mots de passe, jetons). Le fichier `.env` est exclu par `.gitignore`.
- **Aucune donnée personnelle d'élève** dans le dépôt, les journaux ou les tests.
- Un commit par livrable, avec un message clair et un numéro de version dans le nom du fichier.
