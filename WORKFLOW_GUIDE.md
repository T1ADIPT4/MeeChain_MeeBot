# Automated Deploy Workflow Guide

This guide explains how to use the automated deployment workflow for MeeChain MeeBot.

## Overview

The `automate-deploy.yml` workflow automates the entire deployment process:

1. ✅ Apply patch files
2. ✅ Run tests and build
3. ✅ Generate deployment status
4. ✅ Publish viewer to GitHub Pages
5. ✅ Build MSIX package
6. ✅ Sign MSIX with certificate
7. ✅ Create GitHub Release

## Prerequisites

### 1. Configure GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret Name | Description | How to Generate |
|-------------|-------------|-----------------|
| `SIGNING_CERT_PFX` | Base64-encoded PFX certificate | See [Certificate Setup](#certificate-setup) |
| `SIGNING_CERT_PASSWORD` | Certificate password | Set when creating PFX |
| `GITHUB_TOKEN` | GitHub token (auto-provided) | Automatically available |

### 2. Enable GitHub Pages

1. Go to **Settings → Pages**
2. Set source to **gh-pages** branch
3. Set directory to **/ (root)**
4. Click **Save**

## Certificate Setup

### Creating a Self-Signed Certificate (Development)

On Windows with PowerShell:

```powershell
# Create self-signed certificate
$cert = New-SelfSignedCertificate `
  -Type Custom `
  -Subject "CN=MeeChain" `
  -KeyUsage DigitalSignature `
  -FriendlyName "MeeChain Code Signing" `
  -CertStoreLocation "Cert:\CurrentUser\My" `
  -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.3", "2.5.29.19={text}")

# Export to PFX
$password = ConvertTo-SecureString -String "YOUR_PASSWORD" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath "MeeChain.pfx" -Password $password

# Convert to Base64
$bytes = [System.IO.File]::ReadAllBytes("MeeChain.pfx")
$base64 = [System.Convert]::ToBase64String($bytes)
$base64 | Out-File "MeeChain.pfx.base64"
```

### Using a Production Certificate

For production, obtain a certificate from a trusted Certificate Authority (CA):

1. Purchase from CA (e.g., DigiCert, GlobalSign)
2. Export as PFX with private key
3. Convert to Base64 as shown above

### Adding to GitHub Secrets

1. Copy the Base64 content from `MeeChain.pfx.base64`
2. Go to **Settings → Secrets → New repository secret**
3. Name: `SIGNING_CERT_PFX`
4. Value: Paste the Base64 content
5. Add another secret: `SIGNING_CERT_PASSWORD` with your certificate password

## Running the Workflow

### Via GitHub Actions UI

1. Go to **Actions** tab
2. Select **Automated Deploy and Release** workflow
3. Click **Run workflow**
4. Fill in the inputs:
   - **patch_file**: Name of patch file (e.g., `meebot-fixes.patch`)
   - **version**: Release version (e.g., `1.0.0`)
5. Click **Run workflow**

### Creating Patch Files

Create a patch file from your changes:

```bash
# Make your changes
git add .
git diff --cached > meebot-fixes.patch

# Commit the patch file
git add meebot-fixes.patch
git commit -m "Add patch for bug fixes"
git push
```

## Workflow Steps

### 1. Apply Patch
- Checks if patch file exists
- Validates patch with `git apply --check`
- Applies patch if valid
- Sets output: `patch_applied`

### 2. Build & Test
- Runs `npm install`
- Runs `npm run build`
- Runs `npm test` (if available)
- Sets output: `build_success`

### 3. Generate Status
- Creates `patch-status.json` with:
  - Version
  - Patch file name
  - Timestamp
  - Patch applied status
  - Build success status
  - Workflow run ID
  - Commit SHA

### 4. Setup Viewer
- Creates HTML viewer page
- Copies to docs directory
- Includes status display with styling

### 5. Push to gh-pages
- Checks out gh-pages branch (creates if needed)
- Copies docs content
- Commits and pushes
- Returns to original branch

### 6. Build MSIX
- Creates AppxManifest.xml with version
- Copies necessary files
- Creates package structure
- Note: Uses PowerShell placeholders (requires Windows SDK on runner)

### 7. Sign MSIX
- Decodes Base64 certificate
- Signs package with SignTool
- Cleans up certificate file
- Skips if secrets not configured

### 8. Create Release
- Creates GitHub release with tag `v{version}`
- Includes:
  - MSIX package files
  - Status JSON
  - Release notes
  - Links to viewer

### 9. Summary
- Generates workflow summary
- Includes status and links
- Shows next steps

## Viewing Results

### Deployment Viewer

After workflow completes, view status at:
```
https://{owner}.github.io/{repo}/
```

Example: `https://t1adipt4.github.io/MeeChain_MeeBot/`

### GitHub Release

Find the release at:
```
https://github.com/{owner}/{repo}/releases/tag/v{version}
```

## Example Workflow Run

```yaml
# Input:
patch_file: meebot-fixes.patch
version: 1.0.0

# Expected Output:
✅ Patch applied successfully
✅ Build completed successfully
✅ Generated patch-status.json
✅ Pushed to gh-pages
✅ MSIX package created
✅ MSIX signed
✅ Release created: v1.0.0
```

## Troubleshooting

### Patch Application Failed

**Issue**: Patch cannot be applied

**Solutions**:
- Ensure patch file exists in repository root
- Verify patch is compatible with current codebase
- Check for merge conflicts
- Regenerate patch from latest code

### Build Failed

**Issue**: npm build or tests fail

**Solutions**:
- Fix failing tests locally first
- Ensure all dependencies are in package.json
- Check for TypeScript errors
- Review build logs in workflow

### MSIX Signing Failed

**Issue**: Certificate error or signing fails

**Solutions**:
- Verify SIGNING_CERT_PFX is valid Base64
- Check SIGNING_CERT_PASSWORD is correct
- Ensure certificate is code-signing enabled
- Test certificate locally first

### gh-pages Push Failed

**Issue**: Cannot push to gh-pages branch

**Solutions**:
- Ensure GitHub Pages is enabled
- Check repository permissions
- Verify GITHUB_TOKEN has write access
- Manually create gh-pages branch if needed

## Advanced Usage

### Custom Patch Location

Modify workflow to accept patch from different location:

```yaml
# In workflow file, change patch path
git apply "patches/${{ inputs.patch_file }}"
```

### Skip Signing

For testing without certificate:

```yaml
# Remove or comment out signing step
# - name: Sign MSIX package
```

### Add Custom Build Steps

Add before MSIX build:

```yaml
- name: Custom Build
  run: |
    npm run custom-script
    # Your custom commands
```

## Best Practices

1. **Test Locally First**
   - Build and test before creating patch
   - Verify patch applies cleanly

2. **Version Management**
   - Use semantic versioning (MAJOR.MINOR.PATCH)
   - Tag releases appropriately

3. **Certificate Security**
   - Use production certificates for releases
   - Rotate certificates regularly
   - Never commit PFX files to repository

4. **Monitoring**
   - Check workflow runs regularly
   - Review deployment viewer
   - Monitor release downloads

## Related Files

- `.github/workflows/automate-deploy.yml` - Main workflow
- `docs/` - Viewer files and status
- `msix-template/` - MSIX package template
- `config/deploy-registry.json` - Contract deployment registry

## Support

For issues:
1. Check workflow logs in Actions tab
2. Review this guide
3. Open an issue on GitHub
4. Contact MeeChain team

## References

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [MSIX Packaging](https://docs.microsoft.com/windows/msix/)
- [Code Signing Best Practices](https://docs.microsoft.com/windows/security/threat-protection/windows-defender-application-control/use-code-signing-to-simplify-application-control-for-classic-windows-applications)
