# Génère les voix de l'application avec Piper (gratuit, local, sans clé), sur le serveur de construction.
# Usage : powershell -File tools\voix\generer_voix.ps1
# Entrée : tools\voix\textes_n22.json (liste produite par tools/voix/lister.html, même source que l'écran).
# Sortie : app\audio\<id>.mp3 et app\audio\index.json (id -> fichier). L'id est le même calcul que app/js/voix.js.
param(
  [string]$Textes = "tools\voix\textes_n22.json",
  [string]$Sortie = "app\audio",
  [string]$Hote = "administrator@69.30.247.120",
  [string]$Cle = "$env:USERPROFILE\.ssh\id_ed25519_vps",
  [string]$Voix = "fr_FR-siwis-medium"
)
$ErrorActionPreference = "Stop"
$racine = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
Set-Location $racine

# Identifiant stable d'un texte : FNV-1a 32 bits sur les points de code (identique à idVoix() en JavaScript).
function Id-Voix([string]$t) {
  $h = [uint64]2166136261; $masque = [uint64]4294967295; $i = 0
  while ($i -lt $t.Length) {
    $cp = [char]::ConvertToUtf32($t, $i)
    $i += $(if ([char]::IsHighSurrogate($t[$i])) { 2 } else { 1 })
    $h = ($h -bxor [uint64]$cp) -band $masque
    $h = ($h * [uint64]16777619) -band $masque
  }
  return ('{0:x8}' -f $h)
}

# Texte « à dire » : fractions et signes en toutes lettres pour que la voix les prononce bien.
function Parole([string]$t) {
  $noms = @{ 2 = @("demi", "demis"); 3 = @("tiers", "tiers"); 4 = @("quart", "quarts"); 5 = @("cinquième", "cinquièmes"); 6 = @("sixième", "sixièmes"); 8 = @("huitième", "huitièmes"); 10 = @("dixième", "dixièmes") }
  $t = [regex]::Replace($t, '(\d+)/(\d+)', {
    param($m)
    $n = [int]$m.Groups[1].Value; $d = [int]$m.Groups[2].Value
    if ($noms.ContainsKey($d)) { "$n " + $noms[$d][$(if ($n -gt 1) { 1 } else { 0 })] } else { "$n sur $d" }
  })
  $t = $t.Replace("÷", " divisé par ").Replace("×", " fois ").Replace(" = ", " égale ").Replace(" + ", " plus ").Replace("«", "").Replace("»", "")
  return ($t -replace '\s+', ' ').Trim()
}

# Toutes les notions : tools\voix\textes_*.json (produits par tools/voix/lister.html). Les phrases communes ne sont générées qu'une fois.
$liste = @()
$deja = @{}
foreach ($fichier in (Get-ChildItem (Split-Path $Textes) -Filter "textes_*.json" | Sort-Object Name)) {
  foreach ($x in (Get-Content -Raw -Encoding UTF8 $fichier.FullName | ConvertFrom-Json)) {
    if (-not $deja.ContainsKey($x.texte)) { $deja[$x.texte] = $true; $liste += $x }
  }
}
New-Item -ItemType Directory -Force $Sortie | Out-Null
# Incrémental : seules les phrases sans fichier audio sont générées (supprimez le .mp3 pour en refaire une).
$aFaire = @($liste | Where-Object { -not (Test-Path (Join-Path $Sortie ("{0}.mp3" -f (Id-Voix $_.texte)))) })
Write-Host "$($aFaire.Count) nouvelle(s) phrase(s) sur $($liste.Count)."
$lignes = foreach ($x in $aFaire) { "{0}`t{1}`t{2}" -f (Id-Voix $x.texte), $x.qui, (Parole $x.texte) }
$tsv = ($lignes -join "`n") + "`n"
$tsvB64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($tsv))

