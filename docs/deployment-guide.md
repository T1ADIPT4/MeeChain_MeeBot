
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
1. Deploy MeeToken contract
2. Deploy MembershipNFT contract  
3. Link contracts together
4. Set authorized minters
5. Upload NFT metadata to IPFS

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
