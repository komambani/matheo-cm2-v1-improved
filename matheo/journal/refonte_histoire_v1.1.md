# Refonte de l'histoire et du rythme — V1.1 (v0.1)

**Origine.** Test avec de vrais enfants (retour du porteur) : « jeu pas esthétique, pas envoûtant », « histoire bizarre », « pas de vidéo ni de BD, des questions-réponses ennuyeuses », « abandon rapide ». Cause mesurée dans le code : la vidéo et la BD venaient *après* le défi, donc personne n'y arrivait.

**Ce qui est déjà fait (A.1, A.2).** Nouvel ordre : mission → BD → vidéo → défi → quiz → boss. Carte en « chemin d'étoiles » (la prochaine étoile pulse, les étoiles gagnées s'allument) à la place de la liste de boutons.

## 1. L'histoire : « La Nuit des douze étoiles »

**En une phrase.** Cette nuit, les douze étoiles de la Grande Pirogue du ciel se sont éteintes au-dessus du village ; Mathéo, une petite étoile tombée dans la cour d'Anita et Kola, doit les rallumer une à une en résolvant les problèmes des habitants… et découvrir pourquoi elles se sont éteintes.

**Pourquoi ça marche pour des enfants du Bénin.** Les contextes (marché, pirogues, tissage, zémidjans, arachides, mangues) ne sont plus des « énoncés » : ce sont les lieux où chaque étoile se cache. La légende de la Grande Pirogue est racontée par Mamie Sègla (autorité affective, tradition orale).

**Le mystère (fil rouge).** Chaque étoile rallumée révèle un indice : une *plume de lumière*. Les douze plumes, assemblées, forment une carte. Les enfants se demandent : qui a éteint le ciel ?

**Révélation finale (étoile 12, finale des Fractions).** Personne n'a volé les étoiles : elles se sont éteintes parce que Mathéo lui-même, la treizième étoile, manquait à la Pirogue. En les rallumant il a compris qui il est. Choix de fin : il retourne dans le ciel **mais** garde un fil de lumière avec les enfants — il reste leur guide (porte d'entrée vers une V2). Fin émouvante, sans méchant, sans violence (cf. bible narrative, interdits).

**Pas de méchant.** À la place : un « Nuage-Paresse » comique qui souffle sur les étoiles quand on abandonne. Il fait peur « pour rire », et fond quand l'enfant réussit. Il donne un enjeu à chaque défi sans jamais punir.

## 2. Les douze étoiles (un lieu, un personnage, une mini-intrigue)

| Étoile | Notion | Lieu | Mini-intrigue (accroche de la BD) |
|---|---|---|---|
| 1 | N10 Multiplier | Le marché de Ouidah | Mamie Sègla doit compter ses sacs avant que la nuit tombe ; le Nuage-Paresse cache le dernier sac. |
| 2 | N11 Diviser | La plage des pêcheurs | Le poisson du jour doit être partagé en parts égales entre les pirogues, sinon la dispute éclate. |
| 3 | N17 Comprendre une fraction | La cuisine de Mamie | Le gâteau de la fête est tombé en morceaux : combien de parts, et quelle part pour qui ? |
| 4 | N18 Représenter une fraction | L'atelier du tisserand | Le pagne de fête a besoin de bandes colorées en parts égales. |
| 5 | N19 Lire et écrire | L'école de Maître Léo | Un message d'étoile est écrit en fractions, il faut le déchiffrer. |
| 6 | N20 Comparer | Le concours de cuisine | Qui a la plus grande part ? Le jury hésite. |
| 7 | N21 Équivalentes | Le pont du fleuve | Deux chemins différents mènent au même endroit : 1/2 = 2/4. |
| 8 | N22 Fraction d'une quantité | Le champ de mangues | Anita doit livrer les 3/4 de la récolte. |
| 9 | N23 Problèmes avec fractions | La fête du village | Le grand problème de la soirée : tout doit être prêt avant minuit. |
| 10 | N62 Repérer les données utiles | La bibliothèque cachée | Un vieux message mélange vrai et faux : que garder ? |
| 11 | N63 Ce qu'on cherche | La grotte aux échos | L'écho répète la question : que cherche-t-on vraiment ? |
| 12 | N64 Choisir l'opération | La Grande Pirogue | Pour rallumer la dernière étoile, il faut choisir la bonne opération. |

## 3. Le rythme d'une étoile (3 à 5 minutes, jamais plus de 20 secondes sans action)

1. **Accroche (15 s)** : une réplique + une image forte + un son. Pas de cours.
2. **BD en 4 cases** : le problème de l'étoile devient une aventure, avec un petit cliffhanger.
3. **Vidéo de cours courte (≤ 90 s)** : Maître Léo ou Mamie, au tableau, avec animation.
4. **Défi = un jeu**, pas un questionnaire : manipuler, glisser, construire. Chaque réussite fait avancer quelque chose de visible (l'étoile s'allume peu à peu).
5. **Quiz rapide (4 questions au lieu de 8)**, chacune récompensée tout de suite.
6. **Boss** : le Nuage-Paresse. S'il est battu, l'étoile s'allume (animation + son + plume de lumière).

Règles de conception, issues du retour des enfants :
- Récompense visible et sonore *toutes les 20 secondes*.
- Aucun écran de texte seul.
- Un enfant qui échoue deux fois est aidé avec une tournure encourageante, jamais bloqué.
- Le premier écran jouable arrive en moins de 10 secondes après l'ouverture.

## 4. Pour la phase B (3D)

Un seul niveau complet en 3D, avant d'étendre : l'étoile 1 (le marché de Ouidah). Technique : Three.js dans le navigateur, modèles légers (< 3 Mo par scène), repli 2D automatique si le téléphone est trop faible.

## 5. Limites

- Cette histoire est **mon écriture** : elle doit être relue par un enseignant béninois (noms, légendes, respect des traditions) avant diffusion.
- Réécrire les 12 notions et régénérer leurs voix (plusieurs centaines de phrases) prend du temps : à faire notion par notion, en commençant par N10.
