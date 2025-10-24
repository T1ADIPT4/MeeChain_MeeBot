Write-Host "🐣 MeeBot: Starting patch workflow..."

# Check for Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ MeeBot: Git not found. Please install Git for Windows: https://git-scm.com/download/win"
    exit 1
}

# Go to repo root
Set-Location "C:\MeeChainTemp\Meechain_MeeBot"

# Rename patch if needed
if (Test-Path .\meebot-fixes.patch.txt -PathType Leaf) {
    Rename-Item .\meebot-fixes.patch.txt -NewName "meebot-fixes.patch"
    Write-Host "📦 MeeBot: Renamed patch file to meebot-fixes.patch"
}

# Create feature branch
git checkout -b meebot/fix-jest-deps

# Preview patch
Write-Host "🔍 MeeBot: Checking patch..."
git apply --check .\meebot-fixes.patch
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ MeeBot: Patch check failed. Trying 3-way merge..."
    git apply --3way .\meebot-fixes.patch
    if ($LASTEXITCODE -ne 0) {
        Write-Host "🧩 MeeBot: 3-way failed. Writing rejects..."
        git apply --reject .\meebot-fixes.patch
        Write-Host "🛠️ MeeBot: Manual fix required. Check .rej files and resolve before continuing."
        exit 1
    } else {
        Write-Host "✅ MeeBot: Patch applied via 3-way merge!"
    }
} else {
    git apply .\meebot-fixes.patch
    Write-Host "✅ MeeBot: Patch applied successfully!"
}

# Stage intended files
git add package.json pages/Admin.tsx pages/index.tsx
$staged = git diff --cached --name-only
if (-not $staged) {
    Write-Host "🔍 MeeBot: No changes staged. Showing diff..."
    git diff package.json pages/Admin.tsx pages/index.tsx
    exit 1
}

# Commit
git commit -m "Fix jest config, add missing deps, fix Admin import, add prop types"
Write-Host "📝 MeeBot: Commit created!"

# Push
git push -u origin HEAD
Write-Host "🚀 MeeBot: Patch pushed to origin!"

# Verify
Write-Host "🔎 MeeBot: Commit verification..."
git log -1 --stat
git show --name-only HEAD

Write-Host "🎉 MeeBot: Patch workflow complete!"