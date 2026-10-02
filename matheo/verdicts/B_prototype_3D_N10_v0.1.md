# Verdict — Phase B : prototype 3D du défi N10 (v0.1)

**Évaluateur : l'architecte lui-même** (le constructeur évalue sa propre œuvre : limite d'indépendance, décidée par le porteur).

**Périmètre.** Un seul niveau en 3D : le défi de N10 (« 6 rangées de 47 sacs »), dans une scène du marché de Ouidah au coucher du soleil. Le reste du parcours (mission, BD, vidéo, quiz, boss) reste en 2D.

**Fonctionnement.** Les 6 rangées sont numérotées et colorées. À chaque étape réussie du défi, des sacs volent dans la charrette (282 au total) ; à la fin, l'étoile s'allume au centre de la scène. Une erreur ne fait pas avancer la scène. La 3D se coupe toute seule (repli 2D identique côté questions) si le téléphone ne sait pas l'afficher, avec `?2d`, ou en test (`?test`).

**Technique.** Three.js compilé avec esbuild en un seul fichier (`app/js/vendor/marche3d.js`, 553 Ko, ≈ 140 Ko compressé), chargé seulement quand le défi 3D démarre ; source dans `tools/3d/` (`build.ps1`). Aucun modèle téléchargé : tout est fabriqué par code. Poids ajouté à l'application : environ 0,55 Mo.

**Vérifié.** `tests/scene3d.html` (11 contrôles) : scène affichée, image non vide, pas d'avancement sur erreur, avancement à chaque étape, 282 sacs et étoile à la fin, scène détruite en quittant l'écran. Batterie complète : 1269 contrôles sur 17 pages, tous réussis. Déployé et chargé sur une origine neuve (cache v0.5.1 seul).

**NON vérifié (limites).**
1. **Performance sur un vrai téléphone bas de gamme** : aucune mesure (images par seconde, chauffe, batterie). Les tests tournent sur un PC.
2. **Le beau** : mon jugement visuel ne remplace pas celui d'un directeur artistique. Les formes sont simples (low-poly) ; le rendu est chaleureux mais reste « jouet ». Mamie Sègla est sommaire.
3. **Le sentiment des enfants** : aucun test avec de vrais enfants sur cette version.
4. **Mise à jour du cache hors ligne** pour un téléphone qui avait l'ancienne version : l'ordre de nettoyage a été corrigé mais seule l'installation neuve a été vérifiée.
5. **Son** : jamais entendu.

**Décision recommandée.** Ne pas étendre la 3D aux 11 autres notions avant d'avoir (a) mesuré la fluidité sur 2 ou 3 téléphones réels et (b) observé des enfants jouer ce niveau. Si les enfants accrochent, l'étape suivante est un décor 3D par notion (réutilisation du moteur : scène + progression) ; sinon, retravailler le défi lui-même (manipuler, glisser) avant d'investir.
