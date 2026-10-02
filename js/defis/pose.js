// Opérations posées guidées : multiplication par un chiffre et division par un chiffre.
// Une opération posée est transformée en suite de micro-étapes « nombre » (question, réponse, messages d'erreur).
// Les mêmes fonctions servent à l'écran ET à la liste des phrases à prononcer (voix) : aucun écart possible.

const chiffres = (n) => String(n).split("").map(Number);

/** Multiplication posée a × b (b : un chiffre). Renvoie les micro-étapes. */
export function etapesMultiplication(a, b) {
  const ds = chiffres(a).reverse(); // du chiffre des unités vers la gauche
  const etapes = [];
  const resultat = []; // chiffres du résultat écrits (de droite à gauche)
  let retenue = 0;
  const retenues = {};
  ds.forEach((d, i) => {
    const nom = ["unités", "dizaines", "centaines", "milliers"][i] || "colonne suivante";
    const prod = d * b;
    const total = prod + retenue;
    const ecrit = total % 10;
    const nouvelle = Math.floor(total / 10);
    const etat = (extra = {}) => ({ t: "pose", a, b, resultat: resultat.slice(), retenues: { ...retenues }, actif: i, ...extra });

    etapes.push({
      intro: i === 0 ? `Posons ${a} × ${b}. On commence par les unités.` : `Colonne des ${nom}.`,
      question: `Calcule ${d} × ${b}.`, reponse: prod, visuel: etat(),
      erreurs: [{ reponses: [d + b], texte: `Bip ! ${d} + ${b}, c'est une addition. Ici, on multiplie : ${d} × ${b}.` }],
      retour_defaut: `Bip ! Ta méthode est bonne. Vérifie ton calcul : ${d} × ${b}. Tu peux compter de ${d} en ${d}.`
    });
    if (retenue > 0) {
      etapes.push({
        question: `Ajoute la retenue ${retenue} : ${prod} + ${retenue}.`, reponse: total, visuel: etat(),
        erreurs: [{ reponses: [prod], texte: `Bip ! Tu as oublié la retenue de ${retenue}. Ajoute-la : ${prod} + ${retenue}.` }],
        retour_defaut: `Bip ! Vérifie ton addition : ${prod} + ${retenue}.`
      });
    }
    const lastDigit = i === ds.length - 1;
    if (!lastDigit || nouvelle > 0) {
      etapes.push({
        question: `Quel chiffre écris-tu dans la colonne des ${nom} ?`, reponse: ecrit, visuel: etat(),
        erreurs: total >= 10 ? [{ reponses: [total], texte: `Bip ! On écrit un seul chiffre par colonne : le chiffre des unités de ${total}, c'est ${ecrit}. Les dizaines deviennent la retenue.` }] : [],
        retour_defaut: `Bip ! Regarde ${total} : le chiffre des unités est ${ecrit}.`
      });
    } else {
      etapes.push({ question: `Écris ${total} tout à gauche. Quel nombre écris-tu ?`, reponse: total, visuel: etat(), erreurs: [], retour_defaut: `Bip ! Il n'y a plus de colonne à multiplier : on écrit ${total}.` });
    }
    resultat.push(ecrit);
    if (nouvelle > 0 && lastDigit) {
      etapes.push({
        question: `Écris aussi la retenue ${nouvelle} tout à gauche. Quel chiffre écris-tu ?`, reponse: nouvelle, visuel: { t: "pose", a, b, resultat: resultat.slice(), retenues: { ...retenues }, actif: i + 1 },
        erreurs: [], retour_defaut: `Bip ! Il n'y a plus de colonne à multiplier : on écrit la retenue ${nouvelle} tout à gauche.`
      });
      resultat.push(nouvelle);
    }
    if (nouvelle > 0 && !lastDigit) {
      retenue = nouvelle; retenues[i + 1] = nouvelle;
      etapes.push({
        question: `Quelle retenue gardes-tu pour la colonne suivante ?`, reponse: nouvelle, visuel: { t: "pose", a, b, resultat: resultat.slice(), retenues: { ...retenues }, actif: i },
        erreurs: [{ reponses: [ecrit], texte: `Bip ! ${ecrit}, c'est le chiffre écrit. La retenue, ce sont les dizaines de ${total} : ${nouvelle}.` }],
        retour_defaut: `Bip ! La retenue, ce sont les dizaines de ${total} : ${nouvelle}.`
      });
    }
    if (nouvelle === 0) retenue = 0;
  });
  return etapes;
}

