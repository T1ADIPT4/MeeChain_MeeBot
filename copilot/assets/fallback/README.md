# Fallback Assets

This directory contains fallback versions of badge assets that are used when IPFS is unavailable.

## 🎯 Purpose

Fallback assets ensure that badges are always accessible, even if:
- IPFS gateway is down
- Network connectivity issues
- IPFS hash becomes temporarily unavailable

## 📁 Directory Structure

```
fallback/
├── quest-001-badge.png  # Fallback for quest 001
├── quest-002-badge.png  # Fallback for quest 002
└── ...
```

## 🔄 How It Works

1. **Primary Upload**: Badge is uploaded to IPFS first
2. **Fallback Copy**: A copy is stored in fallback storage
3. **Automatic Switch**: System automatically uses fallback if IPFS fails
4. **Viewer Support**: Fallback viewer provides alternative gateways

## 📝 Requirements

- **Identical to Primary**: Fallback assets should be identical to IPFS versions
- **Same Naming**: Use the same filenames as the badges directory
- **Always Available**: Store in reliable, accessible location

## 🚨 Fallback Activation

The system automatically detects IPFS failures and switches to fallback:

```javascript
import { uploadToIPFS } from '../ipfs-uploader/index.js'

// Automatically uses fallback if IPFS fails
const result = await uploadToIPFS('./badge.png', {
  questId: 'quest-001'
})

if (result.isFallback) {
  console.log('⚠️ Using fallback storage')
  console.log(`Fallback URL: ${result.url}`)
}
```

## 🔍 Fallback Viewer

The fallback viewer provides multiple ways to access assets:

```javascript
import { getAssetWithFallback } from '../ipfs-uploader/fallback-viewer.js'

// Automatically tries IPFS first, then fallback
const asset = await getAssetWithFallback(
  'QmPrimaryHash...', 
  'fallback_hash_123'
)

console.log(`Using: ${asset.usedFallback ? 'Fallback' : 'IPFS'}`)
console.log(`URL: ${asset.url}`)
```

## 🔐 Best Practices

1. **Redundancy**: Keep fallback copies synchronized with IPFS
2. **Verification**: Regularly verify fallback assets are accessible
3. **Monitoring**: Monitor fallback usage to detect IPFS issues
4. **Updates**: Update fallback copies when badges are re-uploaded

## 📊 Monitoring

Track fallback usage through MeeBot feedback:

- 🟢 **IPFS Success**: Primary storage working normally
- 🟠 **Fallback Active**: Using fallback storage
- 🔴 **Both Failed**: Critical - both systems unavailable

---

**Note**: Maintain this directory with up-to-date copies of all badge assets for reliable fallback support.
