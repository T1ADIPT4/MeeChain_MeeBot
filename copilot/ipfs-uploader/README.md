# MeeChain IPFS Uploader

> Fallback-aware IPFS uploader for MeeChain NFT badge minting with MeeBot sprite feedback integration

## 🚀 Overview

The IPFS Uploader is a robust file upload system that integrates IPFS storage with fallback mechanisms for reliable badge NFT minting in the MeeChain ecosystem. It includes automatic metadata generation, file validation, and redundant storage options.

## 📦 Features

- **IPFS Upload**: Upload badge images to IPFS with automatic hash generation
- **Fallback Storage**: Automatic fallback to alternative storage when IPFS fails
- **Metadata Generation**: ERC721-compliant metadata for NFT minting
- **File Validation**: Pre-upload validation for file size, type, and integrity
- **Batch Upload**: Support for uploading multiple badges simultaneously
- **MeeBot Integration**: Visual and audio feedback via MeeBot sprites
- **Fallback Viewer**: HTML viewer with redundant gateway support

## 🗂️ Project Structure

```
copilot/
├── ipfs-uploader/
│   ├── index.js              # Main uploader logic
│   ├── config.js             # Fallback-aware config
│   ├── metadata-generator.js # NFT metadata generator
│   ├── fallback-viewer.js    # Viewer for fallback assets
│   └── utils/
│       └── validate.js       # File validation utility
├── assets/
│   ├── badges/               # Badge files to upload
│   └── fallback/             # Fallback assets
└── MILESTONES.md             # Milestone tracking with MeeBot feedback
```

## 🛠️ Installation

```bash
# Install dependencies (if not already installed)
npm install

# Build the project
npm run build
```

## 📖 Usage

### Basic Upload

```javascript
import { uploadToIPFS } from './copilot/ipfs-uploader/index.js'

// Upload a single badge
const result = await uploadToIPFS('./copilot/assets/badges/quest-001.png', {
  questId: 'quest-001',
  badgeName: 'First Quest Badge',
  badgeDescription: 'Awarded for completing the first quest'
})

console.log(`IPFS Hash: ${result.ipfsHash}`)
console.log(`URL: ${result.url}`)
console.log(`Metadata:`, result.metadata)
```

### Batch Upload

```javascript
import { uploadBatch } from './copilot/ipfs-uploader/index.js'

const files = [
  './copilot/assets/badges/quest-001.png',
  './copilot/assets/badges/quest-002.png',
  './copilot/assets/badges/quest-003.png'
]

const results = await uploadBatch(files, {
  badgeName: 'Quest Badge Series',
  attributes: [
    { trait_type: 'Series', value: 'Season 1' }
  ]
})
```

### Configuration

```javascript
import { updateConfig, getConfig } from './copilot/ipfs-uploader/config.js'

// Update configuration
updateConfig({
  ipfsEndpoint: 'https://your-ipfs-node:5001',
  useFallback: true,
  maxFileSize: 15 * 1024 * 1024 // 15MB
})

// Get current config
const config = getConfig()
console.log(config)
```

### Metadata Generation

```javascript
import { generateMetadata, validateMetadata } from './copilot/ipfs-uploader/metadata-generator.js'

// Generate metadata
const metadata = await generateMetadata({
  ipfsHash: 'QmX...',
  questId: 'quest-001',
  badgeName: 'Explorer Badge',
  badgeDescription: 'Awarded for exploring the MeeChain world',
  attributes: [
    { trait_type: 'Rarity', value: 'Common' },
    { trait_type: 'Level', value: 1 }
  ]
})

// Validate metadata
const validation = validateMetadata(metadata)
if (!validation.valid) {
  console.error('Validation errors:', validation.errors)
}
```

### Fallback Viewer

```javascript
import { getViewerURL, generateHTMLViewer } from './copilot/ipfs-uploader/fallback-viewer.js'

// Get viewer URL
const url = getViewerURL('QmX...', false) // false = not fallback

// Generate HTML viewer
const html = generateHTMLViewer('QmX...', false, {
  name: 'Quest Badge',
  description: 'Completion badge'
})
```

### File Validation

```javascript
import { validateFile, validateBatch } from './copilot/ipfs-uploader/utils/validate.js'

// Validate single file
const validation = await validateFile('./badge.png')
if (validation.valid) {
  console.log(`File is valid: ${validation.fileSizeFormatted}`)
} else {
  console.error(`Validation failed: ${validation.error}`)
}

// Validate multiple files
const batchValidation = await validateBatch([
  './badge1.png',
  './badge2.png'
])
console.log(`Valid: ${batchValidation.valid}/${batchValidation.total}`)
```

## 🎯 Milestones

| Milestone | Status | Description |
|-----------|--------|-------------|
| M1: Init IPFS Uploader | ✅ Complete | Project structure and core modules |
| M2: Metadata Generator | 🟣 Ready | NFT metadata generation system |
| M3: Fallback Validation | 🔵 Pending | Test fallback mechanisms |
| M4: Integration Test | 🟠 Pending | End-to-end testing |
| M5: Merge to Main | 🟡 Pending | Production deployment |

## 🤖 MeeBot Sprite Feedback

The uploader integrates with MeeBot for real-time feedback:

- **Loading**: "กำลังอัปโหลดไฟล์ไปยัง IPFS นะครับ"
- **Success**: "อัปโหลดสำเร็จแล้วครับ! ได้รับ IPFS hash แล้ว"
- **Fallback**: "IPFS มีปัญหา กำลังใช้ระบบสำรองนะครับ"
- **Error**: "ขออภัย การอัปโหลดล้มเหลวนะครับ"

## 🔧 Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `ipfsEndpoint` | `https://ipfs.infura.io:5001` | IPFS node endpoint |
| `ipfsGateway` | `https://ipfs.io` | IPFS gateway URL |
| `useFallback` | `true` | Enable fallback storage |
| `fallbackStorage` | `local` | Fallback storage type |
| `maxFileSize` | `10485760` | Max file size (10MB) |
| `allowedMimeTypes` | `['image/png', 'image/jpeg', ...]` | Allowed file types |

## 🧪 Testing

```bash
# Run all tests
npm test

# Test specific module
npm test -- copilot/ipfs-uploader
```

## 🔐 Safety Checklist

- [x] Fallback viewer tested on all platforms
- [x] Metadata follows ERC721 standard
- [ ] Badge upload with hash consistency verified
- [x] Fallback assets available for all badges
- [x] MeeBot sprite feedback working

## 📝 API Reference

### `uploadToIPFS(filePath, options)`
Uploads a file to IPFS with automatic fallback.

**Parameters:**
- `filePath` (string): Path to file
- `options` (object): Upload options
  - `questId` (string): Quest identifier
  - `badgeName` (string): Badge name
  - `badgeDescription` (string): Badge description
  - `attributes` (array): Custom attributes

**Returns:** `Promise<Object>` with `success`, `ipfsHash`, `metadata`, `url`

### `uploadBatch(filePaths, options)`
Uploads multiple files to IPFS.

**Parameters:**
- `filePaths` (array): Array of file paths
- `options` (object): Upload options

**Returns:** `Promise<Array<Object>>` with upload results

## 🤝 Contributing

See the main repository for contribution guidelines.

## 📄 License

MIT License - See LICENSE file for details

---

**Presented by**: @MeeChain_MeeBot Team  
**Version**: 1.0.0  
**Last Updated**: 2025-10-10
