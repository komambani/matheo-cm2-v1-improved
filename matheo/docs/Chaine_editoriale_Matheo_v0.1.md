# Chaîne éditoriale Mathéo – v0.1

Auteur : Claude (architecte). S'applique à chaque notion, puis à chaque domaine. Hermes et les outils exécutent à la lettre : ils ne sautent aucune étape ni aucune porte de contrôle.
Références : Bible narrative v0.2, Scénario pilote N22 v0.1, fichier de pilotage.

## 1. Socle (une seule fois)

| Livrable | Auteur | Critère de passage |
|---|---|---|
| Bible narrative | Claude | Publiée et versionnée (v0.2) |
| Référentiel validé et programme officiel | Enseignants béninois | Liste des notions validée par écrit, couverture du programme vérifiée |
| Bible visuelle et planche de référence des personnages | Midjourney, piloté par Hermes sur consigne de Claude | Validée par Claude et un relecteur local ; planche réutilisée pour toutes les images |

## 2. Livrables par notion, dans l'ordre

| N° | Livrable | Auteur | Outil | Critère de passage |
|---|---|---|---|---|
| 1 | Fiche de conception | Claude | Texte | Compétence, prérequis, idée-clé, parcours propre à la notion (plus de gabarit identique) |
| 2 | Banque d'erreurs réelles (4 à 6) | Claude, à partir des erreurs recueillies par des enseignants | Texte | Erreurs réelles, codes E1 à E10 |
| 3 | Mission et défi guidé | Claude | Texte | Phrases de 10 mots au plus, aucun calcul montré en mission, échelle d'aide à 5 niveaux, branche B si prérequis faibles |
| 4 | Script de la vidéo (2 à 4 min, sans intrigue) | Claude | Texte | Plan par plan, voix exacte, 3 éléments à l'écran au plus, erreur fréquente et « Pourquoi ? » |
| 5 | Scénario de la BD (4 à 8 cases) | Claude | Texte | 2 bulles et 25 mots par case au plus, objets mathématiques exacts, dernière case = règle, contenu différent de la vidéo |
| 6 | Textes de Mathéo (corrections) | Claude | Texte | Un message par erreur, bienveillant, précis, avec mini-vérification |
| 7 | Quiz A à D, boss, remédiation | Claude | Texte | Mauvaises réponses construites sur les erreurs typiques, calculs vérifiés |
| **Porte 1** | **Scénario verrouillé v1.0** | Claude | Fichier versionné | Les 5 questions de contrôle qualité sont validées, tous les calculs vérifiés ; après verrouillage, plus personne ne modifie |
| 8 | Générateur d'exercices | Hermes (code), sur spécification de Claude | Code | Réponses calculées par le code, mauvaises réponses issues de la banque d'erreurs, tests unitaires, échantillon relu |
| 9 | Illustrations, BD finalisée, voix, vidéo, sous-titres | Hermes avec Midjourney, Blender (rare), Canva, ElevenLabs, Descript | Outils | Texte et nombres identiques au scénario, planche de personnages respectée, poids et format adaptés à la tablette de 3 Go |
| **Porte 2** | **Contrôle des médias** | Qwen3-VL (repli Gemini Flash) et tests automatiques | Vision et code | Nombre d'objets exacts (par exemple 20 sacs, 5 tas), texte conforme, poids, durée, sous-titres synchronisés. Rejet : retour à l'étape 9 |
| 10 | Leçon assemblée dans l'application | Hermes | Application web | Les 5 moments fonctionnent hors ligne sur la tablette de référence |
| 11 | Fiche de révision et QCM de révision | Texte : Claude ; intégration : Hermes | Texte, application | Résumé visuel, exemple, piège fréquent, mini-question de rappel |
| **Porte 3** | **Relecture Claude (API) et tests automatiques** | Claude relecteur | API, budget de 10 € | Relecture sur échantillon ; tout écart par rapport au scénario est rejeté. Rejet : retour à l'étape 10 |
| **Porte 4** | **Validation humaine** | Enseignant béninois, relecteur local, test avec 15 à 20 élèves | Humains | Maths exactes, langue, culture, plaisir et compréhension. Correctifs : retour à l'étape 3 |
| 12 | Pack de contenu par niveau, version signée | Hermes | Dépôt Git | Pack téléchargeable par niveau, empreinte de contrôle, notes de version |

## 3. Livrables par domaine et par niveau

| N° | Livrable | Auteur | Moment |
|---|---|---|---|
| 13a | Boss de domaine et pièce du vaisseau | Claude | Quand toutes les notions du domaine sont verrouillées |
| 13b | Sujets de CEP blancs avec corrections et explications (CM2 seulement) | Claude, corrections par code | Après les domaines concernés |

Mêmes portes de contrôle que pour une notion.

## 4. Règles d'exécution

1. Aucune étape n'est sautée. Chaque livrable porte un statut dans le fichier de pilotage : À faire, En cours, À valider, Validé.
2. Hermes n'invente rien : aucun mot, nombre ou personnage ajouté. Tout écart est rejeté.
3. Chaque rejet est journalisé avec sa cause. Après 3 allers-retours sur un même livrable, l'affaire remonte à Claude dans ce chat.
4. La porte 3 coûte de l'argent : elle ne s'applique qu'aux livrables qui ont passé les portes 1 et 2, et le budget de 10 € est suivi dans le fichier de pilotage.
5. Les humains valident, ils ne réécrivent pas. Un correctif demandé par un humain repasse par Claude.
6. Les scénarios, les médias et le code vivent dans le dépôt Git, avec un numéro de version.

## 5. Correspondance avec le fichier de pilotage

Les colonnes de la feuille « Notions » suivent cette chaîne : fiche de conception (1, 2), validation du référentiel, leçon rédigée (3), script vidéo (4), BD (5), jeu et manipulation, exercices (8), problèmes (7), QCM CEP (13b), corrections et remédiation (6, 7), contrôle qualité (portes 1 à 4).
