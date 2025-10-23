# MeeChain Smart Contracts

This directory contains the smart contracts for the MeeChain ecosystem.

## Contracts

### MeeChainToken.sol
The main ERC-20 token for the MeeChain ecosystem.

- **Symbol**: MEE
- **Name**: MeeChain Token
- **Initial Supply**: 1,000,000 MEE
- **Features**: Mintable (owner only), Burnable

**Deployment**:
```bash
npx hardhat run scripts/deployMEEToken.js --network bscTestnet
```

### MeeChainBadge.sol
Soulbound Token (SBT) implementation for contributor badges.

- **Symbol**: MEEBADGE
- **Name**: MeeChain Badge
- **Token Standard**: ERC-721 (Non-Transferable)
- **Features**: 
  - Soulbound (non-transferable)
  - Badge ownership verification
  - Batch badge queries
  - Badge type metadata
  - Owner-controlled minting and revocation

**Key Functions**:
- `hasBadge(address user, uint256 badgeId)` - Check if user owns a badge
- `getBadges(address user)` - Get all badges for a user
- `getBadgeType(uint256 tokenId)` - Get badge type name
- `mintBadge(address to, string badgeType)` - Mint new badge (owner only)
- `revokeBadge(uint256 tokenId)` - Revoke a badge (owner only)

**Deployment**:
```bash
npx hardhat run scripts/deployBadge.js --network bscTestnet
```

### MeeChainSupply.sol
Secure replay/supply system for MeeChain Singapore.

- **Purpose**: Safe and transparent token supply with replay verification
- **Authorization**: MeeBot only
- **Features**: 
  - Replay verification before supply
  - Two-step process (confirm → trigger)
  - Recovery mechanism (refund)
  - Event logging for transparency

**Deployment**:
```bash
export MEEBOT_ADDRESS="0x..."
export MEE_TOKEN_ADDRESS="0x..."
npx hardhat run scripts/deployMeeChainSupply.js --network bscTestnet
```

## Documentation

- [MeeChain Token Guide](../MEECHAIN_TOKEN_GUIDE.md)
- [MeeChain Supply Guide](../MEECHAIN_SUPPLY_GUIDE.md)
- [Badge Ownership Guide](../BADGE_OWNERSHIP_GUIDE.md)

## Testing

All contracts have comprehensive test coverage:

```bash
# Run all tests
npm test

# Run specific contract tests
npm test tests/meeChainSupply.test.ts
```

## Security

- All contracts use Solidity 0.8.x with built-in overflow checks
- Access control implemented via modifiers
- Event emissions for transparency
- Comprehensive test coverage

### MeeChainBadge.sol
**Soulbound Badge NFT Contract**

A non-transferable ERC-721 token implementation for contributor badges.

- **Token**: Soulbound (Non-Transferable)
- **Standard**: ERC-721
- **Features**: 
  - Badge type tracking
  - User badge enumeration
  - IPFS metadata support
  - Issuer control with ownership

**Key Functions**:
```solidity
function mintBadge(address to, string memory badgeType, string memory uri)
function getBadgesByUser(address user) returns (uint256[])
function getBadgeType(uint256 tokenId) returns (string)
function totalSupply() returns (uint256)
```

**Deployment**:
```bash
npm run deploy:badge-nft

# Or with Hardhat directly
npx hardhat run scripts/deployMeeChainBadge.js --network bscTestnet
```

**Usage**:
```javascript
// Mint a badge
await badgeContract.mintBadge(
    userAddress,
    "watchdog",
    "ipfs://QmHash..."
);

// Query user's badges
const tokenIds = await badgeContract.getBadgesByUser(userAddress);
```

## Verification

After deployment, verify contracts on BscScan:

```bash
# MeeChainToken
npx hardhat verify --network bscTestnet <CONTRACT_ADDRESS>

# MeeChainSupply
npx hardhat verify --network bscTestnet <CONTRACT_ADDRESS> \
  "<MEEBOT_ADDRESS>" "<TOKEN_ADDRESS>"

# MeeChainBadge
npx hardhat verify --network bscTestnet <CONTRACT_ADDRESS>
```
