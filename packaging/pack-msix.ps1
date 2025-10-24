<#
Pack the docs/ viewer into an MSIX using MakeAppx (Windows SDK required).
Usage: .\packaging\pack-msix.ps1 -OutFile ..\releases\MeeBotViewer.msix
#>
param(
  [string]$SourceDir = "${PSScriptRoot}\..\docs",
  [string]$OutFile = "${PSScriptRoot}\..\releases\MeeBotViewer.msix",
  [switch]$Overwrite
)

if (!(Test-Path $SourceDir)) {
  Write-Error "Source directory not found: $SourceDir"
  exit 1
}

$outDir = Split-Path -Parent $OutFile
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

if (Test-Path $OutFile) {
  if ($Overwrite) { Remove-Item $OutFile -Force }
  else { Write-Error "$OutFile already exists. Use -Overwrite to replace."; exit 1 }
}

Write-Host "Packing $SourceDir -> $OutFile"

try {
  & MakeAppx pack -d $SourceDir -p $OutFile
  if ($LASTEXITCODE -ne 0) { Write-Error "MakeAppx failed with exit code $LASTEXITCODE"; exit $LASTEXITCODE }
} catch {
  Write-Error "MakeAppx not found. Install Windows 10/11 SDK or add MakeAppx to PATH."; exit 1
}

Write-Host "MSIX created: $OutFile"
