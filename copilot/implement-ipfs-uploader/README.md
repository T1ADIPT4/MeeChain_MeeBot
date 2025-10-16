# IPFS Uploader - Metadata Generator

## 🎯 Overview

This directory contains the metadata generator for NFT badge minting with IPFS upload support and fallback-aware features.

## 📁 Directory Structure

```
copilot/implement-ipfs-uploader/
├── metadata-generator.js   # Main metadata generator script
├── metadata/              # Generated metadata files (gitignored)
└── README.md             # This file
```

## 🚀 Usage

Run the metadata generator from the project root:

```bash
node copilot/implement-ipfs-uploader/metadata-generator.js
```

This will:
1. Read all badge files from `./assets/badges/`
2. Verify fallback assets exist in `./assets/fallback/`
3. Generate NFT metadata compliant with ERC-721/ERC-1155 standards
4. Save metadata files to `./copilot/implement-ipfs-uploader/metadata/`
5. Log milestone completion to `milestone.log` for MeeBot sprite feedback

## 📄 Generated Metadata Format

Each badge generates a JSON metadata file with the following structure:

```json
{
  "name": "Badge: quest-001",
  "description": "NFT badge for quest-001",
  "image": "ipfs://quest-001-hash",
  "fallback_image": "./assets/fallback/quest-001.png",
  "attributes": [
    { "trait_type": "Milestone", "value": "quest-001" },
    { "trait_type": "Uploader", "value": "MeeChain" }
  ]
}
```

## 🛡️ Fallback-Aware Features

- **`fallback_image`**: Used when IPFS cannot load the primary image
- **`milestone.log`**: Triggers MeeBot sprite feedback for milestone completion
- **`attributes`**: Supports NFT viewers with trait and milestone information

## 🧪 Safety Checklist

- ✅ Verifies fallback assets exist before generating metadata
- ✅ Metadata compliant with ERC-721/ERC-1155 standards
- ✅ Triggers milestone.log for MeeBot sprite feedback
- ✅ Ready for integration with deploy dashboard `/docs/index.html`

## 🤖 MeeBot Integration

When the metadata generator completes successfully, it appends to `milestone.log`:

```
M2 complete: Metadata generator ready 🟣
```

This triggers MeeBot to:
- Set sprite to "happy" 😊
- Display feedback: "Metadata generator พร้อมแล้วครับ!"
- Show purple milestone indicator 🟣

## 🔗 Related Files

- `assets/badges/` - Source badge images
- `assets/fallback/` - Fallback badge images
- `milestone.log` - MeeBot feedback trigger log
- `components/MeeBot.tsx` - MeeBot sprite component

## 📝 Notes

- The `ipfs://` hashes in metadata are placeholders and should be replaced after actual IPFS upload
- Generated metadata files are gitignored and regenerated on each run
- Fallback assets must have the same filename as badge assets
