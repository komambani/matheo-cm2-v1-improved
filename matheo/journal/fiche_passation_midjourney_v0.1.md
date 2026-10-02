# Fiche de passation manuelle – Midjourney – v0.1

Statut : Midjourney n'a pas d'API officielle, et ses conditions d'utilisation interdisent l'automatisation (vérifié le 2026-10-01). Hermes ne pilote donc **pas** Midjourney. Le porteur du projet génère les images à la main ; Hermes prépare les consignes et contrôle les résultats.

## Qui fait quoi

| Étape | Acteur | Action |
|---|---|---|
| 1 | Hermes (`atelier`) | Lit le scénario verrouillé (`specs/`) et écrit `livrables/<notion>/midjourney_prompts_vX.Y.md` : un prompt par image, repris mot pour mot des descriptions du scénario, avec la référence à la planche des personnages. Aucun élément ajouté. |
| 2 | Porteur du projet | Colle chaque prompt dans Midjourney (web ou Discord), avec la planche de référence des personnages. Choisit la meilleure variante. |
| 3 | Porteur du projet | Télécharge les images retenues, les range dans `livrables/<notion>/images/` et les nomme `<notion>_<numero>_vX.Y.png` (par exemple `N22_bd_case04_v1.0.png`). |
| 4 | Hermes (`controleur`) | Compare chaque image au scénario : nombre d'objets, textes, personnages. Écrit le résultat dans `journal/`. |
| 5 | Hermes (`atelier`) | Convertit en WebP, vérifie le poids, intègre. |

## Règles

- Aucune donnée d'élève, aucun visage réel, aucune marque ni licence existante dans les prompts.
- Un rejet par le contrôleur renvoie à l'étape 2 avec la cause notée. Après 3 allers-retours sur la même image, l'affaire remonte à l'architecte.
- Aucun script, bot ni extension ne doit automatiser l'envoi des prompts ou la récupération des images.
- Le compte Midjourney et ses identifiants restent chez le porteur du projet. Rien n'est stocké sur le serveur.

## À revoir

Si Midjourney publie une API officielle, remplacer cette fiche par une intégration, après décision de l'architecte.
