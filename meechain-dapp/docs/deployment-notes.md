
# 🧭 MeeChain Deployment Notes

เอกสารสำหรับการ deploy MeeChain project บน Replit platform อย่างสมบูรณ์

---

## 🚀 Replit Deployment Strategy

### 📋 Pre-Deployment Checklist

- [ ] ตรวจสอบ environment variables ใน Replit Secrets
- [ ] อัพเดต contract addresses ในไฟล์ config
- [ ] ทดสอบ smart contract functions ใน testnet
- [ ] เตรียม IPFS metadata สำหรับ NFTs
- [ ] ตั้งค่า authorized minters และ contract permissions

### 🔧 Environment Configuration

```bash
# Required Environment Variables (set in Replit Secrets)
VITE_TOKEN_CONTRACT_ADDRESS=0x...
VITE_NFT_CONTRACT_ADDRESS=0x...
VITE_FUSE_RPC_URL=https://rpc.fuse.io
VITE_CHAIN_ID=122
DATABASE_URL=file:./dev.db
NODE_ENV=production
```

---

## 📦 Smart Contract Deployment

### 🎯 Contract Setup Sequence

1. **Deploy MeeToken Contract**
   ```solidity
   // Initial setup with proper name, symbol, and supply
   constructor("MeeChain Token", "MEE", 1000000 * 10**18)
   ```

2. **Deploy MembershipNFT Contract**
   ```solidity
   // Initialize with tier metadata
   constructor() // Auto-initializes Bronze, Silver, Gold, Platinum tiers
   ```

3. **Link Contracts**
   ```solidity
   // Connect token contract to NFT contract
   await meeToken.setMembershipNFT(membershipNFTAddress);
   await membershipNFT.authorizeMinter(meeTokenAddress);
   ```

### 🔑 Initial Contract Permissions

**Critical: Set up authorized roles immediately after deployment**

```typescript
// Example deployment script
const deployMeeChainContracts = async () => {
  // 1. Deploy Token Contract
  const meeToken = await MeeToken.deploy("MeeChain Token", "MEE", "1000000000000000000000000");
  
  // 2. Deploy NFT Contract  
  const membershipNFT = await MembershipNFT.deploy();
  
  // 3. Link contracts
  await meeToken.setMembershipNFT(membershipNFT.address);
  await membershipNFT.authorizeMinter(meeToken.address);
  
  // 4. Transfer ownership if needed
  // await meeToken.transferOwnership(newOwnerAddress);
};
```

---

## 🖼️ Metadata & IPFS Integration

### 📁 NFT Metadata Structure

```json
{
  "name": "MeeChain Bronze Member",
  "description": "Bronze tier membership in the MeeChain ecosystem",
  "image": "https://gateway.pinata.cloud/ipfs/QmHash...",
  "attributes": [
    {
      "trait_type": "Tier",
      "value": "Bronze"
    },
    {
      "trait_type": "Required Tokens",
      "value": "100 MEE"
    },
    {
      "trait_type": "Level",
      "value": 1
    }
  ]
}
```

### 🌐 Recommended Metadata Hosting

**Primary**: IPFS via Pinata/Infura
- Bronze: `https://gateway.pinata.cloud/ipfs/QmBronzeHash...`
- Silver: `https://gateway.pinata.cloud/ipfs/QmSilverHash...`
- Gold: `https://gateway.pinata.cloud/ipfs/QmGoldHash...`
- Platinum: `https://gateway.pinata.cloud/ipfs/QmPlatinumHash...`

**Backup**: Replit static assets (for development)
- `https://your-repl-name.username.replit.app/metadata/bronze.json`

---

## 🔗 Replit-Specific Configuration

### 🏗️ Build & Run Commands

```toml
# .replit configuration
[deployment]
build = ["npm", "run", "build"]
run = ["npm", "start"]

[nix]
channel = "stable-22_11"
```

### 📡 Port Configuration

```typescript
// server/index.ts - Use 0.0.0.0 for Replit compatibility
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MeeChain server running on port ${PORT}`);
});
```

### 🗄️ Database Setup

```typescript
// Use SQLite for Replit deployment
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

