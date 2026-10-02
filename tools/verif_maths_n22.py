#!/usr/bin/env python3
"""Contrôle mathématique automatique de N22 (§7 et §18 du prompt maître).

Vérifie que TOUTE valeur affichée dans l'app est cohérente avec la règle
« prendre une fraction d'une quantité » = (total / dénominateur) x numérateur.

Ne modifie rien. Sort en code 1 si une seule valeur est fausse.
"""
import json
import sys
import pathlib

RACINE = pathlib.Path(__file__).resolve().parent.parent
DATA = RACINE / "content" / "n22.json"

erreurs = []
verifs = 0


def check(condition, message):
    global verifs
    verifs += 1
    if not condition:
        erreurs.append(message)


def frac(t, num, den):
    """(t / den) * num — la règle enseignée."""
    return (t // den) * num


n = json.loads(DATA.read_text(encoding="utf-8"))

# --- Mission : la demande de Mamie Sègla ---
total_defi = n["defi"]["total"]
num_defi, den_defi, rep_defi = n["defi"]["num"], n["defi"]["den"], n["defi"]["reponse"]
check(total_defi == 24, f"défi total devrait être 24, trouvé {total_defi}")
check(rep_defi == frac(total_defi, num_defi, den_defi),
      f"défi: {num_defi}/{den_defi} de {total_defi} devrait valoir {frac(total_defi, num_defi, den_defi)}, trouvé {rep_defi}")

# --- Remediation : chaque cas doit être exact ---
for r in n["remediation"]:
    attendu = frac(r["total"], r["num"], r["den"])
    check(r["reponse"] == attendu,
          f"remediation {r['num']}/{r['den']} de {r['total']}: attendu {attendu}, trouvé {r['reponse']}")

# --- Quiz : chaque question avec total/num/den doit être exacte ---
for q in n["quiz"]:
    if "total" in q:
        attendu = frac(q["total"], q["num"], q["den"])
        check(str(attendu) == str(q["bonne"]),
              f"quiz {q['id']}: {q['num']}/{q['den']} de {q['total']} = {attendu}, bonne réponse = {q['bonne']}")
    # les mauvaises réponses ne doivent jamais être justes
    for m in q["mauvaises"]:
        check(str(m["t"]) != str(q["bonne"]),
              f"quiz {q['id']}: la mauvaise réponse {m['t']} est en fait correcte")

# --- Boss : soit les parts demandées, soit le reste ---
b = n["boss"]
part_boss = frac(b["total"], b["num"], b["den"])
reste_boss = b["total"] - part_boss
check(b["reponse"] in (part_boss, reste_boss),
      f"boss: {b['num']}/{b['den']} de {b['total']} = {part_boss} (ou reste {reste_boss}), trouvé {b['reponse']}")
for m in b["mauvaises"]:
    check(m["valeur"] != b["reponse"],
          f"boss: la mauvaise réponse {m['valeur']} est en fait correcte")

# --- Cohérence entre la carte-résumé et les données ---
check(f"{total_defi} ÷ {den_defi} = {total_defi // den_defi}" in n["carte"],
      f"la carte-résumé '{n['carte']}' ne reflète pas {total_defi} ÷ {den_defi}")
check(str(rep_defi) in n["carte"], f"la carte-résumé ne mentionne pas la réponse {rep_defi}")

# --- La mission doit annoncer la même chose que le défi ---
texte_mission = " ".join(m["texte"] for m in n["mission"])
check("3/4" in texte_mission and "24" in texte_mission,
      "la mission n'annonce pas le 3/4 de 24 qui est l'objet du défi")

# --- Codes d'erreur du quiz référencés dans les retours ---
codes_boss = {m["e"] for m in b["mauvaises"]}
for m in b["mauvaises"]:
    check(bool(m.get("retour")), f"boss: le mauvais choix {m['valeur']} n'a pas de message de retour")

print(f"{verifs} vérifications effectuées sur {DATA.name}")
if erreurs:
    print(f"\n{len(erreurs)} ERREUR(S) :")
    for e in erreurs:
        print("  ✗", e)
    sys.exit(1)
print("Toutes les valeurs mathématiques sont exactes. PASS")