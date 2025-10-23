# 🧠 Web3.js Integration Guide for MeeChain Smart Contract

## Overview

This guide demonstrates how to connect to the MeeChainSupply smart contract using Web3.js on Binance Smart Chain (BSC). It provides a complete implementation for MeeBot to interact with on-chain replay verification and token supply operations.

## 📦 Installation

```bash
npm install web3
```

## 🔧 Files Structure

```
utils/
├── web3Config.ts              # Web3 setup and utilities
└── meeChainSupplyContract.ts  # Contract integration functions

examples/
└── web3-integration-demo.ts   # Complete demo and examples
```

---

## 1️⃣ Initialize Web3 and Connect to BSC

### Import Web3 Configuration

```typescript
import { initWeb3, toWei, fromWei } from './utils/web3Config';
```

### Connect to BSC

```typescript
// Connect to BSC Mainnet
const web3 = initWeb3(false);

// Or connect to BSC Testnet
const web3Testnet = initWeb3(true);

// Or use MetaMask provider
import { initWeb3WithProvider } from './utils/web3Config';
const web3MetaMask = initWeb3WithProvider(window.ethereum);
```

**RPC Endpoints:**
- Mainnet: `https://bsc-dataseed.binance.org`
- Testnet: `https://data-seed-prebsc-1-s1.binance.org:8545`

---

## 2️⃣ Initialize Contract with ABI and Address

### Import Contract Functions

```typescript
import {
  initMeeChainSupplyContract,
  confirmReplay,
  triggerSupply,
  refund,
  MEECHAIN_SUPPLY_ADDRESS
} from './utils/meeChainSupplyContract';
```

### Create Contract Instance

```typescript
const contractAddress = '0x001aCFF4ABF83647bAc745cf9D98a49F6181f15F';
const contract = initMeeChainSupplyContract(web3, contractAddress);
```

The ABI is already defined in `meeChainSupplyContract.ts` and includes:
- `confirmReplay(address user, uint256 amount)`
- `triggerSupply(address user)`
- `refund(address user)`
- View functions: `replayConfirmed()`, `pendingSupply()`, `meeBot()`
- Events: `ReplayConfirmed`, `SupplyTriggered`, `RefundIssued`

---

## 3️⃣ Main Functions

### ✅ Confirm Replay (confirmReplay)

Called by MeeBot after off-chain replay verification passes.

```typescript
import { confirmReplay } from './utils/meeChainSupplyContract';
import { toWei } from './utils/web3Config';

async function handleReplayConfirmation(userAddress: string) {
  // Convert amount from BNB to Wei
  const amountBNB = '1.5';
  const amountWei = toWei(amountBNB);
  
  // MeeBot address (should be loaded from secure environment)
  const meeBotAddress = process.env.MEEBOT_ADDRESS!;
  
  try {
    const tx = await confirmReplay(
      contract,
      userAddress,
      amountWei,
      meeBotAddress
    );
    
    console.log('✅ Replay confirmed!');
    console.log('Transaction Hash:', tx.transactionHash);
    console.log('Block Number:', tx.blockNumber);
    
    return tx;
  } catch (error) {
    console.error('❌ Failed to confirm replay:', error);
    throw error;
  }
}
```

### 🚀 Trigger Supply (triggerSupply)

Called after replay is confirmed to execute the token transfer.

```typescript
import { triggerSupply } from './utils/meeChainSupplyContract';

async function handleTriggerSupply(userAddress: string) {
  const meeBotAddress = process.env.MEEBOT_ADDRESS!;
  
  try {
    const tx = await triggerSupply(
      contract,
      userAddress,
      meeBotAddress
    );
    
    console.log('✅ Supply triggered!');
    console.log('Transaction Hash:', tx.transactionHash);
    
    return tx;
  } catch (error) {
    console.error('❌ Failed to trigger supply:', error);
    throw error;
  }
}
```

### 🛡️ Refund (refund)

Called if replay verification fails.

```typescript
import { refund } from './utils/meeChainSupplyContract';

async function handleRefund(userAddress: string) {
  const meeBotAddress = process.env.MEEBOT_ADDRESS!;
  
  try {
    const tx = await refund(
      contract,
      userAddress,
      meeBotAddress
    );
    
    console.log('✅ Refund issued!');
    console.log('Transaction Hash:', tx.transactionHash);
    
    return tx;
  } catch (error) {
    console.error('❌ Failed to issue refund:', error);
    throw error;
  }
}
```

---

## 4️⃣ Query Contract State

### Check Replay Confirmation Status

```typescript
import { isReplayConfirmed } from './utils/meeChainSupplyContract';

const confirmed = await isReplayConfirmed(contract, userAddress);
console.log('Replay confirmed:', confirmed);
```

### Get Pending Supply Amount

```typescript
import { getPendingSupply } from './utils/meeChainSupplyContract';
import { fromWei } from './utils/web3Config';

const pendingWei = await getPendingSupply(contract, userAddress);
const pendingBNB = fromWei(pendingWei);
console.log('Pending supply:', pendingBNB, 'BNB');
```

