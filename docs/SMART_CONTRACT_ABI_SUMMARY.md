
# 📝 Smart Contract ABI Summary

This contract implements a robust ERC-20 token with advanced role and metadata management, burning/minting, and extended transfer functions.

---

## 🔑 Roles & Permissions

- `addMinter(address account)` – Grant minting permission to an address
- `isMinter(address account) → bool` – Check if address has minting rights
- `renounceMinter()` – Renounce minter status
- `isOwner() → bool` – Check if caller is contract owner
- `owner() → address` – Get contract owner address
- `transferOwnership(address newOwner)` – Transfer contract ownership
- `renounceOwnership()` – Renounce contract ownership

---

## 💰 Token Management

- `mint(address account, uint256 amount) → bool` – Mint new tokens to address
- `burn(uint256 amount)` – Burn tokens from caller
- `burnFrom(address account, uint256 amount)` – Burn tokens from another address (with allowance)
- `transfer(address recipient, uint256 amount) → bool` – Transfer tokens
- `transferFrom(address sender, address recipient, uint256 amount) → bool` – Transfer tokens using allowance
- `approve(address spender, uint256 amount) → bool` – Approve spender to use tokens
- `increaseAllowance(address spender, uint256 addedValue) → bool` – Increase allowance
- `decreaseAllowance(address spender, uint256 subtractedValue) → bool` – Decrease allowance
- `allowance(address owner, address spender) → uint256` – View spender's allowance

---

## 📦 Token Information

- `name() → string` – Token name
- `symbol() → string` – Token symbol
- `decimals() → uint8` – Token decimals
- `totalSupply() → uint256` – Total token supply
- `balanceOf(address account) → uint256` – Account balance

---

## 🖼️ Metadata

- `setTokenURI(string tokenURI)` – Set metadata URI
- `tokenURI() → string` – Get metadata URI

---

## 📡 Extended Functionality

- `transferAndCall(address _to, uint256 _value, bytes _data) → bool` – Transfer tokens and trigger function on recipient (for DApp composability)

---

## 🧩 Method IDs

Each method is addressable via its 4-byte selector, e.g.:
- `addMinter`: `0x983b2d56`
- `allowance`: `0xdd62ed3e`
- `approve`: `0x095ea7b3`
- `transferAndCall`: `0x4000aea0`
- ...and more.

See the full ABI for all selectors.

---

## 🔗 MeeChain Specific Features

Based on our contracts in this project:

### MeeToken.sol
- `mintReward(address, uint256)` – Mint rewards and auto-upgrade user tier
- `getUserTier(address) → uint8` – Get user's current tier (0-4)
- `checkTierEligibility(address) → uint8` – Check tier upgrade eligibility
- `setMembershipNFT(address)` – Connect to NFT contract

### MembershipNFT.sol
- `mintReward(address, uint256, uint8)` – Mint tier-based NFT rewards
- `hasTierNFT(address, uint8) → bool` – Check if user has specific tier NFT
- `getUserHighestTier(address) → uint8` – Get user's highest tier
- `authorizeMinter(address)` – Authorize minter (Token contract)
- `updateTierMetadata(uint8, string, string)` – Update tier metadata

### Tier System
- **Bronze**: 100 MEE tokens
- **Silver**: 500 MEE tokens  
- **Gold**: 1,000 MEE tokens
- **Platinum**: 5,000 MEE tokens
