<#
Apply a patch locally, create a branch, commit and push.
Usage: .\packaging\apply_patch_and_push.ps1 -PatchFile meebot-fixes.patch -Branch meebot/fix-jest-deps
#>
param(
  [Parameter(Mandatory = $true)][string]$PatchFile,
  [Parameter(Mandatory = $true)][string]$Branch = 'meebot/fix-jest-deps',
  [string]$CommitMessage = 'Apply MeeBot patch',
  [string]$Remote = 'origin'
)

function Check-Git {
  try {
    git --version > $null 2>&1
    return $true
  }
  catch {
    return $false
  }
}

if (-not (Check-Git)) {
  Write-Error "git not available in PATH. Install Git and rerun."
  exit 1
}

if (!(Test-Path $PatchFile)) {
  Write-Error "Patch file not found: $PatchFile"
  exit 1
}

Write-Host "Creating branch: $Branch"
git fetch $Remote --prune
git checkout -b $Branch

Write-Host "Applying patch: $PatchFile"
git apply --check $PatchFile || git apply --3way $PatchFile || git apply --reject $PatchFile

$rej = Get-ChildItem -Recurse -Filter *.rej -ErrorAction SilentlyContinue
if ($rej) {
  Write-Error "Patch produced .rej files. Inspect and resolve before committing."
  $rej | ForEach-Object { Write-Host $_.FullName }
  exit 1
}

git add -A
git commit -m "$CommitMessage" || Write-Host "No changes to commit"
git push -u $Remote HEAD

Write-Host "Done. Push completed. Create a PR from branch $Branch in GitHub if needed."
