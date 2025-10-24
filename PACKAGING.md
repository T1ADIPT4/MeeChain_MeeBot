# Packaging MeeBot Viewer (MSIX) and WinGet manifest

This document explains how to package the `docs/` static viewer into an MSIX, sign it for sideloading, and prepare a WinGet manifest for submission.

Prereqs

- Windows 10/11 SDK (MakeAppx, SignTool)
- PowerShell 5.1+ (Windows PowerShell) or PowerShell 7+
- Optional: a code-signing certificate (PFX) for production

Files added

- `PackageDependencies.json` — runtime dependencies used in MSIX manifest / WinGet metadata
- `packaging/pack-msix.ps1` — wrapper around `MakeAppx` to create an MSIX from `docs/`
- `packaging/sign-msix.ps1` — wrapper around `SignTool` to sign the MSIX with a PFX
- `packaging/AppxManifest.xml` — minimal manifest template (adjust Identity/Publisher/Assets)
- `manifests/meechain.viewer/1.0.0/manifest.yaml` — WinGet manifest template (replace <owner>/<repo>)

Quick pack + sign (development)

1. Build the MSIX (from repo root):

```powershell
.
\packaging\pack-msix.ps1 -SourceDir .\docs -OutFile .\releases\MeeBotViewer.msix -Overwrite
```

2. Create or use a PFX certificate (development):

```powershell
# create a self-signed cert for testing (local sideload only)
$cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=MeeChain Labs" -CertStoreLocation "Cert:\CurrentUser\My" -KeyExportPolicy Exportable
Export-PfxCertificate -Cert $cert -FilePath .\packaging\certs\MeeChainDev.pfx -Password (ConvertTo-SecureString -String "P@ssw0rd" -Force -AsPlainText)
```

3. Sign the MSIX:

```powershell
.\packaging\sign-msix.ps1 -MsixPath .\releases\MeeBotViewer.msix -PfxPath .\packaging\certs\MeeChainDev.pfx
```

4. Sideload install locally:

```powershell
Add-AppxPackage .\releases\MeeBotViewer.msix
# If certificate is self-signed you may need to install the cert to Trusted People
```

Publish via GitHub Releases

- Upload `MeeBotViewer.msix` to GitHub Releases, tag v1.0.0
- Update `manifests/meechain.viewer/1.0.0/manifest.yaml` InstallerUrl to point to the release asset URL

Submit to WinGet

- Follow the official guidelines at https://github.com/microsoft/winget-pkgs
- Use `manifest.yaml` as the basis for your package in `winget-pkgs`

Notes

- Production packages must be signed by a trusted CA for WinGet distribution; self-signed certs are only for sideload testing.
- Adjust `AppxManifest.xml` Identity and Publisher to match the real certificate subject when signing for production.

## Versioning Source of Truth

All dependency versions (e.g., Microsoft.UI.Xaml, VCLibs) are defined in `DesktopAppInstaller_Dependencies.json`.
CI workflows will auto-fix and validate `manifest.yaml` and `PackageDependencies.json` to match this file.  
Please update `DesktopAppInstaller_Dependencies.json` first before changing any packaging metadata.
