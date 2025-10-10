# MeeBot Flow Verification

## Overview

This document describes the automated verification script for MeeChain MeeBot system. The script validates all requirements from the pilot checklist (Checklist ตรวจสอบงานนักบิน).

## Running the Verification

```bash
npm run verify:meebot
```

Or run directly:

```bash
node copilot/verifyMeeBotFlow.js
```

## Checklist Categories

### 🟡 1. Milestone Log

Verifies:
- [ ] `milestone.log` file exists in repo
- [ ] Contains milestones M1–M5 (or more)
- [ ] Uses format readable by `milestoneReader.ts` (e.g., "M2: สร้างระบบอัปโหลด NFT")
- [ ] Has MeeBot sprite feedback triggers per milestone

**Location**: `copilot/milestone.log`

**Format Example**:
```
[2025-10-10T03:15:00.000Z] M1: Uploader Init
Status: ✅ Complete
Details: Created ipfs-uploader directory structure
MeeBot: 🟢 "Uploader scaffolded!"
```

### 🟣 2. Badge Assets

Verifies:
- [ ] SVG files for each milestone exist (`milestone-1.svg`, `milestone-2.svg`, etc.)
- [ ] Fallback badge exists (`badge-placeholder.svg` in `copilot/assets/fallback/`)
- [ ] Badges have colors matching latest theme
- [ ] Badges display milestone numbers clearly
- [ ] Badges can connect to viewer or deploy dashboard

**Locations**:
- Badge assets: `copilot/assets/badges/`
- Fallback assets: `copilot/assets/fallback/`

### 🟢 3. Config & Simulation

Verifies:
- [ ] `config.js` exists with simulation mode toggle
- [ ] Fallback-aware endpoints configured (`ipfsImageUpload`, `fallbackAssetPath`)
- [ ] Comments/TODOs for IPFS integration (`ipfs-http-client`)
- [ ] System can detect simulation vs production mode

**Location**: `copilot/ipfs-uploader/config.js`

**Key Features**:
- Primary IPFS endpoint
- Fallback IPFS endpoints array
- Retry configuration
- Fallback asset path
- File validation settings

### 🔵 4. Uploader & Metadata

Verifies:
- [ ] `index.js` connects to `metadata-generator.js` correctly
- [ ] Badge upload with hash population in metadata
- [ ] Upload failure → fallback image usage
- [ ] Milestone log trigger on successful upload

**Locations**:
- Main uploader: `copilot/ipfs-uploader/index.js`
- Metadata generator: `copilot/ipfs-uploader/metadata-generator.js`
- Implementation example: `copilot/implement-ipfs-uploader/metadata-generator.js`

**Key Functions**:
- `uploadFile()` - Upload file to IPFS with retry
- `uploadMetadata()` - Upload metadata JSON to IPFS
- `uploadBadge()` - Complete badge upload with metadata
- `generateBadgeMetadata()` - Generate ERC-721 compliant metadata

### 🟠 5. Viewer & MeeBot Integration

Verifies:
- [ ] Viewer (`/docs/index.html` or React viewer) loads badges from milestones
- [ ] MeeBot displays sprite or speaks based on milestone reading
- [ ] Fallback sprite system if milestones incomplete
- [ ] Thai language support in milestone and MeeBot feedback

**Locations**:
- Viewer: `copilot/ipfs-uploader/fallback-viewer.js`
- MeeBot component: `components/MeeBot.tsx`
- Integration example: `copilot/implement-ipfs-uploader/meebot-milestone-example.js`

**MeeBot Features**:
- Sprite modes: happy, sad, confused, loading, neutral
- TTS (Text-to-Speech) support
- Thai language feedback
- Milestone-based feedback system

## Verification Results

The script provides:

1. **Individual Checks**: Each requirement with ✅ (pass) or ❌ (fail)
2. **Category Summary**: Percentage completion for each category
3. **Overall Score**: Total percentage of all checks

### Success Criteria

- **100%**: 🎉 All MeeBot flow checks passed!
- **80-99%**: ⚠️ Most checks passed, but some items need attention
- **<80%**: ❌ Several checks failed, review needed

## Common Issues and Fixes

### Missing Milestone Badges

**Issue**: `milestone-X.svg` not found

**Fix**:
```bash
# Create missing milestone badges in copilot/assets/badges/
# Use consistent SVG format with milestone number
```

### Fallback Placeholder Missing

**Issue**: `badge-placeholder.svg` not found in fallback directory

**Fix**:
```bash
# Add placeholder badge to copilot/assets/fallback/
# This is used when specific fallback not available
```

### Config Not Found

**Issue**: `config.js` missing or not properly configured

**Fix**:
```bash
# Ensure copilot/ipfs-uploader/config.js exists
# Must have: ipfsEndpoint, fallbackEndpoints, fallbackAssetPath
```

### MeeBot Component Issues

**Issue**: MeeBot not responding to milestones

**Fix**:
1. Check `components/MeeBot.tsx` has `milestoneFeedback()` method
2. Verify milestone.log format is correct
3. Test with: `npm run ipfs:meebot-demo`

## Integration Testing

### Test Milestone Trigger

```bash
# Generate metadata and trigger milestone
npm run ipfs:generate-metadata

# Watch for MeeBot response
npm run ipfs:meebot-demo
```

### Test Badge Upload

```javascript
// Example: Upload badge with fallback
const { uploadBadge } = require('./copilot/ipfs-uploader/index.js');

const result = await uploadBadge({
  filePath: './copilot/assets/badges/milestone-1.svg',
  questId: 'milestone-1',
  badgeId: 'badge-m1',
  name: 'Milestone 1 Badge',
  description: 'Completed first milestone'
});

console.log(result);
```

### Test Fallback System

```bash
# Set IPFS endpoint to invalid URL to test fallback
export IPFS_ENDPOINT="http://invalid-endpoint"

# Run upload - should use fallback
npm run ipfs:generate-metadata
```

## Extending the Verification

To add new checks, edit `copilot/verifyMeeBotFlow.js`:

```javascript
// Add to appropriate verification function
function verifyCustomCheck() {
  const myCheck = /* your check logic */;
  printCheck(myCheck, 'My custom check description');
  results.category.push({ check: 'Custom check', passed: myCheck });
}
```

## Related Documentation

- [IPFS Uploader README](./README.md)
- [Implementation Guide](./IMPLEMENTATION_IPFS_UPLOADER.md)
- [Workflow Diagram](./WORKFLOW_DIAGRAM.md)
- [Quick Reference](./QUICK_REFERENCE.md)

## Troubleshooting

### Script Not Running

**Error**: `require is not defined`

**Solution**: The project uses ES modules. Ensure the script uses `import` syntax, not `require`.

### Permission Denied

**Error**: `EACCES: permission denied`

**Solution**: 
```bash
chmod +x copilot/verifyMeeBotFlow.js
```

### Module Not Found

**Error**: Cannot find module 'X'

**Solution**: Install dependencies
```bash
npm install
```

## Summary

The MeeBot Flow Verification script automates all checklist items from the pilot requirements. It provides:

- ✅ Comprehensive validation of all 5 categories
- ✅ Clear pass/fail indicators
- ✅ Percentage-based scoring
- ✅ Actionable feedback for failures
- ✅ Integration with existing test suite

Run `npm run verify:meebot` regularly to ensure all MeeBot requirements are met!
