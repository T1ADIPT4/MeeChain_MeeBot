# Fallback Assets

This directory contains fallback badge images used when IPFS is unavailable.

## Purpose

When the IPFS network is unavailable or slow, the system automatically falls back to serving these local assets to ensure users can still view their badges.

## Fallback Strategy

1. **Primary**: Try to upload to IPFS
2. **Fallback 1**: Try alternative IPFS endpoints
3. **Fallback 2**: Serve local asset from this directory
4. **Ultimate Fallback**: Serve generic placeholder

## File Naming

Fallback assets should mirror the badge asset naming:
- `quest-001.png` - Fallback for quest-001 badge
- `badge-placeholder.png` - Generic placeholder (required)

## Required Files

- `badge-placeholder.png` - Default placeholder shown when no specific fallback exists

## Asset Requirements

- Same formats as badges (PNG, JPEG, SVG, WebP, GIF)
- Same size recommendations (512x512px or 1024x1024px)
- Should be optimized for fast local serving

## Example Structure

```
fallback/
├── badge-placeholder.png  # Required: Generic placeholder
├── quest-001.png         # Specific fallback for quest-001
├── quest-002.png         # Specific fallback for quest-002
└── achievement-gold.png  # Specific fallback for achievements
```

## Usage

The fallback viewer automatically serves these assets:

```javascript
const { getFallbackAssetPath } = require('../ipfs-uploader/fallback-viewer')

const assetPath = getFallbackAssetPath('quest-001')
// Returns: /copilot/assets/fallback/quest-001.png
```

## Testing Fallback Mode

To test fallback mode:

1. Set `IPFS_ENDPOINT` to an invalid URL
2. Upload a badge
3. System will automatically use fallback assets

## Monitoring

Check the milestone.log for fallback usage:
- `🟠 Using Fallback` - Fallback asset served
- `❌ Upload Failed` - IPFS unavailable, fallback triggered