$bash = @'
set -e
export PATH="$HOME/.local/bin:$PATH"
V=$(ls -d $HOME/.hermes/installs/*/environments/*/venv | while read d; do [ -x "$d/bin/python" ] && "$d/bin/python" -c "import piper" 2>/dev/null && echo "$d" && break; done)
D=$HOME/.hermes/profiles/atelier/cache/piper-voices
M=$D/__VOIX__.onnx
SR=$(python3 -c "import json;print(json.load(open('$M.json'))['audio']['sample_rate'])")
W=$HOME/voix-travail; rm -rf $W; mkdir -p $W
echo "$TSV_B64" | base64 -d > $W/lignes.tsv
# 1) Synthèse : le modèle Piper est chargé UNE seule fois pour toutes les phrases (bien plus rapide qu'un appel par phrase).
cat > $W/synthese.py <<'PY'
import sys, wave
from piper import PiperVoice
modele, dossier, part, total = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
voix = PiperVoice.load(modele)
n = 0
for i, ligne in enumerate(open(dossier + "/lignes.tsv", encoding="utf-8")):
    ligne = ligne.rstrip("\n")
    if not ligne or i % total != part:
        continue
    ident, qui, parole = ligne.split("\t", 2)
    with wave.open(f"{dossier}/{ident}.wav", "wb") as w:
        voix.synthesize_wav(parole, w)
    n += 1
print("SYNTHESE part", part, ":", n)
PY
# 3 processus en parallèle, chacun avec son propre chargement du modèle (le serveur a 4 cœurs).
for k in 0 1 2; do $V/bin/python $W/synthese.py "$M" "$W" $k 3 & done
wait
# 2) Conversion : hauteur et vitesse propres au personnage, puis mp3 léger (4 en parallèle, le serveur a 4 cœurs).
convertir() {
  id="$1"; qui="$2"
  case "$qui" in
    "Mathéo")      P=1.14; T=1.04 ;;
    "Mamie Sègla") P=0.93; T=0.94 ;;
    "Anita")       P=1.08; T=1.00 ;;
    "Kola")        P=1.04; T=1.08 ;;
    "Maître Léo")  P=0.88; T=0.95 ;;
    *)             P=1.00; T=0.98 ;;
  esac
  ATEMPO=$(python3 -c "print(round($T/$P,4))")
  ffmpeg -nostdin -y -loglevel error -i "$W/$id.wav" -af "asetrate=$(python3 -c "print(int($SR*$P))"),aresample=$SR,atempo=$ATEMPO,loudnorm=I=-18:LRA=9:TP=-2" -ac 1 -ar $SR -codec:a libmp3lame -b:a 40k "$W/$id.mp3"
}
while IFS=$'\t' read -r id qui parole; do
  [ -z "$id" ] && continue
  convertir "$id" "$qui" &
  while [ "$(jobs -r | wc -l)" -ge 4 ]; do sleep 0.1; done
done < $W/lignes.tsv
wait
n=$(ls $W/*.mp3 2>/dev/null | wc -l)
echo "GENERES: $n"; du -sh $W | cut -f1
'@
$bash = $bash.Replace("__VOIX__", $Voix).Replace("`r", "")
$script = "TSV_B64='$tsvB64'`n" + $bash
if ($aFaire.Count -gt 0) {
  Write-Host "Génération sur le serveur (quelques minutes)…"
  # Le script est envoyé comme fichier : aucune limite de longueur de ligne de commande, même avec des centaines de phrases.
  $local = Join-Path $env:TEMP "generer_voix.sh"
  [IO.File]::WriteAllText($local, $script.Replace("`r", ""), (New-Object Text.UTF8Encoding($false)))
  scp -i $Cle -o BatchMode=yes $local "${Hote}:generer_voix.sh"
  ssh -i $Cle -o BatchMode=yes $Hote "bash generer_voix.sh"
  scp -i $Cle -o BatchMode=yes "${Hote}:voix-travail/*.mp3" $Sortie
}
$index = [ordered]@{}
foreach ($x in $liste) {
  $id = Id-Voix $x.texte
  if (Test-Path (Join-Path $Sortie "$id.mp3")) { $index[$id] = "$id.mp3" } else { Write-Warning "Pas d'audio pour : $($x.texte)" }
}
[IO.File]::WriteAllText((Join-Path $Sortie "index.json"), ($index | ConvertTo-Json), (New-Object Text.UTF8Encoding($false)))
Write-Host "Terminé : $($index.Count)/$($liste.Count) voix dans $Sortie"