---

## 🎮 DApp Integration Guidelines

### 🔌 Contract Interaction Patterns

```typescript
// lib/token-actions.ts - Production configuration
const CONTRACTS = {
  TOKEN: process.env.VITE_TOKEN_CONTRACT_ADDRESS!,
  NFT: process.env.VITE_NFT_CONTRACT_ADDRESS!,
  RPC: process.env.VITE_FUSE_RPC_URL!,
  CHAIN_ID: parseInt(process.env.VITE_CHAIN_ID!)
};

// Error handling for production
const handleContractCall = async (operation: () => Promise<any>) => {
  try {
    return await operation();
  } catch (error) {
    console.error('Contract call failed:', error);
    throw new Error('Transaction failed. Please try again.');
  }
};
```

### 🎯 User Experience Optimizations

```typescript
// Composable actions for better UX
const mintRewardWithFeedback = async (userAddress: string, amount: string) => {
  const tx = await meeToken.mintReward(userAddress, amount);
  
  // Show loading state
  showNotification('Processing reward...', 'loading');
  
  await tx.wait();
  
  // Check for tier upgrade
  const newTier = await meeToken.getUserTier(userAddress);
  const hasNFT = await membershipNFT.hasTierNFT(userAddress, newTier);
  
  if (hasNFT) {
    showNotification('🎉 Tier upgraded! NFT reward unlocked!', 'success');
  } else {
    showNotification('💰 Reward received!', 'success');
  }
};
```

---

## 🔐 Security Considerations

### 🛡️ Contract Security

- ✅ Use `onlyOwner` modifiers for critical functions
- ✅ Implement pausable functionality for emergencies
- ✅ Validate all inputs and check for overflow/underflow
- ✅ Test tier thresholds and NFT minting logic thoroughly

### 🔑 Access Control

```solidity
// Recommended access control pattern
modifier onlyAuthorizedMinter() {
    require(authorizedMinters[msg.sender], "Not authorized to mint");
    _;
}

// Emergency controls
function pause() external onlyOwner {
    _pause();
}
```

---

## 📊 Monitoring & Analytics

### 📈 Key Metrics to Track

- User tier distribution
- NFT minting success rate
- Transaction failure rates
- User onboarding completion
- Token distribution patterns

### 🚨 Health Checks

```typescript
// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    contracts: {
      token: process.env.VITE_TOKEN_CONTRACT_ADDRESS,
      nft: process.env.VITE_NFT_CONTRACT_ADDRESS
    }
  });
});
```

---

## 🚀 Go-Live Checklist

### 📋 Final Steps Before Production

- [ ] Test all contract functions on Fuse testnet
- [ ] Upload and verify metadata on IPFS
- [ ] Set production environment variables in Replit Secrets
- [ ] Configure authorized minters and contract ownership
- [ ] Test user flows end-to-end
- [ ] Set up monitoring and error tracking
- [ ] Deploy via Replit's deployment feature
- [ ] Verify custom domain (if applicable)
- [ ] Test production deployment with small user group

### 🎯 Post-Deployment Tasks

- [ ] Monitor initial user interactions
- [ ] Track contract events and transactions
- [ ] Update documentation with live contract addresses
- [ ] Set up automated backups for user data
- [ ] Plan for scaling and future upgrades

---

## 📞 Support & Maintenance

### 🔧 Common Issues & Solutions

**Contract Call Failures**
- Check network connectivity to Fuse RPC
- Verify contract addresses and ABIs
- Ensure sufficient gas and permissions

**NFT Metadata Issues** 
- Verify IPFS gateway accessibility
- Check metadata JSON format
- Test metadata URLs in browsers

**User Experience Issues**
- Monitor wallet connection success rates
- Track transaction completion times
- Gather user feedback on onboarding flow

---

**💡 Pro Tip**: เก็บ contract deployment transaction hashes และ block numbers ไว้สำหรับการ verify และ debug ในอนาคตครับ!

---

*Built with ❤️ for seamless Web3 deployment on Replit*
