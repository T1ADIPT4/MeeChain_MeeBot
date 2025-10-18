# 🎖️ Badge SBT Implementation Guide

## Overview

This document describes the complete implementation of the MeeChain Badge Soulbound Token (SBT) system, including smart contracts, backend services, and frontend components.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Smart Contract](#smart-contract)
- [Backend Services](#backend-services)
- [Frontend Components](#frontend-components)
- [Deployment](#deployment)
- [Integration](#integration)
- [Testing](#testing)

---

## Architecture

The Badge SBT system consists of three main layers:

1. **Smart Contract Layer** - MeeChainBadgeSBT.sol (Soulbound NFT)
2. **Backend Service Layer** - Badge minting and reputation tracking
3. **Frontend UI Layer** - Badge display and animations

```
┌─────────────────────────────────────────┐
│         Frontend (React/TypeScript)     │
│  - BadgeGallery                         │
│  - BadgeCard                            │
│  - BadgeUnlockModal                     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Backend Services (TypeScript)      │
│  - BadgeSBTService                      │
│  - ContributorReputationService         │
│  - BadgeConfirmationHandler             │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│    Smart Contract (Solidity)            │
│  - MeeChainBadgeSBT.sol                 │
│  - BSC Mainnet/Testnet                  │
└─────────────────────────────────────────┘
```

---

## Smart Contract

### MeeChainBadgeSBT.sol

**Features:**
- ✅ Soulbound tokens (non-transferable)
- ✅ Role-based minting (MINTER_ROLE)
- ✅ Batch minting support
- ✅ Efficient badge lookup
- ✅ Multiple badges per address

**Key Functions:**

```solidity
// Mint a single badge
function mintBadge(address to, uint256 badgeType) external onlyRole(MINTER_ROLE)

// Batch mint multiple badges
function batchMintBadges(address to, uint256[] calldata badgeTypes) external onlyRole(MINTER_ROLE)

// Get all badges owned by a user
function getBadgesOf(address user) external view returns (uint256[] memory)

// Check if user has specific badge type
function hasBadgeType(address user, uint256 badgeType) external view returns (bool)

// Get badge type for a token ID
function getBadgeType(uint256 tokenId) external view returns (uint256)
```

**Contract Address:**
- Testnet: `<To be deployed>`
- Mainnet: `<To be deployed>`

---

## Backend Services

### 1. Badge Catalog (`contributor-badges.ts`)

Defines all available badges with metadata and unlock conditions.

```typescript
export interface BadgeMetadata {
  id: number;
  name: string;
  description: string;
  image: string;
  category: 'contributor' | 'achievement' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockCondition: {
    type: 'quest' | 'reputation' | 'contribution' | 'special';
    requirement: string;
    threshold?: number;
  };
}
```

**Available Badges:**
1. First Steps (Common) - Complete first quest
2. TTS Pioneer (Common) - Enable TTS
3. Code Contributor (Rare) - First merged PR
4. Bug Hunter (Rare) - Report and fix bug
5. Quest Master (Epic) - Complete 10 quests
6. Community Champion (Epic) - Reach 100 reputation
7. Early Adopter (Legendary) - Join early
8. NFT Collector (Rare) - Mint first NFT
9. Team Player (Rare) - Team collaboration
10. MeeChain Legend (Legendary) - All achievements

### 2. Badge SBT Service (`badge-sbt-service.ts`)

Handles on-chain badge minting and querying using ethers.js.

```typescript
const badgeService = createBadgeSBTService({
  rpcUrl: process.env.MEECHAIN_BADGE_RPC_URL,
  contractAddress: process.env.MEECHAIN_BADGE_CONTRACT_ADDRESS,
  privateKey: process.env.MEECHAIN_BADGE_PRIVATE_KEY,
});

// Mint a badge
const result = await badgeService.mintBadge(userAddress, badgeTypeId);

// Get user's badge state
const state = await badgeService.getBadgeState(userAddress);
```

### 3. Contributor Reputation Service (`contributor-reputation-service.ts`)

Detects unlocked badges, triggers minting, and hydrates API responses.

```typescript
const reputationService = createReputationService(badgeService);

// Check for newly unlocked badges
const unlockResult = await reputationService.checkUnlockedBadges(userReputation);

// Trigger minting for new badges
const mintResult = await reputationService.triggerBadgeMinting(
  walletAddress,
  unlockResult.newlyUnlocked
);

// Hydrate API response with badge data
const response = await reputationService.hydrateAPIResponse(
  userReputation,
  true // trigger minting
);
```

### 4. Badge Confirmation Handler (`badge-confirmation-handler.ts`)

HTTP/API endpoint handler for `/logs/flag/confirm`.

```typescript
const handler = createBadgeConfirmationHandler({
  rpcUrl: process.env.MEECHAIN_BADGE_RPC_URL,
  contractAddress: process.env.MEECHAIN_BADGE_CONTRACT_ADDRESS,
  privateKey: process.env.MEECHAIN_BADGE_PRIVATE_KEY,
});

// Handle badge confirmation request
const response = await handler.handleConfirmation({
  userId: 'user123',
  walletAddress: '0x...',
  progress: { 'quest-001': 1 },
  currentBadges: [],
  reputation: 0,
  triggerMinting: true,
});
```

**Response Format:**
```typescript
{
  success: boolean;
  userId: string;
  badges: Badge[];           // All badges with status
  newlyMintedBadges: number[]; // IDs of newly minted badges
  totalReputation: number;
  mintResult?: {
    txHash?: string;
    error?: string;
  };
  timestamp: string;
}
```

---

## Frontend Components

### 1. BadgeGallery Component

Main badge collection display with filtering and animations.

```tsx
import { BadgeGallery } from './components/BadgeGallery';

<BadgeGallery
  userId="user123"
  walletAddress="0x..."
  badges={badges}
  newlyMinted={[1, 3]} // IDs of newly minted badges
  onRefresh={() => fetchBadges()}
/>
```

**Features:**
- Badge filtering (category, rarity)
- Owned/Unlocked/Locked sections
- Badge detail modal
- Refresh functionality

### 2. BadgeCard Component

Individual badge display with status indicators.

```tsx
<BadgeCard
  badge={badge}
  isNewlyMinted={true}
  onClick={() => showDetail(badge)}
/>
```

### 3. BadgeUnlockModal Component

Celebration animation when new badges are unlocked.

```tsx
<BadgeUnlockModal
  badges={newlyUnlockedBadges}
  onClose={() => setShowModal(false)}
/>
```

**Features:**
- Confetti animation
- Badge reveal with glow effect
- Multiple badge support
- Auto-advance with progress indicator

### Styling

Import the CSS file in your component:

```tsx
import './BadgeGallery.css';
```

---

## Deployment

### 1. Compile Smart Contract

```bash
npm run compile
```

### 2. Deploy to BSC Testnet

```bash
npm run deploy:badge-sbt
```

### 3. Deploy to BSC Mainnet

```bash
npm run deploy:badge-sbt:mainnet
```

### 4. Update Environment Variables

Add to `.env`:

```env
MEECHAIN_BADGE_RPC_URL=https://bsc-dataseed.binance.org/
MEECHAIN_BADGE_PRIVATE_KEY=your_private_key
MEECHAIN_BADGE_CONTRACT_ADDRESS=0x...
```

### 5. Sync Contract ABI

```bash
cp artifacts/contracts/MeeChainBadgeSBT.sol/MeeChainBadgeSBT.json \
   viewer/src/abis/MeeChainBadgeSBT.json
```

---

## Integration

### Backend Integration

1. **Initialize Services:**

```typescript
import { createBadgeSBTService } from './services/badge-sbt-service';
import { createReputationService } from './services/contributor-reputation-service';
import { createBadgeConfirmationHandler } from './api/badge-confirmation-handler';

const badgeService = createBadgeSBTService({
  rpcUrl: process.env.MEECHAIN_BADGE_RPC_URL!,
  contractAddress: process.env.MEECHAIN_BADGE_CONTRACT_ADDRESS!,
  privateKey: process.env.MEECHAIN_BADGE_PRIVATE_KEY,
});

const reputationService = createReputationService(badgeService);
const confirmationHandler = createBadgeConfirmationHandler({
  rpcUrl: process.env.MEECHAIN_BADGE_RPC_URL!,
  contractAddress: process.env.MEECHAIN_BADGE_CONTRACT_ADDRESS!,
  privateKey: process.env.MEECHAIN_BADGE_PRIVATE_KEY,
});
```

2. **Add API Endpoint (Express example):**

```typescript
import { handleBadgeConfirmationEndpoint } from './api/badge-confirmation-handler';

app.post('/logs/flag/confirm', async (req, res) => {
  await handleBadgeConfirmationEndpoint(req, res, confirmationHandler);
});
```

### Frontend Integration

1. **Fetch Badge State:**

```typescript
const fetchBadges = async () => {
  const response = await fetch('/logs/flag/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: userId,
      walletAddress: walletAddress,
      progress: userProgress,
      currentBadges: currentBadges,
      reputation: reputation,
      triggerMinting: true,
    }),
  });

  const data = await response.json();
  return data;
};
```

2. **Display Badge Gallery:**

```tsx
function BadgePage() {
  const [badgeData, setBadgeData] = useState(null);

  useEffect(() => {
    fetchBadges().then(setBadgeData);
  }, []);

  if (!badgeData) return <div>Loading...</div>;

  return (
    <BadgeGallery
      userId={badgeData.userId}
      walletAddress={walletAddress}
      badges={badgeData.badges}
      newlyMinted={badgeData.newlyMintedBadges}
      onRefresh={() => fetchBadges().then(setBadgeData)}
    />
  );
}
```

---

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run badge tests only
npm test -- tests/badgeSBT.test.ts

# Run with coverage
npm test -- --coverage
```

### Test Coverage

- ✅ Badge catalog validation
- ✅ Badge unlock logic
- ✅ Reputation service
- ✅ Progress tracking
- ✅ State management

---

## Advanced Features

### 1. Badge Quest System

Connect badges with Flow Editor for quest-based unlocks:

```typescript
// When quest is completed
await reputationService.updateProgress(
  userId,
  { 'quest-001': 1 },
  currentReputation
);
```

### 2. Discord/GitHub Integration

Sync badges with Discord roles or GitHub contributions:

```typescript
// Award badge for GitHub contribution
await badgeService.mintBadge(userAddress, 3); // Code Contributor badge
```

### 3. Public Profile

Create a public contributor profile page showing all badges.

### 4. Badge-Based Voting

Implement voting power based on badges owned (DAO governance).

---

## Troubleshooting

### Common Issues

**Contract not deploying:**
- Check gas price and network configuration
- Ensure wallet has sufficient BNB for gas

**Badges not showing:**
- Verify contract address in environment variables
- Check RPC URL is accessible
- Ensure wallet address is correct

**Minting fails:**
- Verify minter role is granted
- Check if badge type already owned
- Ensure sufficient gas

### Support

For issues or questions:
- Check GitHub issues
- Review test cases
- Contact MeeChain team

---

## Next Steps

1. 🚀 Deploy contract to BSC mainnet
2. 🔗 Integrate with existing quest system
3. 🎨 Add badge images/icons
4. 📊 Implement badge analytics
5. 🌐 Create public badge gallery
6. 🔔 Add notification system for new badges

---

## License

MIT License - See LICENSE file for details.
