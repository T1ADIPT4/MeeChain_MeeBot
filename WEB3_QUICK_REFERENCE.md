# 🚀 Web3.js Integration Quick Reference

Quick reference guide for using Web3.js with MeeChainSupply contract.

## 📦 Installation

```bash
npm install web3
```

## 🔧 Basic Setup

```typescript
import Web3 from 'web3';
import { initWeb3 } from './utils/web3Config';
import { initMeeChainSupplyContract } from './utils/meeChainSupplyContract';

// Initialize Web3
const web3 = initWeb3(false); // false = mainnet, true = testnet

// Initialize Contract
const contract = initMeeChainSupplyContract(web3);
```

## 📝 Core Functions

### 1. Confirm Replay

```typescript
import { confirmReplay } from './utils/meeChainSupplyContract';
import { toWei } from './utils/web3Config';

const userAddress = '0x...';
const amountWei = toWei('1.5'); // Convert BNB to Wei
const meeBotAddress = process.env.MEEBOT_ADDRESS!;

const tx = await confirmReplay(contract, userAddress, amountWei, meeBotAddress);
console.log('✅ Replay confirmed:', tx.transactionHash);
```

### 2. Trigger Supply

```typescript
import { triggerSupply } from './utils/meeChainSupplyContract';

const tx = await triggerSupply(contract, userAddress, meeBotAddress);
console.log('✅ Supply triggered:', tx.transactionHash);
```

### 3. Refund

```typescript
import { refund } from './utils/meeChainSupplyContract';

const tx = await refund(contract, userAddress, meeBotAddress);
console.log('✅ Refund issued:', tx.transactionHash);
```

## 🔍 Query Functions

### Check Replay Status

```typescript
import { isReplayConfirmed } from './utils/meeChainSupplyContract';

const confirmed = await isReplayConfirmed(contract, userAddress);
console.log('Replay confirmed:', confirmed);
```

### Get Pending Supply

```typescript
import { getPendingSupply } from './utils/meeChainSupplyContract';
import { fromWei } from './utils/web3Config';

const pendingWei = await getPendingSupply(contract, userAddress);
const pendingBNB = fromWei(pendingWei);
console.log('Pending supply:', pendingBNB, 'BNB');
```

## 🎯 Utilities

### Convert BNB ↔ Wei

```typescript
import { toWei, fromWei } from './utils/web3Config';

// BNB to Wei
const wei = toWei('1.5'); // '1500000000000000000'

// Wei to BNB
const bnb = fromWei('1500000000000000000'); // '1.5'
```

### Get Transaction Receipt

```typescript
import { getTransactionReceipt } from './utils/web3Config';

const receipt = await getTransactionReceipt(web3, txHash);
console.log('Status:', receipt.status ? 'Success' : 'Failed');
console.log('Gas Used:', receipt.gasUsed);
```

### Wait for Confirmation

```typescript
import { waitForTransaction } from './utils/web3Config';

const receipt = await waitForTransaction(web3, txHash);
if (receipt) {
  console.log('✅ Confirmed!');
}
```

## 📡 Event Listeners

### Listen to Events

```typescript
import {
  listenToReplayConfirmed,
  listenToSupplyTriggered,
  listenToRefundIssued
} from './utils/meeChainSupplyContract';

// ReplayConfirmed event
listenToReplayConfirmed(contract, (user, amount, event) => {
  console.log(`Replay confirmed for ${user}: ${amount}`);
});

// SupplyTriggered event
listenToSupplyTriggered(contract, (user, amount, event) => {
  console.log(`Supply triggered for ${user}: ${amount}`);
});

// RefundIssued event
listenToRefundIssued(contract, (user, amount, event) => {
  console.log(`Refund issued for ${user}: ${amount}`);
});
```

## 🔐 Environment Setup

Create `.env` file:

```bash
MEEBOT_ADDRESS=0x...
MEEBOT_PRIVATE_KEY=0x...
MEECHAIN_SUPPLY_ADDRESS=0x001aCFF4ABF83647bAc745cf9D98a49F6181f15F
```

Use in code:

