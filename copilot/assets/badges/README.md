# Badge Assets

This directory contains badge image files that will be uploaded to IPFS for NFT minting.

## 📁 Directory Structure

```
badges/
├── quest-001-badge.png  # Example badge for quest 001
├── quest-002-badge.png  # Example badge for quest 002
└── ...
```

## 🎨 Badge Requirements

- **Format**: PNG, JPEG, GIF, SVG, or WebP
- **Max Size**: 10 MB (configurable)
- **Recommended Dimensions**: 512x512 pixels or higher
- **Transparency**: Supported (PNG recommended)

## 📝 Naming Convention

Use descriptive names that include the quest ID:
- `quest-[id]-badge.png`
- `achievement-[name]-badge.png`
- `special-event-[name].png`

## 🚀 Usage

Place your badge images in this directory before running the uploader:

```javascript
import { uploadToIPFS } from '../ipfs-uploader/index.js'

const result = await uploadToIPFS('./copilot/assets/badges/quest-001-badge.png', {
  questId: 'quest-001',
  badgeName: 'First Quest Completion',
  badgeDescription: 'Awarded for completing your first quest in MeeChain'
})
```

## 🔍 Example Badge

To get started, you can create a simple badge using any image editor or generate one programmatically.

**Sample SVG Badge**:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
  <circle cx="256" cy="256" r="200" fill="#667eea"/>
  <text x="256" y="280" font-size="48" fill="white" text-anchor="middle">QUEST</text>
  <text x="256" y="330" font-size="32" fill="white" text-anchor="middle">001</text>
</svg>
```

---

**Note**: This is a placeholder directory. Add your actual badge images here before uploading.
