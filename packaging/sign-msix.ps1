<#
Sign an MSIX package using SignTool. Requires a PFX certificate.
Usage: .\packaging\sign-msix.ps1 -MsixPath ..\releases\MeeBotViewer.msix -PfxPath ./certs/MyCert.pfx
#>
param(
  [Parameter(Mandatory=$true)][string]$MsixPath,
  [Parameter(Mandatory=$true)][string]$PfxPath,
  [string]$TimestampUri = 'http://timestamp.digicert.com'
)

if (!(Test-Path $MsixPath)) { Write-Error "MSIX not found: $MsixPath"; exit 1 }
if (!(Test-Path $PfxPath)) { Write-Error "PFX not found: $PfxPath"; exit 1 }

try {
  & signtool sign /fd SHA256 /a /f $PfxPath /tr $TimestampUri /td SHA256 $MsixPath
  if ($LASTEXITCODE -ne 0) { Write-Error "SignTool failed with exit code $LASTEXITCODE"; exit $LASTEXITCODE }
} catch {
  Write-Error "SignTool not found. Install Windows SDK or ensure SignTool is on PATH."; exit 1
}

Write-Host "Signed: $MsixPath"
