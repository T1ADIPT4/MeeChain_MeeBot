# 🏅 MeeChain Badge System Guide

Complete guide for deploying, managing, and integrating the MeeChain Badge SBT (Soulbound Token) system.

## 📋 Table of Contents

- [Overview](#overview)
- [Smart Contract](#smart-contract)
- [Deployment](#deployment)
- [Badge Configuration](#badge-configuration)
- [Frontend Integration](#frontend-integration)
- [Backend Integration](#backend-integration)
- [Testing](#testing)
- [Best Practices](#best-practices)

---

## 🎯 Overview

The MeeChain Badge System allows users to earn non-transferable achievement badges (SBTs) as they complete quests and reach milestones in the MeeChain ecosystem.

### Key Features

- ✅ **Soulbound Tokens (SBT)**: Badges cannot be transferred between wallets
- ✅ **Badge Catalog**: Pre-defined badge types with metadata
- ✅ **Batch Minting**: Efficient multi-user badge distribution
- ✅ **Gallery View**: Visual display of unlocked and locked badges
- ✅ **Unlock Animations**: Celebration effects when earning new badges
- ✅ **Rarity System**: Common, Rare, Epic, and Legendary badges

---

## 🔐 Smart Contract

### MeeChainBadgeSBT.sol

Location: `contracts/MeeChainBadgeSBT.sol`

The contract implements ERC-721 with transfer restrictions to create soulbound tokens.

#### Key Functions

```solidity
// Mint a badge to a user
function mintBadge(address to, uint256 badgeId) external onlyOwner

// Batch mint badges to multiple users
function batchMintBadges(address[] calldata recipients, uint256[] calldata badgeIds) external onlyOwner

// Register a new badge type
function registerBadge(uint256 badgeId, string memory name, string memory description, string memory imageURI) external onlyOwner

// Get all badge IDs owned by an address
function getBadgesOf(address owner) external view returns (uint256[] memory)

// Check if user has a specific badge
function hasBadge(address owner, uint256 badgeId) external view returns (bool)
```

---

## 🚀 Deployment

### 1. Prerequisites

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

### 2. Configure .env

```env
PRIVATE_KEY=your_private_key_here
BSCSCAN_API_KEY=your_bscscan_api_key

# Badge-specific configuration
MEECHAIN_BADGE_RPC_URL=https://bsc-dataseed.binance.org
MEECHAIN_BADGE_PRIVATE_KEY=your_badge_private_key
MEECHAIN_BADGE_CONTRACT_ADDRESS=0x...
```

### 3. Compile Contract

```bash
npx hardhat compile
```

### 4. Deploy to Network

```bash
# Deploy to BSC Testnet
npx hardhat run scripts/deploy-badge.js --network bscTestnet

# Deploy to BSC Mainnet
npx hardhat run scripts/deploy-badge.js --network bscMainnet

# Or use npm script
npm run deploy:badge -- --network bscMainnet
```

### 5. Verify Contract

```bash
npx hardhat verify --network bscMainnet <CONTRACT_ADDRESS>
```

### 6. Sync ABI

```bash
# Copy ABI to backend (if applicable)
cp artifacts/contracts/MeeChainBadgeSBT.sol/MeeChainBadgeSBT.json ../meebot-backend/abi/

# Copy ABI to frontend
cp artifacts/contracts/MeeChainBadgeSBT.sol/MeeChainBadgeSBT.json viewer/abis/
```

---

## 🎨 Badge Configuration

### Badge Catalog

Location: `src/config/badgeCatalog.ts`

The badge catalog defines all available badge types:

```typescript
export interface BadgeMetadata {
  id: number;
  name: string;
  description: string;
  imageURI: string;
  category: 'achievement' | 'milestone' | 'special' | 'quest';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const BADGE_CATALOG: Record<number, BadgeMetadata> = {
  1: {
    id: 1,
    name: "Pioneer",
    description: "First steps in MeeChain - Complete your first quest",
    imageURI: "ipfs://QmPioneerBadge",
    category: 'achievement',
    rarity: 'common'
  },
  // ... more badges
};
```

### Register Badges On-Chain

After deploying the contract, register badge types:

```javascript
// Using ethers.js
const badgeContract = await ethers.getContractAt("MeeChainBadgeSBT", contractAddress);

// Register each badge type
await badgeContract.registerBadge(
  1, // badgeId
  "Pioneer",
  "First steps in MeeChain - Complete your first quest",
  "ipfs://QmPioneerBadge"
);
```

---

## 🎭 Frontend Integration

### Components

The badge system includes several React components:

#### 1. BadgeRegistry

Main container for displaying user's badge collection.

```tsx
import BadgeRegistry from './components/BadgeRegistry';

<BadgeRegistry 
  userAddress="0x..."
  newlyMintedBadges={[1, 3]} // IDs of newly unlocked badges
/>
```

#### 2. BadgeGallery

Grid view of all badges with locked/unlocked states.

```tsx
import BadgeGallery from './components/BadgeGallery';

<BadgeGallery
  ownedBadgeIds={[1, 2, 5]}
  newlyMintedBadges={[1]}
  onBadgeClick={(badge) => console.log(badge)}
/>
```

#### 3. Badge

Individual badge display component.

```tsx
import Badge from './components/Badge';

<Badge
  badge={badgeMetadata}
  isUnlocked={true}
  showAnimation={true}
  onClick={() => {}}
/>
```

#### 4. BadgeUnlockNotification

Celebration popup when badges are unlocked.

```tsx
import BadgeUnlockNotification from './components/BadgeUnlockNotification';

<BadgeUnlockNotification
  badgeIds={[1, 3]}
  onClose={() => setShowNotification(false)}
  autoCloseDelay={5000}
/>
```

### Integration with Quest System

When a user completes a quest, the backend can mint badges:

```typescript
// Example: /logs/flag/confirm endpoint response
{
  "success": true,
  "quest": "quest-1",
  "newlyMintedBadges": [1, 3], // Badge IDs
  "message": "Quest completed! You earned 2 new badges!"
}
```

Frontend can then trigger the notification:

```tsx
const response = await confirmQuest(questId);
if (response.newlyMintedBadges?.length > 0) {
  // Show unlock notification
  setNewlyMintedBadges(response.newlyMintedBadges);
}
```

---

## 🔧 Backend Integration

### Blockchain Service

Update `viewer/services/blockchainService.ts`:

```typescript
import { ethers } from 'ethers';
import BadgeSBTABI from '../abis/MeeChainBadgeSBT.json';

const provider = new ethers.JsonRpcProvider(process.env.MEECHAIN_BADGE_RPC_URL);
const wallet = new ethers.Wallet(process.env.MEECHAIN_BADGE_PRIVATE_KEY, provider);
const badgeContract = new ethers.Contract(
  process.env.MEECHAIN_BADGE_CONTRACT_ADDRESS,
  BadgeSBTABI,
  wallet
);

// Fetch owned badges
export async function fetchOwnedBadges(userAddress: string): Promise<number[]> {
  return await badgeContract.getBadgesOf(userAddress);
}

// Mint badge to user
export async function mintBadge(userAddress: string, badgeId: number) {
  const tx = await badgeContract.mintBadge(userAddress, badgeId);
  await tx.wait();
  return { success: true, badgeId };
}

// Batch mint badges
export async function batchMintBadges(recipients: string[], badgeIds: number[]) {
  const tx = await badgeContract.batchMintBadges(recipients, badgeIds);
  await tx.wait();
  return { success: true };
}
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run badge system tests only
npm test tests/badgeSystem.test.ts

# Run with coverage
npm test -- --coverage
```

### Test Coverage

The badge system includes comprehensive tests for:

- ✅ Badge catalog structure and validation
- ✅ Badge metadata integrity
- ✅ Category and rarity distribution
- ✅ Helper functions (getBadgeById, getAllBadges, etc.)
- ✅ Blockchain service integration
- ✅ Mock minting and fetching

### Manual Testing

1. **Deploy contract to testnet**
2. **Register badge types**
3. **Mint test badges**
4. **Verify on frontend**

```bash
# Example using Hardhat console
npx hardhat console --network bscTestnet

> const badge = await ethers.getContractAt("MeeChainBadgeSBT", "0x...")
> await badge.registerBadge(1, "Pioneer", "First quest", "ipfs://...")
> await badge.mintBadge("0xUserAddress", 1)
> await badge.getBadgesOf("0xUserAddress")
```

---

## 📚 Best Practices

### Smart Contract

1. **Register badges before minting**: Always register badge types before attempting to mint
2. **Batch operations**: Use `batchMintBadges` for efficiency when minting multiple badges
3. **Access control**: Only contract owner can mint and register badges
4. **Event monitoring**: Listen to `BadgeMinted` events for real-time updates

### Frontend

1. **Loading states**: Show loading indicators while fetching badges
2. **Error handling**: Gracefully handle blockchain errors
3. **Animation timing**: Don't overuse animations - they should enhance UX
4. **Responsive design**: Badge gallery should work on all screen sizes

### Badge Design

1. **Clear criteria**: Each badge should have clear earning criteria
2. **Progression**: Create badges that encourage continued engagement
3. **Rarity balance**: More common badges than legendary ones
4. **Visual consistency**: Use consistent image styling across all badges

### Performance

1. **Cache badge metadata**: Don't fetch metadata on every render
2. **Lazy loading**: Load badge images lazily in the gallery
3. **Batch API calls**: Fetch multiple badges in single requests when possible
4. **Local state**: Store badge data in local storage for faster loads

---

## 🎨 Frontend Badge UI Features

### Badge Gallery

- ✅ Grid layout with responsive design
- ✅ Progress bar showing unlock percentage
- ✅ Locked/unlocked visual states
- ✅ Hover effects for details
- ✅ Click to view full badge information
- ✅ Filter by category/rarity (optional enhancement)

### Badge Unlock Animation

- ✅ Confetti effect
- ✅ Scale and rotate animation
- ✅ "NEW" badge indicator
- ✅ Auto-dismiss after 5 seconds
- ✅ Manual dismiss option

### Badge Details Modal

- ✅ Large badge image
- ✅ Name and description
- ✅ Category and rarity tags
- ✅ Lock/unlock status
- ✅ Unlock date (optional enhancement)

---

## 🔮 Future Enhancements

### Badge Quest System

Connect badges with the Flow Editor for automated badge earning:

```typescript
interface BadgeQuest {
  questId: string;
  requiredBadges: number[];
  rewardBadge: number;
  title: string;
  description: string;
}
```

### Badge-Based Features

1. **Discord Integration**: Award Discord roles based on badges
2. **GitHub Contributions**: Link badges to GitHub activity
3. **Public Profiles**: Display badge collections on public profiles
4. **Badge Voting**: Use badge ownership for DAO voting power
5. **Leaderboards**: Rank users by rare badge ownership

### Advanced Features

1. **Badge Levels**: Upgradeable badges (Bronze → Silver → Gold)
2. **Badge Combos**: Earn special badges for holding specific combinations
3. **Time-Limited Badges**: Seasonal or event-specific badges
4. **Badge Trading** (controlled): Allow specific badge transfers with restrictions
5. **Badge NFT Marketplace**: Display badges on OpenSea (metadata compatible)

---

## 📞 Support

For questions or issues:

- GitHub Issues: [MeeChain_MeeBot/issues](https://github.com/T1ADIPT4/MeeChain_MeeBot/issues)
- Documentation: See this guide
- Tests: Run `npm test tests/badgeSystem.test.ts`

---

## 📄 License

MIT License - MeeChain Team
