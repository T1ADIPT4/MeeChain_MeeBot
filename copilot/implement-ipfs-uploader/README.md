# IPFS Uploader - Metadata Generator

## 🎯 Overview

This directory contains the metadata generator for NFT badge minting with IPFS upload support and fallback-aware features.

## 📁 Directory Structure

```
copilot/implement-ipfs-uploader/
├── metadata-generator.js   # Main metadata generator script
├── index.js               # Fallback-aware upload demo script
├── meebot-milestone-example.js  # MeeBot milestone integration example
├── test-metadata-generator.js   # Test script for metadata generator
├── metadata/              # Generated metadata files (gitignored)
└── README.md             # This file
```

## 🚀 Usage

### 1. Generate Metadata

Run the metadata generator from the project root:

```bash
npm run ipfs:generate-metadata
```

This will:
1. Read all badge files from `./assets/badges/`
2. Verify fallback assets exist in `./assets/fallback/`
3. Generate NFT metadata compliant with ERC-721/ERC-1155 standards
4. Save metadata files to `./copilot/implement-ipfs-uploader/metadata/`
5. Log milestone completion to `milestone.log` for MeeBot sprite feedback

### 2. Upload Demo (Fallback-Aware)

Run the fallback-aware upload demonstration:

```bash
npm run ipfs:upload-demo
```

This demonstrates:
1. 🔒 **Simulation mode** - Skip actual IPFS upload for testing
2. 📘 **Milestone logging** - Track progress in `milestone.log`
3. 🟡 **Blocked log creation** - Create `/home/runner/work/_temp/runtime-logs/blocked.md`
4. ✅ **Metadata generation** - Generate and save to `./output/metadata.json`
5. 🧩 **Fallback handling** - Use fallback CID when upload fails

### 3. MeeBot Demo

View MeeBot milestone feedback:

```bash
npm run ipfs:meebot-demo
```

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

### Upload Script (`index.js`)

The upload demo script showcases fallback-aware IPFS upload:

- **Simulation Mode**: Controlled via `config.simulationMode` - skips actual IPFS upload
- **Fallback CID**: Returns `FALLBACK_CID` when upload fails
- **Milestone Logging**: Automatically logs to `milestone.log`
- **Blocked Log**: Creates `/home/runner/work/_temp/runtime-logs/blocked.md`
- **Safe Upload**: Validates files before upload, handles errors gracefully

### Metadata Generator

- **`fallback_image`**: Used when IPFS cannot load the primary image
- **`milestone.log`**: Triggers MeeBot sprite feedback for milestone completion
- **`attributes`**: Supports NFT viewers with trait and milestone information

## 🧪 Safety Checklist

- ✅ Verifies fallback assets exist before generating metadata
- ✅ Metadata compliant with ERC-721/ERC-1155 standards
- ✅ Triggers milestone.log for MeeBot sprite feedback
- ✅ Ready for integration with deploy dashboard `/docs/index.html`

## 🤖 MeeBot Integration

### Metadata Generator

When the metadata generator completes successfully, it appends to `milestone.log`:

```
M2 complete: Metadata generator ready 🟣
```

### Upload Demo (M5)

When the upload demo completes successfully, it appends to `milestone.log`:

```
M5: อัปโหลด badge และสร้าง metadata สำเร็จ
```

This triggers MeeBot to:
- Set sprite to "happy" 😊
- Display feedback: "MeeBot: อัปโหลดและบันทึก milestone สำเร็จ!"
- Show yellow/gold milestone indicator 🟡
- Track completion in milestone system

## 🔗 Related Files

- `assets/badges/` - Source badge images
- `assets/fallback/` - Fallback badge images
- `milestone.log` - MeeBot feedback trigger log
- `components/MeeBot.tsx` - MeeBot sprite component

## 📝 Notes

- The `ipfs://` hashes in metadata are placeholders and should be replaced after actual IPFS upload
- Generated metadata files are gitignored and regenerated on each run
- Fallback assets must have the same filename as badge assets
