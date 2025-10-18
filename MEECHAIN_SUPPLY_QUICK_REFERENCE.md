# MeeChain Supply Quick Reference

Quick commands and snippets for working with the MeeChain Supply system.

## 🚀 Quick Start

### 1. Run Demo
```bash
npm run demo:supply
```

### 2. Run Tests
```bash
npm test tests/meeChainSupply.test.ts
```

### 3. Deploy Contract
```bash
# Set environment variables first
export MEEBOT_ADDRESS="0x..."
export MEE_TOKEN_ADDRESS="0x..."
export PRIVATE_KEY="your-private-key"

# Deploy
npm run deploy:supply -- --network bscTestnet
```

## 📝 Code Snippets

### Check User Status
```javascript
const contract = new ethers.Contract(SUPPLY_ADDRESS, ABI, provider);
const pendingAmount = await contract.pendingSupply(userAddress);
const isConfirmed = await contract.replayConfirmed(userAddress);

console.log(`Pending: ${pendingAmount}, Confirmed: ${isConfirmed}`);
```

### Confirm Replay (MeeBot only)
```javascript
// After verifying replay off-chain
const tx = await contract.confirmReplay(userAddress, amount);
await tx.wait();
console.log('✅ Replay confirmed');
```

### Trigger Supply (User action)
```javascript
const tx = await contract.triggerSupply(userAddress);
await tx.wait();
console.log('✅ Tokens supplied');
```

### Issue Refund (Recovery)
```javascript
const tx = await contract.refund(userAddress);
await tx.wait();
console.log('✅ Refund issued');
```

### Listen to Events
```javascript
// ReplayConfirmed
contract.on("ReplayConfirmed", (user, amount) => {
  console.log(`Replay confirmed for ${user}: ${amount}`);
});

// SupplyTriggered
contract.on("SupplyTriggered", (user, amount) => {
  console.log(`Supply triggered for ${user}: ${amount}`);
});

// RefundIssued
contract.on("RefundIssued", (user, amount) => {
  console.log(`Refund issued for ${user}: ${amount}`);
});
```

## 🔧 Environment Setup

### .env Template
```bash
# MeeBot wallet address
MEEBOT_ADDRESS=0x...

# MeeChainToken contract address
MEE_TOKEN_ADDRESS=0x...

# Deployer private key
PRIVATE_KEY=0x...

# BscScan API key for verification
BSCSCAN_API_KEY=...
```

## 🔍 Verification

### Verify on BscScan
```bash
npx hardhat verify --network bscTestnet <CONTRACT_ADDRESS> \
  "<MEEBOT_ADDRESS>" "<TOKEN_ADDRESS>"
```

## 📊 Common Scenarios

### Scenario 1: Successful Supply
1. User requests supply
2. MeeBot verifies replay off-chain
3. MeeBot calls `confirmReplay(user, amount)`
4. User clicks "Claim Tokens"
5. MeeBot calls `triggerSupply(user)`
6. Tokens transferred to user

### Scenario 2: Failed Replay
1. User requests supply
2. MeeBot verifies replay off-chain (fails)
3. MeeBot calls `refund(user)`
4. Tokens returned to user

### Scenario 3: Check Pending Supply
```javascript
async function checkPendingSupply(userAddress) {
  const pending = await contract.pendingSupply(userAddress);
  const confirmed = await contract.replayConfirmed(userAddress);
  
  if (confirmed && pending > 0) {
    return { status: 'ready', amount: pending };
  } else if (pending > 0) {
    return { status: 'processing', amount: pending };
  } else {
    return { status: 'none', amount: 0 };
  }
}
```

## 🛡️ Security Checklist

- [ ] MeeBot address is secure and trusted
- [ ] Private keys are not committed to git
- [ ] Contract is verified on BscScan
- [ ] Sufficient tokens in contract for supply
- [ ] Event listeners are set up for monitoring
- [ ] Rate limiting implemented in MeeBot

## 📚 References

- Full Documentation: [MEECHAIN_SUPPLY_GUIDE.md](../MEECHAIN_SUPPLY_GUIDE.md)
- Contract: [contracts/MeeChainSupply.sol](../contracts/MeeChainSupply.sol)
- Tests: [tests/meeChainSupply.test.ts](../tests/meeChainSupply.test.ts)
- Demo: [examples/meechain-supply-demo.js](../examples/meechain-supply-demo.js)
