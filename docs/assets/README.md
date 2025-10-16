# Assets Directory

This directory contains the logo and splash screen images for MeeChain MeeBot.

## Required Files

1. **logo.png** (150x150px)
   - App icon for MSIX package
   - Used in AppxManifest.xml
   - Should have transparent background

2. **splash.png** (620x300px)
   - Splash screen for MSIX package
   - Used during app startup
   - Should match app branding

## Current Status

⚠️ **Placeholder files are present**

Replace the `.placeholder` files with actual PNG images:
- Remove the `.placeholder` extension
- Ensure proper dimensions
- Optimize file size for distribution

## Usage

These assets are referenced in:
- `AppxManifest.xml` for MSIX packaging
- GitHub Actions workflow for release artifacts
- Documentation and viewer pages
