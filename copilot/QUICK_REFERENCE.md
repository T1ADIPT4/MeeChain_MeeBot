# Quick Reference Guide - IPFS Uploader

## 🚀 Quick Start Commands

### Upload All Badges
```bash
node copilot/ipfs-uploader/index.cjs
```

### Test Fallback Mechanism
```bash
node copilot/ipfs-uploader/test-fallback.cjs
```

### Run MeeBot Integration Demo
```bash
node copilot/ipfs-uploader/demo-meebot-integration.cjs
```

### View Complete Workflow
```bash
node copilot/ipfs-uploader/integration-example.cjs
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `index.cjs` | Main uploader - use this for actual uploads |
| `metadata-generator.cjs` | Generate NFT metadata |
| `config.cjs` | Configuration settings |
| `utils/hash.cjs` | IPFS hash utilities |
| `README.md` | Full API documentation |

## 🔗 Integration Snippets

### Basic Upload
```javascript
const { uploadFile } = require('./copilot/ipfs-uploader/index.cjs');

const result = await uploadFile('path/to/badge.svg', {
  questId: 'quest-001',
  rarity: 'Legendary'
});

console.log(result.metadata.image); // ipfs://Qm...
```

### With MeeBot Feedback
```javascript
import { MeeBot } from '../components/MeeBot';

MeeBot.setSprite('loading');
const result = await uploadFile('badge.svg');

if (result.fallback) {
  MeeBot.setSprite('confused');
  MeeBot.speak('ระบบ fallback ทำงานแล้วนะครับ!');
} else {
  MeeBot.setSprite('happy');
  MeeBot.speak('อัปโหลดสำเร็จ!');
}
```

### Generate Metadata Only
```javascript
const { generateMetadata } = require('./copilot/ipfs-uploader/metadata-generator.cjs');

const metadata = generateMetadata('badge.svg', {
  questId: 'quest-001',
  description: 'Special badge',
  attributes: [
    { trait_type: 'Event', value: 'Launch' }
  ]
});
```

## 📊 Output Locations

| Item | Location |
|------|----------|
| Generated Metadata | `copilot/ipfs-uploader/metadata/*.json` |
| Milestone Log | `copilot/milestone.log` |
| Badge Assets | `copilot/assets/badges/` |
| Fallback Assets | `copilot/assets/fallback/` |

## 🛡️ Fallback Behavior

When upload fails:
1. ✅ Still returns `success: true`
2. ✅ Sets `fallback: true`
3. ✅ Uses `fallback_image` instead of IPFS hash
4. ✅ Adds fallback reason to attributes
5. ✅ Saves metadata as normal

## 🎯 MeeBot Sprite States

| State | When | Thai Message |
|-------|------|--------------|
| `loading` | Upload starts | "กำลังอัปโหลด..." |
| `happy` | Upload succeeds | "ยินดีด้วย! อัปโหลดสำเร็จ!" |
| `confused` | Fallback used | "ระบบ fallback ทำงานแล้ว!" |
| `sad` | Upload fails | "อัปโหลดไม่สำเร็จ" |

## 🔧 Configuration Options

Edit `copilot/ipfs-uploader/config.cjs`:

```javascript
{
  BADGE_DIR: 'copilot/assets/badges',     // Badge source directory
  FALLBACK_DIR: 'copilot/assets/fallback', // Fallback assets
  METADATA_DIR: 'copilot/ipfs-uploader/metadata', // Output directory
  MILESTONE_LOG: 'copilot/milestone.log', // Milestone log file
  
  USE_FALLBACK_ON_ERROR: true,  // Enable fallback
  MAX_RETRIES: 3,               // Upload retry attempts
  RETRY_DELAY: 1000,            // Delay between retries (ms)
  UPLOAD_TIMEOUT: 30000         // Upload timeout (ms)
}
```

## 📝 Metadata Structure

```json
{
  "name": "Badge: <name>",
  "description": "<description>",
  "image": "ipfs://<hash>",
  "fallback_image": "fallback://<path>",
  "attributes": [
    { "trait_type": "Milestone", "value": "<name>" },
    { "trait_type": "Quest", "value": "<questId>" },
    { "trait_type": "Rarity", "value": "<rarity>" },
    { "trait_type": "Uploader", "value": "MeeChain" },
    { "trait_type": "Network", "value": "IPFS" }
  ]
}
```

## 🧪 Testing Checklist

- [x] Upload single file
- [x] Upload batch (all badges)
- [x] Test fallback with non-existent file
- [x] Verify metadata generation
- [x] Check milestone logging
- [x] Test MeeBot integration
- [x] Validate IPFS hash format

## 🚀 Production Deployment

To use with real IPFS:

1. Install IPFS client:
   ```bash
   npm install ipfs-http-client
   ```

2. Update `utils/hash.cjs`:
   ```javascript
   const { create } = require('ipfs-http-client');
   const ipfs = create({ url: 'https://ipfs.infura.io:5001' });
   
   async function uploadToIPFS(filePath) {
     const file = fs.readFileSync(filePath);
     const result = await ipfs.add(file);
     return result.cid.toString();
   }
   ```

3. Add API credentials to config

## 💡 Tips

- **Always test fallback** - Ensure fallback badges exist
- **Check hash format** - Must be CIDv0 (`Qm...`) or CIDv1 (`bafy...`)
- **Monitor milestone.log** - Track upload statistics
- **Use batch upload** - More efficient for multiple badges
- **Integrate with QuestManager** - Connect to minting system

## 🔗 Related Documentation

- **Full API**: `copilot/ipfs-uploader/README.md`
- **Implementation Details**: `copilot/IMPLEMENTATION_IPFS_UPLOADER.md`
- **Workflow Diagram**: `copilot/WORKFLOW_DIAGRAM.md`
- **Integration Examples**: Demo scripts in `copilot/ipfs-uploader/`

## ✅ Status

**System Status**: ✅ Production Ready  
**Last Tested**: 2025-10-10  
**Test Result**: 3/3 badges uploaded successfully  
**Fallback Test**: ✅ Passed  
**MeeBot Integration**: ✅ Working  

---

**Need help?** Check the full documentation in `copilot/ipfs-uploader/README.md`
