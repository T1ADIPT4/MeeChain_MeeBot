# GitHub Secrets Setup Guide

Quick reference for setting up GitHub secrets required for the automated deployment workflow.

## Required Secrets

| Secret Name | Purpose | Required |
|-------------|---------|----------|
| `SIGNING_CERT_PFX` | Code signing certificate (Base64) | Yes (for MSIX signing) |
| `SIGNING_CERT_PASSWORD` | Certificate password | Yes (for MSIX signing) |
| `GITHUB_TOKEN` | GitHub API access | Auto-provided |

## Setup Steps

### 1. Generate or Obtain Certificate

#### Option A: Self-Signed Certificate (Development/Testing)

On Windows with PowerShell (Run as Administrator):

```powershell
# Create self-signed certificate
$cert = New-SelfSignedCertificate `
  -Type Custom `
  -Subject "CN=MeeChain" `
  -KeyUsage DigitalSignature `
  -FriendlyName "MeeChain Code Signing" `
  -CertStoreLocation "Cert:\CurrentUser\My" `
  -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.3", "2.5.29.19={text}")

# Export to PFX with password
$password = ConvertTo-SecureString -String "YOUR_SECURE_PASSWORD" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath "MeeChain.pfx" -Password $password
```

⚠️ **Note**: Self-signed certificates will trigger Windows SmartScreen warnings. Use for testing only.

#### Option B: Production Certificate (Recommended)

Purchase from a trusted Certificate Authority:
- **DigiCert**: Code Signing Certificate
- **GlobalSign**: Code Signing Certificate
- **Sectigo**: Code Signing Certificate

Requirements:
- Organization validation
- Extended Validation (EV) for best trust
- Valid for 1-3 years

### 2. Convert Certificate to Base64

On Windows with PowerShell:

```powershell
# Read PFX file and convert to Base64
$bytes = [System.IO.File]::ReadAllBytes("MeeChain.pfx")
$base64 = [System.Convert]::ToBase64String($bytes)

# Save to file for easy copying
$base64 | Out-File "MeeChain.pfx.base64" -Encoding ASCII
```

On Linux/macOS:

```bash
# Convert PFX to Base64
base64 -i MeeChain.pfx -o MeeChain.pfx.base64

# Or using cat
cat MeeChain.pfx | base64 > MeeChain.pfx.base64
```

### 3. Add Secrets to GitHub

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

#### Add SIGNING_CERT_PFX:
- **Name**: `SIGNING_CERT_PFX`
- **Value**: Paste the entire Base64 content from `MeeChain.pfx.base64`
- Click **Add secret**

#### Add SIGNING_CERT_PASSWORD:
- **Name**: `SIGNING_CERT_PASSWORD`
- **Value**: The password you used when exporting the PFX
- Click **Add secret**

### 4. Verify Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. You should see:
   - `SIGNING_CERT_PFX` (with hidden value)
   - `SIGNING_CERT_PASSWORD` (with hidden value)
   - `GITHUB_TOKEN` (automatically provided by GitHub)

## Security Best Practices

### Certificate Storage
- ✅ **DO**: Store PFX files securely (password manager, encrypted storage)
- ✅ **DO**: Use strong passwords (16+ characters, mixed case, numbers, symbols)
- ✅ **DO**: Limit access to certificate files
- ❌ **DON'T**: Commit PFX files to repository
- ❌ **DON'T**: Share certificates via email or chat
- ❌ **DON'T**: Use weak or default passwords

### GitHub Secrets
- ✅ **DO**: Use organization secrets for shared certificates
- ✅ **DO**: Rotate certificates before expiration
- ✅ **DO**: Remove secrets when no longer needed
- ❌ **DON'T**: Share secrets between unrelated projects
- ❌ **DON'T**: Log or display secret values in workflows

### Certificate Management
- ✅ **DO**: Keep track of expiration dates
- ✅ **DO**: Test certificates before production use
- ✅ **DO**: Have backup certificates ready
- ✅ **DO**: Document certificate details (excluding passwords)
- ❌ **DON'T**: Wait until last minute to renew
- ❌ **DON'T**: Use expired certificates

## Troubleshooting

### "Invalid Base64 string"

**Cause**: Base64 encoding is corrupted or incomplete

**Solution**:
```powershell
# Verify Base64 is valid
$base64 = Get-Content "MeeChain.pfx.base64" -Raw
$base64 = $base64.Trim()  # Remove whitespace
$base64 | Out-File "MeeChain.pfx.base64" -Encoding ASCII -NoNewline
```

### "Certificate password incorrect"

**Cause**: Wrong password in secret

**Solution**:
1. Verify password is correct locally:
   ```powershell
   $cert = Get-PfxCertificate -FilePath "MeeChain.pfx"
   # If this succeeds, password is correct
   ```
2. Update `SIGNING_CERT_PASSWORD` secret with correct password

### "Certificate not found" or "Cannot find certificate"

**Cause**: Base64 decoding failed or certificate is corrupted

**Solution**:
1. Verify PFX file is valid:
   ```powershell
   $cert = Get-PfxCertificate -FilePath "MeeChain.pfx"
   $cert | Format-List
   ```
2. Re-generate Base64 encoding
3. Update `SIGNING_CERT_PFX` secret

### Workflow fails during signing

**Cause**: Certificate not suitable for code signing

**Solution**:
1. Verify certificate has code signing capability:
   ```powershell
   $cert = Get-PfxCertificate -FilePath "MeeChain.pfx"
   $cert.EnhancedKeyUsageList
   # Should include "Code Signing" (1.3.6.1.5.5.7.3.3)
   ```
2. If not present, generate new certificate with correct usage

## Testing Locally

Before adding to GitHub secrets, test locally:

```powershell
# Decode Base64
$base64 = Get-Content "MeeChain.pfx.base64" -Raw
$bytes = [System.Convert]::FromBase64String($base64)
[System.IO.File]::WriteAllBytes("test.pfx", $bytes)

# Test password
$password = "YOUR_PASSWORD"
$cert = Get-PfxCertificate -FilePath "test.pfx" -Password (ConvertTo-SecureString $password -AsPlainText -Force)

# Verify certificate details
$cert | Format-List Subject, Thumbprint, NotAfter, EnhancedKeyUsageList

# Clean up
Remove-Item "test.pfx"
```

## Renewal Process

When certificate expires or needs renewal:

1. **Obtain new certificate** (follow steps above)
2. **Generate new Base64** encoding
3. **Update GitHub secrets** with new values
4. **Test workflow** with new certificate
5. **Archive old certificate** securely
6. **Document** renewal in change log

## Alternative: GitHub Environment Secrets

For better organization, use environment-specific secrets:

1. Create environment: **Settings** → **Environments** → **New environment**
2. Name it (e.g., "production")
3. Add secrets to environment
4. Reference in workflow:
   ```yaml
   jobs:
     deploy:
       environment: production
   ```

## Support

For issues with secrets setup:
1. Verify all steps completed correctly
2. Check [WORKFLOW_GUIDE.md](WORKFLOW_GUIDE.md) for troubleshooting
3. Review GitHub Actions logs (secrets are masked)
4. Open an issue with error details (excluding secret values)

## References

- [GitHub Encrypted Secrets](https://docs.github.com/actions/security-guides/encrypted-secrets)
- [PowerShell Certificate Cmdlets](https://docs.microsoft.com/powershell/module/pki/)
- [Code Signing Best Practices](https://docs.microsoft.com/windows/security/threat-protection/windows-defender-application-control/use-code-signing-to-simplify-application-control-for-classic-windows-applications)
