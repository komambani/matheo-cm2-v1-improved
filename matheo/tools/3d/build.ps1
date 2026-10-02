# Compile la scène 3D (nécessite Node.js). À relancer seulement quand marche3d.js change.
# Résultat : app/js/vendor/marche3d.js (versionné : l'application n'a aucune étape de compilation).
Set-Location $PSScriptRoot
$env:Path += ";C:\Program Files\nodejs"
npm install --silent
npm run build