### Get MeeBot Address

```typescript
import { getMeeBotAddress } from './utils/meeChainSupplyContract';

const meeBotAddr = await getMeeBotAddress(contract);
console.log('MeeBot address:', meeBotAddr);
```

---

## 5️⃣ Utility Functions

### Convert BNB to Wei

```typescript
import { toWei } from './utils/web3Config';

const weiAmount = toWei('1.5'); // '1500000000000000000'
```

### Convert Wei to BNB

```typescript
import { fromWei } from './utils/web3Config';

const bnbAmount = fromWei('1500000000000000000'); // '1.5'
```

### Get Transaction Receipt

```typescript
import { getTransactionReceipt } from './utils/web3Config';

const receipt = await getTransactionReceipt(web3, txHash);
if (receipt) {
  console.log('Status:', receipt.status ? 'Success' : 'Failed');
  console.log('Block Number:', receipt.blockNumber);
  console.log('Gas Used:', receipt.gasUsed);
}
```

### Wait for Transaction Confirmation

```typescript
import { waitForTransaction } from './utils/web3Config';

const receipt = await waitForTransaction(web3, txHash);
if (receipt) {
  console.log('Transaction confirmed!');
} else {
  console.log('Transaction timeout');
}
```

---

## 6️⃣ Event Listeners

### Listen to ReplayConfirmed Events

```typescript
import { listenToReplayConfirmed } from './utils/meeChainSupplyContract';

listenToReplayConfirmed(contract, (user, amount, event) => {
  console.log(`✅ Replay confirmed for ${user}`);
  console.log(`   Amount: ${amount}`);
  console.log(`   Block: ${event.blockNumber}`);
  
  // Notify user in UI
  notifyUser(user, 'Your supply is ready! Click "Claim Tokens"');
});
```

### Listen to SupplyTriggered Events

```typescript
import { listenToSupplyTriggered } from './utils/meeChainSupplyContract';

listenToSupplyTriggered(contract, (user, amount, event) => {
  console.log(`✅ Supply triggered for ${user}`);
  console.log(`   Amount: ${amount}`);
  
  // Update UI
  notifyUser(user, `You received ${fromWei(amount)} tokens!`);
});
```

### Listen to RefundIssued Events

```typescript
import { listenToRefundIssued } from './utils/meeChainSupplyContract';

listenToRefundIssued(contract, (user, amount, event) => {
  console.log(`✅ Refund issued for ${user}`);
  console.log(`   Amount: ${amount}`);
  
  // Notify user
  notifyUser(user, 'Refund has been processed');
});
```

---

## 7️⃣ Complete Integration Example

### MeeBot Backend Integration

```typescript
import Web3 from 'web3';
import { initWeb3, toWei, fromWei } from './utils/web3Config';
import {
  initMeeChainSupplyContract,
  confirmReplay,
  triggerSupply,
  isReplayConfirmed,
  getPendingSupply,
  listenToReplayConfirmed
} from './utils/meeChainSupplyContract';

class MeeBotSupplyService {
  private web3: Web3;
  private contract: any;
  private meeBotAddress: string;

  constructor(useTestnet: boolean = false) {
    // Initialize Web3
    this.web3 = initWeb3(useTestnet);
    
    // Initialize contract
    this.contract = initMeeChainSupplyContract(this.web3);
    
    // Load MeeBot address from environment
    this.meeBotAddress = process.env.MEEBOT_ADDRESS!;
    
    // Start listening to events
    this.setupEventListeners();
  }

  /**
   * Verify replay and confirm on-chain
   */
  async verifyAndConfirmReplay(userAddress: string, txHash: string) {
    try {
      // Step 1: Verify replay off-chain
      const isValid = await this.verifyReplayOffChain(txHash);
      
      if (!isValid) {
        console.log('❌ Replay verification failed');
        return false;
      }
      
      // Step 2: Calculate supply amount
      const amount = await this.calculateSupplyAmount(txHash);
      const amountWei = toWei(amount);
      
      // Step 3: Confirm on-chain
      const tx = await confirmReplay(
        this.contract,
        userAddress,
        amountWei,
        this.meeBotAddress
      );
      
      console.log('✅ Replay confirmed on-chain');
      console.log('   TxHash:', tx.transactionHash);
      
      return true;
    } catch (error) {
      console.error('Error confirming replay:', error);
      return false;
    }
  }

  /**
   * User claims tokens
   */
  async claimTokens(userAddress: string) {
    try {
      // Check if replay is confirmed
      const confirmed = await isReplayConfirmed(this.contract, userAddress);
      if (!confirmed) {
        throw new Error('Replay not confirmed yet');
      }
      
      // Check pending amount
      const pendingWei = await getPendingSupply(this.contract, userAddress);
      if (pendingWei === '0') {
        throw new Error('No tokens pending');
      }
      
      // Trigger supply
      const tx = await triggerSupply(
        this.contract,
        userAddress,
        this.meeBotAddress
      );
      
      console.log('✅ Tokens claimed successfully');
      console.log('   Amount:', fromWei(pendingWei), 'tokens');
      console.log('   TxHash:', tx.transactionHash);
      
      return tx;
    } catch (error) {
      console.error('Error claiming tokens:', error);
      throw error;
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners() {
    listenToReplayConfirmed(this.contract, (user, amount, event) => {
      console.log(`[Event] Replay confirmed for ${user}: ${amount}`);
      // Update database, notify user, etc.
    });
  }

  /**
   * Verify replay off-chain (mock implementation)
   */
  private async verifyReplayOffChain(txHash: string): Promise<boolean> {
    // TODO: Implement actual replay verification logic
    return true;
  }

  /**
   * Calculate supply amount (mock implementation)
   */
  private async calculateSupplyAmount(txHash: string): Promise<string> {
    // TODO: Implement actual amount calculation
    return '1.5';
  }
}

// Usage
const service = new MeeBotSupplyService(true); // true = testnet
await service.verifyAndConfirmReplay(userAddress, txHash);
await service.claimTokens(userAddress);
```

