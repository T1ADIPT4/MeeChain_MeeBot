
# 🚀 MeeChain Deployment Guide บน Replit

## 📋 Pre-Deployment Checklist

### 🔧 Environment Variables (ตั้งใน Replit Secrets)
```bash
# Blockchain Configuration
VITE_TOKEN_CONTRACT_ADDRESS=0x...
VITE_NFT_CONTRACT_ADDRESS=0x...
VITE_FUSE_RPC_URL=https://rpc.fuse.io
VITE_CHAIN_ID=122

# Custom Token Support
VITE_CUSTOM_TOKEN_ADDRESS=0xa669b1F45F84368fBe48882bF8d1814aae7a4422

# Database
DATABASE_URL=file:./dev.db
NODE_ENV=production

# API Keys (if needed)
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret
```

### 🎯 Contract Deployment Sequence
1. Deploy MeeToken contract first
2. Deploy BadgeNFT contract  
3. Deploy QuestManager contract (with MeeToken and BadgeNFT addresses)
4. **CRITICAL: Initialize authorization** (see detailed steps below)
5. Upload NFT metadata to IPFS

### ⚡ Critical Authorization Setup (MUST DO AFTER DEPLOYMENT)

After deploying all contracts, you MUST run the authorization setup or quest completion will fail:

#### Method 1: Manual Authorization (RECOMMENDED)
```javascript
// Get contract addresses first
const { meeTokenAddress, badgeNFTAddress, questManagerAddress } = 
  await questManagerContract.getContractAddresses();

console.log('Contract addresses:');
console.log('MeeToken:', meeTokenAddress);
console.log('BadgeNFT:', badgeNFTAddress);
console.log('QuestManager:', questManagerAddress);

// 1. Authorize QuestManager to mint MeeTokens (as MeeToken owner)
await meeTokenContract.authorizeMinter(questManagerAddress);

// 2. Authorize QuestManager to mint BadgeNFTs (as BadgeNFT owner)
await badgeNFTContract.authorizeMinter(questManagerAddress);

console.log('✅ Authorization setup complete!');
```

#### Method 2: QuestManager.initializeAuthorization() (DEPRECATED - WILL FAIL)
```javascript
// ❌ THIS METHOD IS BROKEN - DO NOT USE
// await questManagerContract.initializeAuthorization();
// 
// REASON: initializeAuthorization() calls authorizeMinter() which requires 
// onlyOwner permission, but QuestManager is not the owner of MeeToken/BadgeNFT.
// The deployer (you) owns these contracts, not QuestManager.
```

#### Ownership Transfer Method (Alternative for Advanced Users)
```javascript
// If you want to use initializeAuthorization(), you must transfer ownership first:

// 1. Transfer MeeToken ownership to QuestManager
await meeTokenContract.transferOwnership(questManagerAddress);

// 2. Transfer BadgeNFT ownership to QuestManager  
await badgeNFTContract.transferOwnership(questManagerAddress);

// 3. Now initializeAuthorization() can work
await questManagerContract.initializeAuthorization();

// WARNING: After this, only QuestManager owner can manage these contracts!
```

#### Frontend Integration
Add to your environment variables:
```bash
# Contract addresses after deployment
VITE_MEETOKEN_CONTRACT=0x...
VITE_BADGE_CONTRACT=0x...
VITE_QUESTMANAGER_CONTRACT=0x...
```

### 🔍 Troubleshooting Authorization Issues

#### Common Error: "QuestManager not authorized to mint MeeTokens/BadgeNFTs"
This happens when QuestManager doesn't have permission to mint tokens/badges.

**Solution:**
1. Check authorization status using QuestManager's built-in function:
```javascript
// Use the QuestManager's checkAuthorization function
const { isAuthorized, tokenAuthorized, badgeAuthorized } = 
  await questManagerContract.checkAuthorization();

console.log('✅ Full authorization:', isAuthorized);
console.log('🪙 Token minting authorized:', tokenAuthorized);
console.log('🏆 Badge minting authorized:', badgeAuthorized);
```

2. If authorization is missing, run manual setup:
```javascript
// Get contract addresses
const { meeTokenAddress, badgeNFTAddress, questManagerAddress } = 
  await questManagerContract.getContractAddresses();

// Manual authorization (RECOMMENDED)
if (!tokenAuthorized) {
  await meeTokenContract.authorizeMinter(questManagerAddress);
  console.log('✅ MeeToken authorization granted');
}

if (!badgeAuthorized) {
  await badgeNFTContract.authorizeMinter(questManagerAddress);
  console.log('✅ BadgeNFT authorization granted');
}
```

