// Tests automatiques N22 : calculs exacts, cohérence du contenu et du générateur.
import { creerAlea, creerQuestion, fractionDe, reponsesFausses, messageErreur } from "../app/js/generators/fractions.js";

export async function lancerTests(chargerContenu) {
  const resultats = [];
  const test = (nom, fn) => {
    try { fn(); resultats.push({ nom, ok: true }); }
    catch (e) { resultats.push({ nom, ok: false, detail: String(e.message || e) }); }
  };
  const verifier = (cond, msg) => { if (!cond) throw new Error(msg); };
  const contenu = await chargerContenu();

  test("fractionDe calcule 3/4 de 24 = 18", () => {
    const r = fractionDe(24, 3, 4);
    verifier(r.part === 6 && r.reponse === 18, `obtenu ${JSON.stringify(r)}`);
  });

  test("fractionDe refuse un total non divisible", () => {
    let leve = false;
    try { fractionDe(25, 3, 4); } catch { leve = true; }
    verifier(leve, "aucune erreur levée");
  });

  test("2000 questions (niveaux A à D) : réponse exacte, une seule bonne réponse, choix distincts", () => {
    for (const niveau of ["A", "B", "C", "D"]) {
      for (let graine = 1; graine <= 500; graine++) {
        const q = creerQuestion(creerAlea(graine * 7919 + niveau.charCodeAt(0)), niveau);
        verifier(q.total % q.den === 0, `${niveau}/${graine} : total non divisible`);
        verifier(q.num < q.den && q.num > 0, `${niveau}/${graine} : fraction impropre`);
        verifier(q.reponse === (q.total / q.den) * q.num, `${niveau}/${graine} : réponse fausse`);
        const bonnes = q.choix.filter((c) => c.correct);
        verifier(bonnes.length === 1, `${niveau}/${graine} : ${bonnes.length} bonnes réponses`);
        verifier(new Set(q.choix.map((c) => c.texte)).size === q.choix.length, `${niveau}/${graine} : choix en double`);
        verifier(q.choix.length >= 3, `${niveau}/${graine} : moins de 3 choix`);
        if (niveau !== "D") {
          verifier(bonnes[0].texte === String(q.bonne), `${niveau}/${graine} : bonne réponse ≠ ${q.bonne}`);
        }
        for (const c of q.choix) verifier(!/NaN|undefined|null/.test(c.texte), `${niveau}/${graine} : texte invalide ${c.texte}`);
        verifier(!/NaN|undefined|null/.test(q.enonce), `${niveau}/${graine} : énoncé invalide`);
      }
    }
  });

  test("niveau D : l'affirmation de l'énoncé est toujours fausse et la correction est exacte", () => {
    for (let graine = 1; graine <= 300; graine++) {
      const q = creerQuestion(creerAlea(graine), "D");
      verifier(q.gardees === q.total - q.reponse, "gardées incorrect");
      verifier(q.affirmee !== q.gardees, "affirmation vraie");
      verifier(q.choix.find((c) => c.correct).texte.includes(String(q.gardees)), "correction sans le bon nombre");
    }
  });

  test("les mauvaises réponses sont toujours > 0, entières et différentes de la bonne", () => {
    for (const [t, n, d] of [[24, 3, 4], [8, 1, 4], [10, 2, 5], [36, 2, 3], [30, 3, 10], [60, 7, 10]]) {
      const bonne = fractionDe(t, n, d).reponse;
      for (const f of reponsesFausses(t, n, d)) {
        verifier(Number.isInteger(f.valeur) && f.valeur > 0 && f.valeur !== bonne, `${t},${n}/${d} : ${f.valeur}`);
        verifier(/^E\d{1,2}$/.test(f.code), `code ${f.code}`);
      }
    }
  });

  test("même graine = même question (reproductible)", () => {
    const a = JSON.stringify(creerQuestion(creerAlea(42), "C"));
    const b = JSON.stringify(creerQuestion(creerAlea(42), "C"));
    verifier(a === b, "questions différentes");
  });

  test("messages d'erreur : aucun trou {…} non rempli", () => {
    for (let graine = 1; graine <= 400; graine++) {
      for (const niveau of ["B", "C"]) {
        const q = creerQuestion(creerAlea(graine), niveau);
        for (const c of q.choix.filter((x) => !x.correct)) {
          const m = messageErreur(contenu.modeles_correction, q, c);
          verifier(!/[{}]/.test(m), `trou dans « ${m} »`);
          verifier(m.startsWith("Bip !"), "message sans « Bip ! »");
        }
      }
    }
  });

  test("scénario : défi 3/4 de 24 = 18", () => {
    const d = contenu.defi;
    verifier(fractionDe(d.total, d.num, d.den).reponse === d.reponse && d.reponse === 18, "défi incohérent");
  });

  test("scénario : micro-parcours de remédiation recalculé", () => {
    for (const r of contenu.remediation) verifier(fractionDe(r.total, r.num, r.den).reponse === r.reponse, JSON.stringify(r));
  });

  test("scénario : boss 36 galettes, 2/3 pour les enfants → il en reste 12", () => {
    const b = contenu.boss;
    const enfants = fractionDe(b.total, b.num, b.den).reponse;
    verifier(b.total - enfants === b.reponse && b.reponse === 12, `reste ${b.total - enfants}`);
    verifier(enfants === 24, "24 attendu pour les enfants");
    verifier(!b.mauvaises.some((m) => m.valeur === b.reponse), "bonne réponse dans les mauvaises");
  });

  test("scénario : quiz — bonnes réponses recalculées, erreurs codées, une seule bonne réponse", () => {
    verifier(contenu.quiz.length === 8, `${contenu.quiz.length} questions au lieu de 8`);
    for (const q of contenu.quiz) {
      if (q.total) verifier(String(fractionDe(q.total, q.num, q.den).reponse) === q.bonne, `${q.id} : réponse recalculée ≠ ${q.bonne}`);
      verifier(q.mauvaises.length === 3, `${q.id} : ${q.mauvaises.length} mauvaises réponses`);
      verifier(!q.mauvaises.some((m) => m.t === q.bonne), `${q.id} : bonne réponse parmi les mauvaises`);
      for (const m of q.mauvaises) verifier(/^E\d{1,2}$/.test(m.e), `${q.id} : code ${m.e}`);
    }
  });

  test("scénario : D2 — 3/4 de 20 = 15, il en reste 5", () => {
    const d2 = contenu.quiz.find((q) => q.id === "D2");
    verifier(fractionDe(20, 3, 4).reponse === 15 && 20 - 15 === 5 && d2.bonne === "Faux : elle en garde 5", "D2 incohérent");
  });

  test("scénario : corrections du défi (8, 6, 72, 21/27, 16) correspondent aux erreurs de 3/4 de 24", () => {
    const fausses = new Set(reponsesFausses(24, 3, 4).map((f) => f.valeur));
    for (const c of contenu.corrections_defi) {
      for (const v of c.reponses) {
        if (v === 16) continue; // 16 = erreur de calcul sur 6 × 3 (E3), citée par le scénario
        verifier(fausses.has(v), `${v} ne vient pas de la banque d'erreurs`);
      }
    }
  });

  test("scénario : cinq niveaux d'aide, pas de solution au premier appel", () => {
    verifier(contenu.aide.length === 5, "5 niveaux attendus");
    verifier(!contenu.aide[0].texte.includes("18") && !contenu.aide[0].texte.includes("= 6"), "solution donnée dès l'aide 1");
  });

  // ----- Vidéo, BD, voix -----
  const SCENARIO_VIDEO = [
    "Bip ! Aujourd'hui, une fraction d'une quantité. Mamie Sègla a 12 galettes. Elle donne les 2/3 à sa voisine. Combien de galettes ?",
    "Regarde 2/3. Le 3, en bas, dit en combien de parts partager. Le 2, en haut, dit combien de parts on prend.",
    "D'abord, je partage 12 en 3 parts égales. 12 divisé par 3 égale 4. Chaque part a 4 galettes.",
    "Maintenant, je prends 2 parts. 2 fois 4 égale 8. Mamie donne 8 galettes.",
    "Le bas s'appelle le dénominateur. Le haut s'appelle le numérateur. On partage avec le bas. On prend avec le haut.",
    "Attention ! Certains divisent par le 2 et trouvent 6. Vérifions. Deux parts font 8 galettes, pas 6.",
    "Pourquoi partager d'abord ? Pour que chaque part soit égale. Le bas donne la taille d'une part.",
    "À toi ! Trouve les 3/4 de 8. Mets la vidéo en pause. Réponse : 8 divisé par 4 égale 2. 2 fois 3 égale 6."
  ];
  test("vidéo : la voix de chaque segment est exactement celle du scénario, au bon minutage", () => {
    verifier(contenu.video.segments.length === 8, "8 segments attendus");
    const minutage = [[0, 15], [15, 40], [40, 75], [75, 105], [105, 125], [125, 155], [155, 170], [170, 190]];
    contenu.video.segments.forEach((s, i) => {
      verifier(s.parties.map((p) => p.texte).join(" ") === SCENARIO_VIDEO[i], `segment ${i + 1} différent du scénario`);
      verifier(s.debut === minutage[i][0] && s.fin === minutage[i][1], `minutage du segment ${i + 1}`);
      verifier(s.parties.every((p, k) => p.t < s.fin - s.debut && (k === 0 || p.t > s.parties[k - 1].t)), `phrases mal ordonnées dans le segment ${i + 1}`);
    });
    verifier(contenu.video.duree === 190, "durée 3 min 10");
  });

  test("vidéo : calculs exacts (12 ÷ 3 = 4, 4 × 2 = 8, 8 ÷ 4 = 2, 2 × 3 = 6)", () => {
    verifier(12 / 3 === 4 && 4 * 2 === 8 && fractionDe(12, 2, 3).reponse === 8 && fractionDe(8, 3, 4).reponse === 6 && 8 / 4 === 2 && 2 * 3 === 6, "calcul de la vidéo");
  });

  test("BD : 8 cases, 2 bulles et 25 mots au plus par case, comptes exacts (20 = 12 + 8)", () => {
    verifier(contenu.bd.cases.length === 8, "8 cases attendues");
    contenu.bd.cases.forEach((c) => {
      verifier(c.bulles.length >= 1 && c.bulles.length <= 2, `case ${c.n} : ${c.bulles.length} bulles`);
      const mots = c.bulles.reduce((n, b) => n + b.texte.split(/\s+/).length, 0);
      verifier(mots <= 25, `case ${c.n} : ${mots} mots`);
    });
    verifier(fractionDe(20, 3, 5).reponse === 12 && 20 / 5 === 4 && 12 + 8 === 20 && 20 - 12 === 8, "calcul de la BD");
    verifier(contenu.bd.cases[3].legende === "20 ÷ 5 = 4 sacs dans chaque tas." && contenu.bd.cases[4].legende === "3 × 4 = 12 sacs.", "légendes des cases 4 et 5");
    verifier(contenu.bd.cases[7].encadre === "3/5 de 20 : 20 ÷ 5 = 4, puis 4 × 3 = 12.", "encadré de la case 8");
  });

  const audio = await fetch("../app/audio/index.json").then((r) => r.json()).catch(() => ({}));
  const { listerTextes } = await import("../app/js/textes.js");
  const { idVoix } = await import("../app/js/voix.js");
  test("voix : chaque phrase prononcée a son fichier audio (aucune phrase muette)", () => {
    const manquantes = listerTextes(contenu).filter((x) => !audio[idVoix(x.texte)]);
    verifier(manquantes.length === 0, `${manquantes.length} phrase(s) sans voix, dont « ${manquantes[0] && manquantes[0].texte} »`);
  });
  return resultats;
}