# Bible visuelle – Mathéo (nom de travail) – v0.1

Auteur : Claude (architecte). Statut : provisoire, à valider par un relecteur béninois et par un test auprès d'enfants. Hermes et les outils exécutent à la lettre : rien n'est ajouté ni interprété. Toute modification passe par l'architecte.
Références : Bible narrative v0.2 (sections 3, 4, 6), Chaîne éditoriale v0.1 (socle, ligne 3), Scénario pilote N22 v0.1.
Les éléments marqués **[À VALIDER]** sont des choix de l'architecte que la bible narrative ne fixait pas. Ils ne sont pas des faits culturels.

## 1. Principes

1. **Cohérence d'abord** : les cinq personnages gardent les mêmes traits dans toutes les images. Chaque image se génère à partir de la planche de référence du personnage.
2. **Lisible sur tablette de 3 Go** : formes simples, contours nets, peu de détails, fonds sobres. Les objets mathématiques (mangues, sacs, galettes) sont grands, séparés, comptables.
3. **Aucun texte dans les images générées.** Les générateurs d'images écrivent mal. Les nombres, légendes et bulles sont ajoutés ensuite (Canva), mot pour mot depuis le scénario.
4. **Objets exacts** : le nombre d'objets demandé par le scénario est le nombre d'objets dessinés (par exemple 24 mangues distinctes). Le contrôle de la porte 2 les compte.
5. **Respect** : jamais de caricature, de moquerie ni de stéréotype. Proportions naturelles, expressions bienveillantes.
6. **Interdits** (bible narrative, section 6) : violence, peur, marques commerciales, licences existantes, politique, religion, faits culturels non vérifiés.

## 2. Direction artistique **[À VALIDER]**

- **Style** : illustration jeunesse en aplats de couleur, contours doux d'épaisseur régulière, textures légères, lumière chaude de fin de matinée. Aucun réalisme photographique.
- **Palette de base** : ocre doré #D9A441, terre cuite #B5543A, vert manguier #5E8C3A, bleu nuit étoilé #1E2A5A, crème #F6EBD3, jaune lumineux de Mathéo #FFE066 avec halo turquoise #6FE3D8.
- **Cadrage** : plans larges lisibles pour la BD, un seul centre d'intérêt par image, pas plus de 3 éléments mathématiques différents à l'écran.
- **Format** : source en 16:9 (vidéo) ou 4:3 (case de BD), exportée en WebP.

## 3. Fiches personnages (identiques dans tous les épisodes)

**Mathéo.** Petit être de la taille d'une calebasse, lumineux, amical. **[À VALIDER]** : corps rond et doux, grands yeux ronds sombres, deux petites antennes terminées par un point lumineux, pas de bouche détaillée (une petite courbe suffit), halo turquoise léger. Sa couleur dominante est le jaune lumineux. Il flotte à quelques centimètres du sol.
**Anita, 9 ans.** Curieuse, patiente. **[À VALIDER]** : peau brune, cheveux tressés ou attachés, tenue d'écolière simple et colorée (tissu uni), un crayon ou une craie à la main. Regard attentif.
**Kola, 9 ans.** Cousin d'Anita, rapide, blagueur. **[À VALIDER]** : peau brune, cheveux courts, t-shirt vif, sourire large, souvent en mouvement.
**Mamie Sègla.** Commerçante, calme, malicieuse. **[À VALIDER]** : peau brune, foulard de tête et pagne aux motifs simples, sourire en coin. Les motifs du tissu sont à faire relire par le relecteur local avant production.
**Maître Léo.** Instituteur, rare, bienveillant. **[À VALIDER]** : adulte, chemise sobre, expression posée.
**L'enfant joueur** n'est pas dessiné : c'est le joueur.

## 4. Décors et objets de référence

- **Marché de Mamie Sègla (N22)** : étal en bois, balance à plateaux, 24 mangues distinctes, un panier vide, charrette. Décor simple, sans foule dense.
- **Fragment de la boussole de bord** : de la taille d'une paume, brille faiblement, couleur jaune lumineux et turquoise.
- **Autres lieux** : à définir par l'architecte et le relecteur local, un par domaine.