#### Production Environment Check
```javascript
// Verify contracts are not using placeholder addresses
const { meeTokenAddress, badgeNFTAddress, questManagerAddress } = 
  await questManagerContract.getContractAddresses();

const PLACEHOLDER_REGEX = /^0x[1-9]+0*$/; // Matches 0x111...000 patterns

if (PLACEHOLDER_REGEX.test(meeTokenAddress)) {
  throw new Error('❌ MeeToken using placeholder address: ' + meeTokenAddress);
}
if (PLACEHOLDER_REGEX.test(badgeNFTAddress)) {
  throw new Error('❌ BadgeNFT using placeholder address: ' + badgeNFTAddress);
}

console.log('✅ All contracts using production addresses');
```

#### Common Error: Quest completion reverts
This indicates contract interface mismatch.

**Solution:**
- Ensure BadgeNFT contract is deployed (not MeeBadgeNFT)  
- Verify QuestManager imports "./BadgeNFT.sol"
- Check mintBadge() function signature matches

#### Testing Authorization Setup
```javascript
// Create a test quest
const questId = await questManagerContract.createQuest(
  "Test Quest",
  "Test description", 
  ethers.parseEther("10"), // 10 MEE reward
  "Test Badge",
  "Test badge description",
  "https://test.uri"
);

// Try to complete the quest
await questManagerContract.completeQuest(questId);
// Should mint 10 MEE tokens + Test Badge NFT
```

### 🖼️ NFT Metadata Structure
```json
{
  "name": "MeeChain Bronze Member",
  "description": "Bronze tier membership in MeeChain ecosystem",
  "image": "https://gateway.pinata.cloud/ipfs/QmHash...",
  "attributes": [
    {
      "trait_type": "Tier",
      "value": "Bronze"
    },
    {
      "trait_type": "Required Tokens", 
      "value": "100 MEE"
    }
  ]
}
```

## 🚀 Deployment Steps

### 1. ตรวจสอบไฟล์ .replit
```toml
[deployment]
build = ["npm", "run", "build"]
run = ["npm", "start"]

[[ports]]
localPort = 5000
externalPort = 80
```

### 2. ทดสอบในโหมด Development
```bash
npm run dev
```

### 3. Build สำหรับ Production
```bash
npm run build
```

### 4. Deploy ผ่าน Replit Deploy
- คลิก "Release" button
- เลือก "Deploy" 
- ตั้งค่า build และ run commands
- เพิ่ม environment variables

## 🔧 Post-Deployment Configuration

### Contract Setup Script
```javascript
// Deploy และเชื่อมต่อ contracts
const setupContracts = async () => {
  // 1. Deploy MeeToken
  const meeToken = await deployMeeToken();
  
  // 2. Deploy MembershipNFT
  const membershipNFT = await deployMembershipNFT();
  
  // 3. Link contracts
  await meeToken.setMembershipNFT(membershipNFT.address);
  await membershipNFT.authorizeMinter(meeToken.address);
};
```

## 📊 Monitoring & Maintenance

### Health Check Endpoints
```javascript
// GET /api/health
{
  "status": "healthy",
  "database": "connected",
  "contracts": "verified",
  "uptime": "24h"
}
```

### Error Tracking
- Monitor contract interactions
- Track user onboarding success rate  
- Monitor API response times
- Track token/NFT mint success rate

## 🎯 Go-Live Checklist

- [ ] Smart contracts deployed และ verified
- [ ] Metadata uploaded ไป IPFS
- [ ] Environment variables ตั้งค่าครบ
- [ ] Database schema migrated
- [ ] API endpoints tested
- [ ] Frontend build successful
- [ ] Health checks passing
- [ ] Domain configured (if custom)
- [ ] SSL certificate active
- [ ] Monitoring systems active

## 🔗 Production URLs

```bash
# Main Application
https://your-repl-name.username.replit.app

# API Endpoints
https://your-repl-name.username.replit.app/api/faucet
https://your-repl-name.username.replit.app/api/earnings
https://your-repl-name.username.replit.app/api/user-tier

# Health Check
https://your-repl-name.username.replit.app/api/health
```
