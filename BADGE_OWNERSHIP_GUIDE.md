# Badge Ownership & Contributor Explorer Guide

## Overview

This guide covers the badge ownership verification system and Contributor Explorer interface for MeeChain Singapore.

## 🧠 Smart Contract: MeeChainBadge.sol

### Features

- **Soulbound Tokens (SBT)**: Badges are non-transferable NFTs representing achievements
- **Badge Ownership Verification**: Check if a user owns specific badges
- **Batch Queries**: Get all badges owned by an address
- **Badge Types**: Each badge has a type name (e.g., "Watchdog", "Pioneer", "Quest Master")
- **Revocable**: Owner can revoke badges if needed

### Contract Functions

#### `hasBadge(address user, uint256 badgeId) → bool`

Check if a user owns a specific badge.

```solidity
bool hasWatchdog = badgeContract.hasBadge(userAddress, 1);
```

#### `getBadges(address user) → uint256[]`

Get all badge IDs owned by a user.

```solidity
uint256[] memory userBadges = badgeContract.getBadges(userAddress);
```

#### `getBadgeType(uint256 tokenId) → string`

Get the badge type name for a given token ID.

```solidity
string memory badgeType = badgeContract.getBadgeType(1); // Returns "Watchdog"
```

#### `mintBadge(address to, string badgeType) → uint256`

Mint a new badge to a user (owner only).

```solidity
uint256 tokenId = badgeContract.mintBadge(userAddress, "Quest Master");
```

#### `totalSupply() → uint256`

Get the total number of badges minted.

```solidity
uint256 total = badgeContract.totalSupply();
```

### Deployment

```bash
# Deploy the badge contract
npx hardhat run scripts/deployBadge.js --network bscTestnet

# Verify on BscScan
npx hardhat verify --network bscTestnet <CONTRACT_ADDRESS>
```

### Events

- `BadgeMinted(address indexed recipient, uint256 indexed tokenId, string badgeType)`
- `BadgeRevoked(address indexed owner, uint256 indexed tokenId)`

---

## 🖥️ Contributor Explorer UI

### Features

- **Contributor List**: Display all contributors with their information
- **Search**: Search by name or wallet address
- **Filters**: 
  - Minimum reputation score
  - Badge type filter
- **On-Chain Verification**: Direct links to BscScan for transparency
- **Top Contributors**: Leaderboard showing top 5 contributors
- **Profile Links**: Navigate to detailed contributor profiles

### Component Usage

```tsx
import ContributorExplorer from './components/ContributorExplorer';

function App() {
  return (
    <ContributorExplorer 
      badgeContractAddress="0x..." 
    />
  );
}
```

### Data Structure

```typescript
interface Contributor {
  address: string;           // Wallet address
  name?: string;             // Display name (optional)
  reputation: number;        // Reputation score
  badges: string[];          // Array of badge names
  tier?: number;             // Tier level (1-3)
  joinedDate?: Date;         // Join date
}
```

---

## 🛠️ Web3 Integration

### Frontend Setup

```typescript
import Web3 from 'web3';
import badgeABI from './abis/MeeChainBadge.json';

const web3 = new Web3(window.ethereum);
const badgeContract = new web3.eth.Contract(
  badgeABI, 
  '0x...' // Badge contract address
);
```

### Check Badge Ownership

```typescript
// Check if user has a specific badge
const hasWatchdog = await badgeContract.methods
  .hasBadge(userAddress, WATCHDOG_ID)
  .call();

// Get all badges for a user
const badgeList = await badgeContract.methods
  .getBadges(userAddress)
  .call();

// Get badge type names
const badgeNames = await Promise.all(
  badgeList.map(id => 
    badgeContract.methods.getBadgeType(id).call()
  )
);
```

---

## 📊 Services

### Contributor Service

Handles fetching and managing contributor data.

```typescript
import { 
  fetchContributors, 
  fetchTopContributors,
  searchContributors,
  fetchContributorsByBadge 
} from './services/contributorService';

// Get all contributors
const contributors = await fetchContributors();

// Get top 5 contributors
const topContributors = await fetchTopContributors(5);

// Search contributors
const results = await searchContributors('alice');

// Filter by badge
const watchdogs = await fetchContributorsByBadge('Watchdog');
```

### Blockchain Service

Extended with badge-related functions.

```typescript
import { 
  hasBadge, 
  getUserBadgeIds, 
  getBadgeType 
} from './services/blockchainService';

// Check badge ownership
const hasIt = await hasBadge(userAddress, badgeId);

// Get user's badge IDs
const badgeIds = await getUserBadgeIds(userAddress);

// Get badge type
const badgeType = await getBadgeType(badgeId);
```

---

## 🎨 Styling

The Contributor Explorer uses CSS classes for styling:

- `.explorer-container`: Main container
- `.explorer-filters`: Search and filter section
- `.contributors-table`: Main data table
- `.contributor-row`: Individual contributor row
- `.badge-item`: Individual badge display
- `.top-contributors`: Top contributors section

### Customization

Edit `ContributorExplorer.css` to customize the appearance:

```css
.explorer-container {
  max-width: 1200px;
  margin: 2rem auto;
  background: #ffffff;
}

.badge-item {
  background: #e6fffa;
  border: 1px solid #81e6d9;
  border-radius: 12px;
}
```

---

## 🔍 On-Chain Verification

Contributors can verify badge ownership on BscScan:

```
https://bscscan.com/token/{badgeContractAddress}?a={userAddress}
```

This provides full transparency and allows anyone to verify:
- Number of badges owned
- Badge token IDs
- Minting transactions
- Badge types

---

## 🧪 Testing

### Contract Tests

```bash
npm test tests/meeChainBadge.test.ts
```

### Service Tests

```bash
npm test tests/contributorService.test.ts
```

### All Tests

```bash
npm test
```

---

## 📈 Future Enhancements

### Planned Features

1. **Badge Timeline**: Track when badges were earned
2. **Badge Unlocking**: Show requirements for locked badges
3. **NFT Viewer**: Visual display of badge designs
4. **Reputation Tracking**: Historical reputation changes
5. **DAO Integration**: Badge-gated governance features
6. **Achievement Animations**: Celebrate new badge earnings
7. **Badge Combinations**: Special badges for collecting sets

### Advanced Queries

```typescript
// Find contributors by DAO proposal participation
const daoContributors = await fetchContributorsByProposal(proposalId);

// Get badge unlock timeline
const timeline = await getBadgeTimeline(userAddress);

// Check badge prerequisites
const canUnlock = await checkBadgePrerequisites(userAddress, badgeType);
```

---

## 🔐 Security Considerations

1. **Soulbound Tokens**: Badges cannot be transferred between addresses
2. **Owner Control**: Only contract owner can mint/revoke badges
3. **Access Control**: Use Ownable pattern for administrative functions
4. **Event Logging**: All actions emit events for transparency
5. **Input Validation**: Always validate addresses and IDs

---

## 📚 Related Documentation

- [MeeChain Token Guide](./MEECHAIN_TOKEN_GUIDE.md)
- [MeeChain Supply Guide](./MEECHAIN_SUPPLY_GUIDE.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Quest System](./QUEST_SYSTEM.md)

---

## 🆘 Support

For issues or questions:
- GitHub Issues: [MeeChain_MeeBot Issues](https://github.com/T1ADIPT4/MeeChain_MeeBot/issues)
- Documentation: Check related guides
- Tests: Run test suite for verification

---

## 📝 License

MIT License - See LICENSE file for details
