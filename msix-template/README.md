# MSIX Package Template

This directory contains the template files for creating the MSIX package.

## Files

- `AppxManifest.xml` - Package manifest with metadata and dependencies

## AppxManifest.xml

The manifest defines:

### Identity
- Package name: `MeeChain.MeeBot`
- Publisher: `CN=MeeChain`
- Version: Updated dynamically by workflow

### Dependencies
1. **Microsoft.UI.Xaml.2.8** (v8.2310.30001.0+)
   - Modern UI framework for Windows apps
   
2. **Microsoft.VCLibs.140.00.UWPDesktop** (v14.0.30704.0+)
   - Visual C++ runtime libraries for UWP Desktop apps

### Capabilities
- `runFullTrust` - Required for full-trust desktop applications
- `internetClient` - Required for network connectivity

## Building MSIX

The GitHub Actions workflow uses this template to:

1. Copy template to build directory
2. Update version number
3. Add application files
4. Add assets (logo, splash)
5. Pack using MakeAppx.exe (Windows SDK)
6. Sign using SignTool.exe with PFX certificate

## Manual Build (Windows only)

```powershell
# Install Windows SDK (includes MakeAppx and SignTool)
# https://developer.microsoft.com/windows/downloads/windows-sdk/

# Pack the MSIX
makeappx pack /d msix-package /p MeeBot.msix

# Sign the MSIX
signtool sign /fd SHA256 /a /f cert.pfx /p PASSWORD MeeBot.msix
```

## Testing

Install the MSIX package:

```powershell
# Add developer mode or install certificate first
Add-AppxPackage MeeBot.msix
```

## References

- [MSIX Packaging Documentation](https://docs.microsoft.com/windows/msix/)
- [App Manifest Schema](https://docs.microsoft.com/uwp/schemas/appxpackage/appx-package-manifest)
- [MakeAppx Tool](https://docs.microsoft.com/windows/msix/package/create-app-package-with-makeappx-tool)
