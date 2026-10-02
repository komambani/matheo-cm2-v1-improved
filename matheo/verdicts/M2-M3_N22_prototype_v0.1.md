# Verdict – M2 (prototype technique N22) et M3 (générateur N22) – v0.1

**Livrable** : `app/` (PWA N22), `app/js/generators/fractions.js`, `app/content/n22.json`, `tests/`.
**Évaluateur** : Claude (évaluateur unique, par décision du porteur du projet). **Limite d'indépendance** : le même agent a écrit et évalué ce livrable. Les contrôles ci-dessous sont automatisés et reproductibles pour compenser ; ils ne remplacent ni la porte 4 (humains) ni une relecture indépendante.

## Verdict : APPROUVÉ SOUS RÉSERVES

### Contrôles réussis
| Contrôle | Résultat |
|---|---|
| `tests/index.html` : générateur, calculs, cohérence du scénario | 14/14 |
| `tests/parcours.html` : parcours élève complet, textes exacts, erreurs du scénario, quiz 8/8, boss, sauvegarde | 43/43 |
| Réponses recalculées par le code (2000 questions de niveaux A à D) | 100 % |
| 24 mangues distinctes et comptables (scène et manipulation) | oui |
| Aucune donnée personnelle dans la sauvegarde locale | oui |
| Textes du scénario repris mot pour mot | oui (les ajouts sont marqués `architecte-v0.2` dans le JSON) |

### Défaut trouvé et corrigé pendant les tests
Le générateur pouvait produire deux choix identiques aux niveaux A et D (cas de la moitié). Corrigé, test ajouté.

### Réserves (à lever avant le pilote)
1. **Hors ligne non vérifié.** Le service worker est écrit mais n'a pas pu être testé dans le navigateur de développement. À tester sur un vrai Chrome, puis sur la tablette de référence.
2. **Performance non mesurée** (temps de chargement, mémoire, poids) : tablette de référence requise. Poids actuel de l'application : quelques dizaines de Ko hors icônes.
3. **Textes écrits par l'architecte** (`architecte-v0.2`) : messages d'erreur généralisés, retours du quiz, message 72 du boss, texte de l'aide 5. À valider par un enseignant béninois.
4. **Voix** : lecture prévue (Piper), fichiers audio non encore générés. Le texte reste affiché.
5. **Vidéo et BD de N22** : non incluses dans ce jalon (M4).
6. **Apparence des personnages** : `[À VALIDER]` (bible visuelle v0.1).
7. **Accessibilité** : cibles tactiles ≥ 52 px, contrastes élevés, animations désactivables ; à contrôler sur appareil réel.

## Étape suivante
Jalon 2 : voix Piper, vidéo animée de 3 min 10 et BD de 8 cases en SVG, selon le scénario N22.
