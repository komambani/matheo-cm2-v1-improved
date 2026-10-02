// Phrases de Mathéo qui dépendent de nombres. Un seul endroit : l'écran et la voix disent exactement la même chose.
const s = (n) => (n > 1 ? "s" : "");

export function phrasesRemediation(r) {
  const part = r.total / r.den;
  return {
    partage: `Partageons ${r.total} en ${r.den} lots égaux.`,
    questionLot: "Combien dans chaque lot ?",
    lotFaux: "Bip ! Compte les objets d'un seul lot. Réessaie !",
    lotJuste: `${r.total} ÷ ${r.den} = ${part}. Chaque lot a ${part}.`,
    toucher: `Maintenant, touche ${r.num} lot${s(r.num)}.`,
    pasAssezDeLots: `Bip ! Il faut prendre ${r.num} lot${s(r.num)}.`,
    questionTotal: `Combien d'objets dans ${r.num} lot${s(r.num)} ?`,
    totalFaux: `Bip ! Ta méthode est bonne. Refais le calcul : chaque lot a ${part}, et tu prends ${r.num} lot${s(r.num)}.`,
    fini: `${r.total} ÷ ${r.den} = ${part}. Puis ${part} × ${r.num} = ${r.reponse}.`
  };
}
