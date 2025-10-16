# MeeChain IPFS Uploader 🚀

Fallback-aware IPFS uploader for MeeChain badge NFTs with comprehensive metadata generation and local fallback support.

## 🏗️ Project Structure

```
copilot/
├── ipfs-uploader/
│   ├── index.js              # Main IPFS upload logic with retry
│   ├── config.js             # Fallback-aware configuration
│   ├── metadata-generator.js # ERC-721 compliant metadata generator
│   ├── fallback-viewer.js    # Local fallback asset viewer
│   └── utils/
│       ├── validate.js       # File and metadata validation
│       └── hash.js           # IPFS CID and hash utilities
├── assets/
│   ├── badges/               # Badge images to upload
│   │   ├── README.md
│   │   └── .gitkeep
│   └── fallback/             # Fallback assets (when IPFS unavailable)
│       ├── README.md
│       ├── badge-placeholder.svg
│       └── .gitkeep
├── milestone.log             # MeeBot sprite feedback tracker
└── README.md                 # This file
```

## 📋 Features

- ✅ **IPFS Upload**: Upload badge images and metadata to IPFS
- ✅ **Fallback Support**: Automatic fallback to alternative endpoints
- ✅ **Retry Logic**: Configurable retry attempts with delays
- ✅ **Metadata Generation**: ERC-721 compliant NFT metadata
- ✅ **File Validation**: Size, type, and integrity checks
- ✅ **Hash Verification**: CID validation and file integrity
- ✅ **Local Fallback**: Serve local assets when IPFS unavailable
- ✅ **Batch Upload**: Upload multiple badges efficiently

## 🚀 Quick Start

### Installation

```bash
cd copilot/ipfs-uploader
npm install  # If dependencies needed
```

### Configuration

Set environment variables or use defaults from `config.js`:

```bash
# IPFS endpoint
export IPFS_ENDPOINT="https://ipfs.infura.io:5001"

# Timeout and retry settings
export IPFS_TIMEOUT=5000
export IPFS_MAX_RETRIES=3
export IPFS_RETRY_DELAY=1000

# API credentials (if using Pinata or similar)
export PINATA_JWT="your-jwt-token"
```

### Basic Usage

```javascript
const { uploadBadge } = require('./ipfs-uploader')

// Upload a single badge
const result = await uploadBadge({
  filePath: './assets/badges/quest-001.png',
  questId: 'quest-001',
  badgeId: 'badge-quest-001',
  name: 'MeeChain Pioneer',
  description: 'Completed the first quest on MeeChain',
  attributes: {
    badgeType: 'Achievement',
    rarity: 'Common',
    chain: 'polygon'
  }
})

console.log(result)
// {
//   success: true,
//   imageCID: 'QmXxx...',
//   imageUrl: 'https://ipfs.io/ipfs/QmXxx...',
//   metadataCID: 'QmYyy...',
//   metadataUrl: 'https://ipfs.io/ipfs/QmYyy...',
//   metadata: { ... }
// }
```

### Batch Upload

```javascript
const { uploadBadges } = require('./ipfs-uploader')

const badges = [
  {
    filePath: './assets/badges/quest-001.png',
    questId: 'quest-001',
    name: 'Pioneer Badge'
  },
  {
    filePath: './assets/badges/quest-002.png',
    questId: 'quest-002',
    name: 'Explorer Badge'
  }
]

const results = await uploadBadges(badges)
console.log(`Uploaded ${results.filter(r => r.success).length}/${results.length} badges`)
```

## 🛡️ Fallback-Aware Logic

The uploader implements a multi-tier fallback strategy:

### 1. Primary IPFS Endpoint
```javascript
// config.js
ipfsEndpoint: 'https://ipfs.infura.io:5001'
```

### 2. Retry with Backoff
```javascript
retryOnFail: true,
maxRetries: 3,
retryDelay: 1000  // ms between retries
```

### 3. Fallback Endpoints
```javascript
fallbackEndpoints: [
  'https://api.pinata.cloud/pinning',
  'https://ipfs.io',
  'https://dweb.link'
]
```

### 4. Local Fallback Assets
When all IPFS endpoints fail, serve local assets from `assets/fallback/`:

```javascript
const { getFallbackAssetPath } = require('./ipfs-uploader/fallback-viewer')

const path = getFallbackAssetPath('quest-001')
// Returns: './assets/fallback/quest-001.png' or badge-placeholder
```

## 📊 Metadata Format

Generated metadata follows ERC-721 standard:

```json
{
  "name": "MeeChain Pioneer",
  "description": "Completed the first quest on MeeChain",
  "image": "ipfs://QmXxx...",
  "external_url": "https://meechain.io/badges/badge-quest-001",
  "attributes": [
    {
      "trait_type": "Quest ID",
      "value": "quest-001"
    },
    {
      "trait_type": "Badge Type",
      "value": "Achievement"
    },
    {
      "trait_type": "Rarity",
      "value": "Common"
    },
    {
      "trait_type": "Chain",
      "value": "polygon"
    },
    {
      "display_type": "date",
      "trait_type": "Minted",
      "value": 1696896000
    }
  ],
  "properties": {
    "questId": "quest-001",
    "badgeId": "badge-quest-001",
    "version": "1.0.0",
    "schema": "ERC721"
  }
}
```

## 🗓️ Milestones & MeeBot Feedback

