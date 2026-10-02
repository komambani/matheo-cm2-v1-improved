# 10 — Direction artistique (v0.1)

Base : propositions MARQUÉES [PROPOSITION] car la bible visuelle originale
(`docs/Bible_visuelle_Matheo_v0.1.md`) existe déjà dans le dépôt source mais
n'a pas encore été relue dans cette itération faute de temps — à vérifier
avant toute production d'assets supplémentaire.

## Référence produite et validée dans cette itération

`ART/bible-visuelle/matheo_turnaround_v1.jpg` — turnaround 4 vues de Mathéo,
généré via Canva IA (`generate_image`, image réelle, 1680×944, JPEG), prompt
conservé pour cohérence future :

> "Character reference sheet, full body, front view, a small glowing fallen
> star character named Mathéo for a premium African-inspired children's
> educational app. He is NOT a robot: he is a tiny warm star-being, softly
> luminous golden-amber light, round friendly shape with small expressive
> arms and legs, two small antenna-like light wisps on top like star rays,
> huge warm expressive eyes, gentle smile, glowing core pulsing with soft
> light. Style: premium stylized 3D-look illustration (Pixar-adjacent
> quality), warm African night sky palette (deep indigo, gold, warm amber),
> clean studio lighting, soft rim light, high detail, consistent character
> design turnaround, plain dark navy background, no text, no watermark"

Vérification visuelle (vision_analyze) : personnage cohérent sur les 4 vues,
palette indigo/or respectée, pas de ressemblance robot/machine — conforme à
`03_MATHEO.md`.

## Palette retenue pour ce parcours démonstrateur (héritée du CSS existant)

L'app originale a déjà une palette cohérente et de qualité
(`app/css/style.css` `:root`) :
- `--nuit: #120d33` / `--nuit2: #1b1446` (fond, ciel nocturne)
- `--or: #ffd166` / `--lumiere: #ffe066` (étoiles, réussite)
- `--turquoise: #6fe3d8` (accent, numérateur dans les vidéos)
- `--terre: #c1440e` (élément chaleureux, Afrique)
- `--creme: #f6ebd3` (cartes, fiches)

[DÉCISION] Cette palette est conservée telle quelle pour la V1 améliorée :
elle est déjà cohérente, déjà premium par rapport à un simple CSS par
défaut, et la retravailler sans retour utilisateur réel serait un risque
inutile (règle §42 du prompt maître : ne jamais faire passer la technologie
avant la pédagogie, et ne pas réinventer ce qui fonctionne déjà).

## Ce qui reste à produire (non fait dans cette itération, à planifier)

- Illustrations de Kola et Anita en turnaround (même méthode que Mathéo).
- Portrait de Mamie Sègla cohérent avec le dessin déjà présent dans
  l'app (visible dans la capture d'écran "Mission" : chapeau turquoise,
  robe orange à pois — ce dessin SVG existant sert de référence de base
  pour toute nouvelle illustration, afin de ne pas introduire
  d'incohérence entre le style SVG actuel et un nouveau style Canva/Midjourney).
- Midjourney n'a pas été utilisé : non disponible dans les outils connectés
  à cette session (seul Canva IA generate_image était disponible et a été
  utilisé réellement). Si Midjourney est requis spécifiquement, il faudra
  provisionner cet accès séparément — non inventé ici.