/** Résultat de a × b par la méthode posée (pour contrôler les contenus). */
export const produit = (a, b) => a * b;

/** Division posée a ÷ d (d : un chiffre), chiffre par chiffre. Renvoie les micro-étapes. */
export function etapesDivision(a, d) {
  const ds = chiffres(a);
  const etapes = [];
  let cur = 0, demarre = false, quotient = "";
  const lignes = [];
  const etat = (extra = {}) => ({ t: "division", a, d, quotient, lignes: lignes.slice(), ...extra });
  ds.forEach((c, i) => {
    cur = cur * 10 + c;
    if (!demarre && cur < d) {
      if (i < ds.length - 1) return; // on prendra le chiffre suivant
    }
    demarre = true;
    const q = Math.floor(cur / d);
    const prod = q * d;
    const reste = cur - prod;
    const intro = etapes.length === 0
      ? (i === 0 ? `On prend ${cur}.` : `${ds[0]} est plus petit que ${d} : on prend ${cur}.`)
      : `On abaisse ${c} : on prend ${cur}.`;
    etapes.push({
      intro, question: `Combien de fois ${d} dans ${cur} ?`, reponse: q, visuel: etat({ courant: cur }),
      erreurs: [
        { reponses: [q + 1], texte: `Bip ! ${q + 1} × ${d} = ${(q + 1) * d}, c'est plus que ${cur}. Essaie un nombre plus petit.` },
        ...(q > 0 ? [{ reponses: [q - 1], texte: `Bip ! Tu peux en mettre plus. Avec ${q - 1}, il resterait ${cur - (q - 1) * d}, et c'est trop : le reste doit être plus petit que ${d}.` }] : [])
      ],
      retour_defaut: `Bip ! Cherche le plus grand nombre de fois ${d} qui ne dépasse pas ${cur}. Pense à la table de ${d}.`
    });
    etapes.push({
      question: `Calcule ${q} × ${d}.`, reponse: prod, visuel: etat({ courant: cur, q }),
      erreurs: [{ reponses: [q + d], texte: `Bip ! ${q} + ${d}, c'est une addition. Ici, on multiplie : ${q} × ${d}.` }],
      retour_defaut: `Bip ! Vérifie ton calcul : ${q} × ${d}.`
    });
    etapes.push({
      question: `Calcule ${cur} − ${prod}.`, reponse: reste, visuel: etat({ courant: cur, q, prod }),
      erreurs: [{ reponses: [prod], texte: `Bip ! ${prod}, c'est ce qu'on a partagé. Le reste, c'est ${cur} − ${prod}.` }],
      retour_defaut: `Bip ! Vérifie ta soustraction : ${cur} − ${prod}.`
    });
    quotient += String(q);
    lignes.push(`${prod}`, `${reste}`);
    cur = reste;
  });
  const q = Math.floor(a / d), r = a % d;
  etapes.push({ question: `Quel est le quotient de ${a} ÷ ${d} ?`, reponse: q, visuel: etat(), erreurs: [{ reponses: [r], texte: `Bip ! ${r}, c'est le reste. Le quotient, ce sont les chiffres écrits sous le diviseur : ${q}.` }], retour_defaut: `Bip ! Lis le résultat écrit sous le diviseur : ${q}.` });
  etapes.push({ question: `Quel est le reste ?`, reponse: r, visuel: etat(), erreurs: [{ reponses: [q], texte: `Bip ! ${q}, c'est le quotient. Le reste est la dernière soustraction : ${r}.` }], retour_defaut: `Bip ! Le reste est la dernière soustraction : ${r}.` });
  etapes.push({ question: `Vérifions : ${q} × ${d} + ${r}. Que trouves-tu ?`, reponse: q * d + r, visuel: etat(), erreurs: [{ reponses: [q * d], texte: `Bip ! N'oublie pas d'ajouter le reste : ${q * d} + ${r}.` }], retour_defaut: `Bip ! Calcule ${q} × ${d} = ${q * d}, puis ajoute le reste ${r}.` });
  return etapes;
}

/** Développe une étape « pose » ou « division » en micro-étapes « nombre ». */
export function developper(s) {
  // Un message d'erreur ne doit jamais viser la bonne réponse (ex. reste égal à 0).
  const net = (e) => ({ type: "nombre", ...e, erreurs: (e.erreurs || []).filter((x) => !x.reponses.includes(e.reponse)) });
  if (s.type === "pose") return etapesMultiplication(s.a, s.b).map(net);
  if (s.type === "division") return etapesDivision(s.a, s.d).map(net);
  return [s];
}