```typescript
const meeBotAddress = process.env.MEEBOT_ADDRESS!;
const meeBotPrivateKey = process.env.MEEBOT_PRIVATE_KEY!;

// Add account to Web3
const account = web3.eth.accounts.privateKeyToAccount(meeBotPrivateKey);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;
```

## 🎮 Complete Example

```typescript
import Web3 from 'web3';
import {
  initWeb3,
  toWei,
  fromWei,
  waitForTransaction
} from './utils/web3Config';
import {
  initMeeChainSupplyContract,
  confirmReplay,
  triggerSupply,
  isReplayConfirmed,
  getPendingSupply
} from './utils/meeChainSupplyContract';

async function handleSupply(userAddress: string, amountBNB: string) {
  try {
    // 1. Setup
    const web3 = initWeb3(true); // Use testnet
    const contract = initMeeChainSupplyContract(web3);
    const meeBotAddress = process.env.MEEBOT_ADDRESS!;
    
    // Add account for signing
    const account = web3.eth.accounts.privateKeyToAccount(
      process.env.MEEBOT_PRIVATE_KEY!
    );
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;
    
    // 2. Convert amount
    const amountWei = toWei(amountBNB);
    
    // 3. Confirm replay
    console.log('Confirming replay...');
    const confirmTx = await confirmReplay(
      contract,
      userAddress,
      amountWei,
      meeBotAddress
    );
    console.log('✅ Replay confirmed:', confirmTx.transactionHash);
    
    // 4. Wait for confirmation
    await waitForTransaction(web3, confirmTx.transactionHash);
    
    // 5. Check status
    const confirmed = await isReplayConfirmed(contract, userAddress);
    const pending = await getPendingSupply(contract, userAddress);
    console.log('Confirmed:', confirmed);
    console.log('Pending:', fromWei(pending), 'BNB');
    
    // 6. Trigger supply
    console.log('Triggering supply...');
    const supplyTx = await triggerSupply(
      contract,
      userAddress,
      meeBotAddress
    );
    console.log('✅ Supply triggered:', supplyTx.transactionHash);
    
    return supplyTx;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Usage
handleSupply('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', '1.5');
```

## 🌐 MetaMask Integration

```typescript
async function connectMetaMask() {
  if (typeof window.ethereum !== 'undefined') {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Initialize Web3 with MetaMask
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    
    console.log('Connected:', accounts[0]);
    return { web3, account: accounts[0] };
  } else {
    throw new Error('Please install MetaMask');
  }
}
```

## 🧪 Testing

Run tests:

```bash
npm test -- tests/web3Integration.test.ts
```

Run demo:

```bash
npm run build
node dist/examples/web3-integration-demo.js
```

## 📚 Documentation

- [Full Integration Guide](./WEB3_INTEGRATION_GUIDE.md)
- [MeeChain Supply Guide](./MEECHAIN_SUPPLY_GUIDE.md)
- [Contract Source](./contracts/MeeChainSupply.sol)

## 💡 Tips

1. **Always convert amounts**: Use `toWei()` before sending to contract
2. **Check transaction status**: Use `waitForTransaction()` for confirmations
3. **Handle errors**: Wrap calls in try-catch blocks
4. **Use testnet first**: Test thoroughly before mainnet deployment
5. **Secure private keys**: Never commit private keys to git
6. **Gas estimation**: Estimate gas before sending transactions

```typescript
const gasEstimate = await contract.methods
  .triggerSupply(userAddress)
  .estimateGas({ from: meeBotAddress });
console.log('Estimated gas:', gasEstimate);
```

## 🔗 Network Configuration

### BSC Mainnet
- RPC: `https://bsc-dataseed.binance.org`
- Chain ID: 56
- Explorer: https://bscscan.com

### BSC Testnet
- RPC: `https://data-seed-prebsc-1-s1.binance.org:8545`
- Chain ID: 97
- Explorer: https://testnet.bscscan.com
- Faucet: https://testnet.binance.org/faucet-smart

---

**Quick Help**: For issues, see [WEB3_INTEGRATION_GUIDE.md](./WEB3_INTEGRATION_GUIDE.md)
