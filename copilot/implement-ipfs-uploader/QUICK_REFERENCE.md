# Metadata Generator - Quick Reference 🚀

## Generate Metadata

```bash
npm run ipfs:generate-metadata
```

## Run Tests

```bash
npm run ipfs:test-metadata
```

## View MeeBot Integration

```bash
npm run ipfs:meebot-demo
```

## Add New Badge

1. Add badge to `assets/badges/new-badge.png`
2. Add fallback to `assets/fallback/new-badge.png`
3. Run `npm run ipfs:generate-metadata`
4. Metadata created at `copilot/implement-ipfs-uploader/metadata/new-badge.json`

## File Locations

| Item | Path |
|------|------|
| Generator | `copilot/implement-ipfs-uploader/metadata-generator.js` |
| Tests | `copilot/implement-ipfs-uploader/test-metadata-generator.js` |
| MeeBot Demo | `copilot/implement-ipfs-uploader/meebot-milestone-example.js` |
| Documentation | `copilot/implement-ipfs-uploader/README.md` |
| Badge Assets | `assets/badges/` |
| Fallback Assets | `assets/fallback/` |
| Generated Metadata | `copilot/implement-ipfs-uploader/metadata/` (gitignored) |
| Milestone Log | `milestone.log` (gitignored) |

## Metadata Structure

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

## MeeBot Integration

When metadata generation completes:

1. Appends to `milestone.log`: `M2 complete: Metadata generator ready 🟣`
2. MeeBot reads the log
3. Sets sprite to "happy" 😊
4. Speaks: "Metadata generator พร้อมแล้วครับ! 🟣"

## Safety Features

✅ Verifies fallback assets exist
✅ ERC-721/ERC-1155 compliant metadata
✅ Automated testing suite
✅ MeeBot sprite integration
✅ Generated files gitignored

## Next Steps

1. Implement IPFS upload
2. Replace placeholder hashes with real IPFS CIDs
3. Connect to smart contracts
4. Integrate with dashboard
