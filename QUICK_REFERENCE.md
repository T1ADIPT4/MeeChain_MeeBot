# 🚀 Automated Deploy - Quick Reference

One-page reference for using the automated deployment workflow.

## Prerequisites ✅

- [ ] GitHub repository with Actions enabled
- [ ] GitHub Pages enabled (Settings → Pages → gh-pages branch)
- [ ] Secrets configured (SIGNING_CERT_PFX, SIGNING_CERT_PASSWORD)
- [ ] Patch file committed to repository

## Running the Workflow

### Via GitHub UI

1. Go to **Actions** tab
2. Select **Automated Deploy and Release**
3. Click **Run workflow**
4. Fill inputs:
   - **patch_file**: `examples/sample-patch.patch`
   - **version**: `1.0.0`
5. Click **Run workflow**

### Expected Duration
- ⏱️ 5-10 minutes total
- ⏱️ 2 min: Build & test
- ⏱️ 1 min: MSIX creation
- ⏱️ 1 min: Signing
- ⏱️ 1 min: Release creation
- ⏱️ 1 min: gh-pages deployment

## Inputs 📝

| Input | Description | Example |
|-------|-------------|---------|
| `patch_file` | Path to patch file in repo | `examples/sample-patch.patch` |
| `version` | Semantic version for release | `1.0.0` |

## Outputs 📊

### Deployment Viewer
- **URL**: `https://<owner>.github.io/<repo>/`
- **Shows**: Patch status, build results, version info
- **Updated**: Automatically on each run

### GitHub Release
- **Tag**: `v{version}`
- **Contains**: MSIX package, status JSON
- **Notes**: Auto-generated with deployment info

### Artifacts
- `msix-package/` - MSIX package files
- `docs/status/patch-status.json` - Deployment status

## Status Indicators 🚦

| Status | Meaning |
|--------|---------|
| ✅ Patch Applied | Patch successfully applied |
| ❌ Patch Failed | Could not apply patch (conflicts) |
| ✅ Build Success | Build and tests passed |
| ❌ Build Failed | Build or tests failed |

## Quick Troubleshooting 🔧

### Patch Won't Apply
```bash
# Fix locally
git pull origin main
git apply --check your-patch.patch
# If fails, regenerate patch from current branch
```

### Build Fails
```bash
# Test locally first
npm install
npm run build
npm test
# Fix errors before creating patch
```

### Signing Fails
- Verify `SIGNING_CERT_PFX` is valid Base64
- Check `SIGNING_CERT_PASSWORD` is correct
- Ensure certificate is code-signing enabled

### gh-pages Fails
- Enable GitHub Pages in Settings
- Create gh-pages branch manually if needed
- Check repository permissions

## File Locations 📁

```
Repository Root
├── .github/workflows/
│   └── automate-deploy.yml     # Main workflow
├── docs/
│   ├── index.html              # Viewer page
│   └── status/
│       └── patch-status.json   # Status data
├── msix-template/
│   └── AppxManifest.xml        # MSIX manifest
├── examples/
│   └── sample-patch.patch      # Example patch
├── WORKFLOW_GUIDE.md           # Full guide
├── SECRETS_SETUP.md            # Secrets setup
└── IMPLEMENTATION_WORKFLOW.md  # Implementation details
```

## Common Commands 💻

### Create Patch
```bash
git add .
git diff --cached > my-changes.patch
git add my-changes.patch
git commit -m "Add deployment patch"
git push
```

### Test Patch Locally
```bash
git apply --check examples/sample-patch.patch
git apply examples/sample-patch.patch
# Test your changes
git apply -R examples/sample-patch.patch  # Revert
```

### Generate Certificate (Windows)
```powershell
# Self-signed for testing
$cert = New-SelfSignedCertificate -Type Custom -Subject "CN=MeeChain" -KeyUsage DigitalSignature -CertStoreLocation "Cert:\CurrentUser\My"
$password = ConvertTo-SecureString "PASSWORD" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath "cert.pfx" -Password $password
[Convert]::ToBase64String([IO.File]::ReadAllBytes("cert.pfx")) | Out-File "cert.base64"
```

## Workflow Steps Summary 📋

1. ✅ Checkout code
2. ✅ Setup Node.js & install dependencies
3. ✅ Apply patch file
4. ✅ Run build & tests
5. ✅ Generate status JSON
6. ✅ Create viewer HTML
7. ✅ Deploy to gh-pages
8. ✅ Build MSIX package
9. ✅ Sign MSIX (if certificates configured)
10. ✅ Create GitHub release
11. ✅ Generate summary

## Best Practices 🌟

### Before Running
- ✅ Test changes locally
- ✅ Create descriptive patch name
- ✅ Use semantic versioning
- ✅ Review patch content

### During Development
- ✅ Keep patches small and focused
- ✅ Include tests for changes
- ✅ Document breaking changes
- ✅ Update version appropriately

### After Deployment
- ✅ Check viewer status
- ✅ Test MSIX installation
- ✅ Verify release notes
- ✅ Monitor for issues

## URLs 🔗

| Resource | URL Template |
|----------|--------------|
| Viewer | `https://{owner}.github.io/{repo}/` |
| Release | `https://github.com/{owner}/{repo}/releases/tag/v{version}` |
| Actions | `https://github.com/{owner}/{repo}/actions` |
| Settings | `https://github.com/{owner}/{repo}/settings` |

## Support Resources 📚

| Document | Purpose |
|----------|---------|
| [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md) | Complete usage guide |
| [SECRETS_SETUP.md](SECRETS_SETUP.md) | Certificate setup |
| [IMPLEMENTATION_WORKFLOW.md](IMPLEMENTATION_WORKFLOW.md) | Implementation details |
| [examples/README-patches.md](examples/README-patches.md) | Patch creation guide |

## Example Workflow Run

```
Input:
  patch_file: examples/sample-patch.patch
  version: 1.0.0

Output:
  ✅ Patch applied successfully
  ✅ Build completed (2m 15s)
  ✅ Tests passed
  ✅ Status generated
  ✅ Viewer deployed → https://owner.github.io/repo/
  ✅ MSIX created
  ✅ MSIX signed
  ✅ Release created → v1.0.0
  
Duration: 8m 42s
```

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-10-15 | Initial implementation |

---

**Need Help?** Check full documentation or open an issue on GitHub.