---

## 8️⃣ MetaMask Integration (Frontend)

### Connect with MetaMask

```typescript
async function connectMetaMask() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Initialize Web3 with MetaMask provider
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      
      console.log('✅ Connected to MetaMask');
      console.log('   Account:', accounts[0]);
      
      return { web3, account: accounts[0] };
    } catch (error) {
      console.error('User denied account access');
      throw error;
    }
  } else {
    console.error('MetaMask not installed');
    throw new Error('Please install MetaMask');
  }
}
```

### User Triggers Supply via UI

```typescript
async function claimTokensFromUI() {
  const { web3, account } = await connectMetaMask();
  const contract = initMeeChainSupplyContract(web3);
  
  // Check if eligible to claim
  const confirmed = await isReplayConfirmed(contract, account);
  const pendingWei = await getPendingSupply(contract, account);
  
  if (!confirmed || pendingWei === '0') {
    alert('No tokens available to claim');
    return;
  }
  
  // MeeBot backend should trigger the supply
  // User just initiates the request
  const response = await fetch('/api/claim-tokens', {
    method: 'POST',
    body: JSON.stringify({ userAddress: account })
  });
  
  if (response.ok) {
    alert('Tokens claimed successfully!');
  }
}
```

---

## 9️⃣ Security Best Practices

### 1. Secure Private Key Management

```bash
# Use .env file (never commit to git!)
MEEBOT_ADDRESS=0x...
MEEBOT_PRIVATE_KEY=0x...
MEE_TOKEN_ADDRESS=0x...
MEECHAIN_SUPPLY_ADDRESS=0x...
```

### 2. Use Web3 Account for Signing

```typescript
// Add account to Web3
const account = web3.eth.accounts.privateKeyToAccount(process.env.MEEBOT_PRIVATE_KEY!);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;
```

### 3. Production Recommendations

- ✅ Use Gnosis Safe for MeeBot multi-sig wallet
- ✅ Implement rate limiting
- ✅ Add transaction monitoring
- ✅ Use secure RPC endpoints
- ✅ Implement proper error handling
- ✅ Log all transactions for audit

---

## 🧪 Testing

### Run the Demo

```bash
# Install dependencies
npm install

# Run the demo
npm run build
node dist/examples/web3-integration-demo.js
```

### Test on BSC Testnet

1. Get testnet BNB from faucet: https://testnet.binance.org/faucet-smart
2. Deploy contract to testnet
3. Update contract address in `utils/meeChainSupplyContract.ts`
4. Test all functions

---

## 📚 Related Documentation

- [MeeChain Supply Guide](./MEECHAIN_SUPPLY_GUIDE.md)
- [Contract Documentation](./contracts/README.md)
- [Deployment Guide](./scripts/README.md)

---

## 🚀 Quick Start Checklist

- [x] Install Web3.js: `npm install web3`
- [x] Create `utils/web3Config.ts` - Web3 setup
- [x] Create `utils/meeChainSupplyContract.ts` - Contract functions
- [x] Create example demo file
- [ ] Update contract address after deployment
- [ ] Set up environment variables
- [ ] Test on BSC Testnet
- [ ] Integrate with MeeBot backend
- [ ] Deploy to production

---

## 💡 Tips for ธณวัฒน์

1. **Wei Conversion**: Always use `toWei()` when sending amounts to contract
   ```typescript
   const amountWei = toWei('1.5'); // Convert BNB to Wei
   ```

2. **Transaction Status**: Check transaction receipt to verify success
   ```typescript
   const receipt = await web3.eth.getTransactionReceipt(txHash);
   console.log('Status:', receipt.status); // 1 = success, 0 = failed
   ```

3. **Backend vs Frontend**:
   - MeeBot backend = signer (has private key)
   - Frontend = viewer (uses MetaMask or read-only)

4. **Gas Estimation**:
   ```typescript
   const gasEstimate = await contract.methods.triggerSupply(user).estimateGas({
     from: meeBotAddress
   });
   ```

5. **Event Monitoring**: Use event listeners for real-time updates

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-19  
**Author**: MeeChain Team
