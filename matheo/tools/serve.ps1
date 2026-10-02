# Serveur statique local pour tester l'application (aucune dependance).
# Usage : powershell -File tools\serve.ps1 [-Port 8080]
# Sert le dossier matheo/ : l'application est sur http://localhost:8080/app/ et les tests sur /tests/.
param([int]$Port = 8080)

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$mime = @{
  ".html" = "text/html; charset=utf-8"; ".js" = "text/javascript; charset=utf-8"; ".mjs" = "text/javascript; charset=utf-8"
  ".css" = "text/css; charset=utf-8"; ".json" = "application/json; charset=utf-8"; ".svg" = "image/svg+xml"
  ".webmanifest" = "application/manifest+json"; ".png" = "image/png"; ".webp" = "image/webp"
  ".mp3" = "audio/mpeg"; ".ogg" = "audio/ogg"; ".opus" = "audio/ogg"; ".wav" = "audio/wav"; ".txt" = "text/plain; charset=utf-8"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Mathéo : http://localhost:$Port/app/   (Ctrl+C pour arreter)"

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    # Seule écriture permise : la liste des textes à prononcer, envoyée par la page tools/voix/lister.html du même serveur.
    if ($ctx.Request.HttpMethod -eq "POST" -and $ctx.Request.Url.AbsolutePath -eq "/__sauver_textes" -and $ctx.Request.QueryString["id"] -match "^[a-z0-9_]{2,24}$" -and $ctx.Request.Headers["Origin"] -eq "http://localhost:$Port") {
      $lecteur = New-Object System.IO.StreamReader($ctx.Request.InputStream, [Text.Encoding]::UTF8)
      $corps = $lecteur.ReadToEnd()
      [System.IO.File]::WriteAllText((Join-Path $root ("tools\voix\textes_" + $ctx.Request.QueryString["id"] + ".json")), $corps, (New-Object Text.UTF8Encoding($false)))
      $ctx.Response.StatusCode = 204; $ctx.Response.Close(); continue
    }
    $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart("/")
    if ($rel -eq "") { $rel = "app/" }
    $path = Join-Path $root ($rel -replace "/", "\")
    if ((Test-Path $path -PathType Container)) { $path = Join-Path $path "index.html" }
    $full = [System.IO.Path]::GetFullPath($path)
    if (-not $full.StartsWith($root) -or -not (Test-Path $full -PathType Leaf)) {
      $ctx.Response.StatusCode = 404
      $bytes = [Text.Encoding]::UTF8.GetBytes("404")
    } else {
      $ext = [System.IO.Path]::GetExtension($full).ToLower()
      $ctx.Response.ContentType = $(if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" })
      $ctx.Response.Headers.Add("Cache-Control", "no-cache")
      $bytes = [System.IO.File]::ReadAllBytes($full)
    }
    $ctx.Response.ContentLength64 = $bytes.Length
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $ctx.Response.OutputStream.Close()
  }
} finally { $listener.Stop() }