## 5. Prompts Midjourney (v0.1)

Midjourney n'a pas d'API : le porteur du projet colle ces prompts à la main (voir `journal/fiche_passation_midjourney_v0.1.md`). Les prompts sont en anglais, car le générateur le comprend mieux. L'architecte les considère comme **à tester** : le résultat doit correspondre à la section 3. Les options (`--ar`, `--v`, références de personnage ou de style) sont à adapter à la version de Midjourney du porteur.

**Ancre de style (à coller dans chaque prompt)** :
`children's book illustration, flat color shapes, soft even outlines, warm late-morning light, simple background, palette ocher gold, terracotta, mango green, night blue, cream, no text, no letters, no logo, no watermark`

**P1 – Mathéo, planche de référence** :
`character reference sheet, a small glowing friendly alien about the size of a gourd, round soft body, two large round dark eyes, two small antennae ending in glowing dots, tiny curved smile, yellow light with a light turquoise halo, floating slightly above the ground, front view, side view and three-quarter view, neutral light background, [ancre de style] --ar 16:9`

**P2 – Anita, planche de référence** :
`character reference sheet, a nine-year-old Beninese girl, brown skin, braided hair, simple colorful school outfit in plain fabric, holding a piece of chalk, curious and patient expression, natural proportions, respectful and not a caricature, front view, side view and three-quarter view, neutral light background, [ancre de style] --ar 16:9`

**P3 – Kola, planche de référence** :
`character reference sheet, a nine-year-old Beninese boy, brown skin, short hair, bright t-shirt, wide cheerful smile, energetic posture, natural proportions, respectful and not a caricature, front view, side view and three-quarter view, neutral light background, [ancre de style] --ar 16:9`

**P4 – Mamie Sègla, planche de référence** :
`character reference sheet, an elderly Beninese market woman, brown skin, head scarf and simple patterned wrap cloth, calm mischievous smile, warm and kind expression, natural proportions, respectful and not a caricature, front view, side view and three-quarter view, neutral light background, [ancre de style] --ar 16:9`

**P5 – Maître Léo, planche de référence** :
`character reference sheet, a Beninese primary school teacher, adult man, brown skin, simple plain shirt, calm and kind expression, natural proportions, respectful and not a caricature, front view, side view and three-quarter view, neutral light background, [ancre de style] --ar 16:9`

**P6 – Fragment de la boussole** :
`a palm-sized glowing fragment of a spaceship compass, faint yellow and turquoise glow, resting on a simple wooden surface, close view, [ancre de style] --ar 4:3`

**P7 – Marché de Mamie Sègla (scène de la mission N22)** :
`a small village market stall with a wooden counter, a balance with two plates, exactly 24 distinct mango fruits clearly separated and countable, one empty basket, a small cart, simple uncluttered background, no people, [ancre de style] --ar 16:9`

Pour la scène du marché, la porte 2 compte les mangues : le nombre doit être exactement 24. Le porteur régénère l'image tant que ce n'est pas le cas, ou l'architecte demande de composer les mangues dans Canva.

## 6. Procédure et validation

1. Le porteur génère P1 à P7, choisit une variante par prompt et dépose les fichiers dans `livrables/bible_visuelle/` (`BV_P1_matheo_v0.1.png`, etc.).
2. Le contrôleur (Hermes) vérifie : conformité aux fiches de la section 3, absence de texte, absence de marque ou de licence existante.
3. L'architecte approuve ou rejette (verdict dans `verdicts/`).
4. **Un relecteur béninois valide** les tenues, les motifs et le décor.
5. **Test auprès de 15 à 20 élèves** : reconnaissance des personnages, sympathie, lisibilité sur tablette.
6. Une fois validées, les planches sont verrouillées en v1.0 et réutilisées pour toutes les images.

## 7. Points à valider

- Tous les éléments marqués **[À VALIDER]** : apparence de Mathéo, tenues, tissus, coiffures.
- Style général (aplats, palette) contre deux autres styles lors du test auprès des enfants.
- Âge apparent d'Anita et Kola (bible narrative, section 12).

## 8. Journal des modifications

- v0.1 : première version par l'architecte. Prompts à tester.
