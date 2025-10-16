# MeeChain Docs

This directory contains the deployment viewer and status files for MeeChain MeeBot.

## Structure

- `index.html` - Main viewer page for deployment status
- `status/patch-status.json` - Current deployment status
- `assets/` - Logo and splash screen images

## Usage

The viewer is automatically deployed to GitHub Pages at:
`https://<owner>.github.io/<repo>/`

## Status JSON Format

```json
{
  "version": "1.0.0",
  "patch_file": "meebot-fixes.patch",
  "timestamp": "2025-10-15T15:00:00Z",
  "patch_applied": true,
  "build_success": true,
  "workflow_run_id": "12345",
  "commit_sha": "abc123..."
}
```

## Assets

The assets directory should contain:
- `logo.png` - App logo (150x150px recommended)
- `splash.png` - Splash screen (620x300px recommended)

Replace the placeholder files with actual assets for production use.
