# MeeChain Badge Assets

This directory contains badge images that will be uploaded to IPFS.

## Structure

Each badge should be named according to its quest ID:
- `quest-001.png` - Badge for quest-001
- `quest-002.png` - Badge for quest-002
- etc.

## Supported Formats

- PNG (recommended)
- JPEG/JPG
- SVG
- WebP
- GIF

## File Size Limits

Maximum file size: 10MB

## Best Practices

1. Use transparent backgrounds (PNG recommended)
2. Recommended size: 512x512px or 1024x1024px
3. Keep file sizes optimized (< 1MB when possible)
4. Use descriptive file names based on quest IDs

## Examples

```
badges/
├── quest-001.png          # First quest badge
├── quest-tts-001.png      # TTS quest badge
├── quest-analytics.png    # Analytics quest badge
└── achievement-gold.png   # Special achievement badge
```

## Usage

These assets are automatically uploaded to IPFS when using the uploader:

```javascript
const { uploadBadge } = require('../ipfs-uploader')

await uploadBadge({
  filePath: './assets/badges/quest-001.png',
  questId: 'quest-001',
  name: 'MeeChain Pioneer',
  description: 'Completed the first quest!'
})
```