| Milestone | Goal | Status | MeeBot Sprite |
|-----------|------|--------|---------------|
| M1: Uploader Init | Create structure & config | ✅ Complete | 🟢 "Uploader scaffolded!" |
| M2: Metadata Generator | Generate ERC-721 metadata | ✅ Complete | 🟣 "Metadata ready!" |
| M3: Fallback Validation | Test fallback logic | 🔄 In Progress | 🔵 "Fallback validated!" |
| M4: Integration Test | Upload & verify | ⏳ Pending | 🟠 "Uploader tested!" |
| M5: Merge to Main | Production ready | ⏳ Pending | 🟡 "Uploader live!" |

Progress tracked in `milestone.log` - triggers MeeBot sprite feedback automatically.

## 🧪 Testing

### Automated Verification

Run the complete MeeBot flow verification:

```bash
npm run verify:meebot
```

This automated script checks:
- 🟡 Milestone log completeness (M1-M5)
- 🟣 Badge assets matching milestones
- 🟢 Config with simulation/fallback mode
- 🔵 Uploader integration with metadata generator
- 🟠 Viewer and MeeBot integration

**See [VERIFICATION_GUIDE.md](./VERIFICATION_GUIDE.md) for detailed documentation.**

### Manual Test

```bash
node -e "
const { uploadBadge } = require('./ipfs-uploader');
uploadBadge({
  filePath: './assets/badges/test-badge.png',
  questId: 'test-quest',
  name: 'Test Badge'
}).then(console.log);
"
```

### Validation Tests

```javascript
const { validateFile } = require('./ipfs-uploader/utils/validate')
const { validateCID } = require('./ipfs-uploader/utils/hash')

// Test file validation
const fileResult = validateFile('./assets/badges/quest-001.png')
console.log('File valid:', fileResult.valid)

// Test CID validation
console.log('CID valid:', validateCID('QmXxx...'))
```

### Fallback Viewer Test

```javascript
const { generateFallbackViewerHTML } = require('./ipfs-uploader/fallback-viewer')

const html = generateFallbackViewerHTML('quest-001')
console.log(html)  // HTML viewer for the fallback asset
```

## 🔧 API Reference

### Main Functions

#### `uploadFile(filePath, options)`
Upload a single file to IPFS.

**Parameters:**
- `filePath` (string): Path to file
- `options` (object): Upload options
  - `questId` (string): Quest identifier

**Returns:** Promise<{ success, cid, gatewayUrl, ipfsUrl, ... }>

#### `uploadBadge(badgeOptions)`
Upload badge image and generate metadata.

**Parameters:**
- `badgeOptions` (object):
  - `filePath` (string): Path to badge image
  - `questId` (string): Quest ID
  - `badgeId` (string): Badge ID
  - `name` (string): Badge name
  - `description` (string): Badge description
  - `attributes` (object): Additional attributes

**Returns:** Promise<{ success, imageCID, metadataCID, metadata, ... }>

#### `uploadBadges(badges)`
Batch upload multiple badges.

**Parameters:**
- `badges` (array): Array of badge option objects

**Returns:** Promise<Array<{ index, badge, success, ... }>>

### Utility Functions

See individual files for complete API:
- `utils/validate.js` - File and metadata validation
- `utils/hash.js` - CID and hash utilities
- `metadata-generator.js` - Metadata generation
- `fallback-viewer.js` - Fallback asset management

## 🧩 Integration with MeeChain

```javascript
// In your quest/badge minting flow:
const { uploadBadge } = require('../copilot/ipfs-uploader')

async function mintBadgeNFT(userId, questId) {
  // 1. Upload badge to IPFS
  const upload = await uploadBadge({
    filePath: `./assets/badges/${questId}.png`,
    questId,
    name: `MeeChain ${questId} Badge`,
    description: `Achievement badge for ${questId}`,
    attributes: {
      chain: 'polygon',
      badgeType: 'Achievement'
    }
  })
  
  // 2. Mint NFT with metadata URI
  if (upload.success) {
    await mintNFT(userId, upload.metadataUrl)
  } else if (upload.isFallback) {
    // Use fallback metadata
    await mintNFT(userId, upload.metadata)
  }
}
```

## 🧰 Safety Checklist

Before merging to production:

- [x] ✅ Fallback viewer tested on all platforms
- [x] ✅ Metadata follows ERC-721 standard
- [x] ✅ Hash consistency verification implemented
- [x] ✅ Fallback assets available for all badges
- [x] ✅ MeeBot sprite feedback working
- [ ] ⏳ Integration tests with actual IPFS endpoint
- [ ] ⏳ Load testing with batch uploads
- [ ] ⏳ Security audit of uploaded content

## 🐛 Troubleshooting

### IPFS Upload Fails

1. Check endpoint configuration in `config.js`
2. Verify network connectivity
3. Check API credentials (if using Pinata/Infura)
4. Review logs for specific error messages

### Fallback Not Working

1. Ensure fallback assets exist in `assets/fallback/`
2. Check `badge-placeholder.svg` is present
3. Verify file permissions
4. Review `fallback-viewer.js` logs

### Invalid Metadata

1. Use `validateMetadata()` to check compliance
2. Ensure required fields: name, description, image
3. Check attribute format matches ERC-721 standard

## 📝 License

MIT - Part of MeeChain MeeBot project

## 🤝 Contributing

1. Add badge assets to `assets/badges/`
2. Update milestone.log for progress tracking
3. Run validation tests before commit
4. Follow existing code style

---

**MeeBot Status:** 🟢 Uploader scaffolded! Ready for testing and integration.
