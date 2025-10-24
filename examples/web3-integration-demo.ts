/**
 * Web3.js Integration Demo
 * Demonstrates how to connect to MeeChainSupply smart contract using Web3.js
 * 
 * This file shows the implementation of the Web3.js integration as described
 * in the problem statement for ธณวัฒน์
 */

import Web3 from 'web3';
import {
  initWeb3,
  toWei,
  fromWei,
  getTransactionReceipt
} from '../utils/web3Config';
import {
  initMeeChainSupplyContract,
  confirmReplay,
  triggerSupply,
  refund,
  isReplayConfirmed,
  getPendingSupply,
  getMeeBotAddress,
  listenToReplayConfirmed,
  listenToSupplyTriggered,
  listenToRefundIssued
} from '../utils/meeChainSupplyContract';

/**
 * Demo: Initialize Web3 and connect to BSC
 */
async function demoInitWeb3() {
  console.log('\n=== 1. ติดตั้งและตั้งค่า Web3 ===\n');
  
  // Connect to BSC mainnet
  const web3 = initWeb3(false); // false = mainnet, true = testnet
  console.log('✅ Web3 initialized with BSC RPC');
  console.log('   RPC: https://bsc-dataseed.binance.org');
  
  return web3;
}

/**
 * Demo: Initialize contract with ABI and address
 */
async function demoInitContract(web3: Web3) {
  console.log('\n=== 2. กำหนด ABI และ Contract Address ===\n');
  
  const contractAddress = '0x001aCFF4ABF83647bAc745cf9D98a49F6181f15F';
  console.log('   Contract Address:', contractAddress);
  
  const contract = initMeeChainSupplyContract(web3, contractAddress);
  console.log('✅ Contract initialized');
  
  // Get MeeBot address from contract
  try {
    const meeBotAddr = await getMeeBotAddress(contract);
    console.log('   MeeBot Address:', meeBotAddr);
  } catch (error) {
    console.log('   ⚠️  Could not fetch MeeBot address (contract may not be deployed)');
  }
  
  return contract;
}

/**
 * Demo: Confirm Replay function
 */
async function demoConfirmReplay(contract: any, userAddress: string, meeBotAddress: string) {
  console.log('\n=== 3. ยืนยัน Replay (confirmReplay) ===\n');
  
  // Convert amount from BNB to Wei
  const amountBNB = '1.5';
  const amountWei = toWei(amountBNB);
  
  console.log('   User Address:', userAddress);
  console.log('   Amount (BNB):', amountBNB);
  console.log('   Amount (Wei):', amountWei);
  console.log('   MeeBot Address:', meeBotAddress);
  
  console.log('\n   📝 Code Example:');
  console.log('   ```javascript');
  console.log(`   await contract.methods.confirmReplay('${userAddress}', '${amountWei}').send({`);
  console.log(`     from: '${meeBotAddress}'`);
  console.log('   });');
  console.log('   ```');
  
  console.log('\n   ⚠️  Note: This is a demo. Actual execution requires MeeBot private key.');
  
  // In production:
  // const tx = await confirmReplay(contract, userAddress, amountWei, meeBotAddress);
  // console.log('   ✅ Transaction Hash:', tx.transactionHash);
}

/**
 * Demo: Trigger Supply function
 */
async function demoTriggerSupply(contract: any, userAddress: string, meeBotAddress: string) {
  console.log('\n=== 4. Trigger Supply (triggerSupply) ===\n');
  
  console.log('   User Address:', userAddress);
  console.log('   MeeBot Address:', meeBotAddress);
  
  console.log('\n   📝 Code Example:');
  console.log('   ```javascript');
  console.log(`   await contract.methods.triggerSupply('${userAddress}').send({`);
  console.log(`     from: '${meeBotAddress}'`);
  console.log('   });');
  console.log('   ```');
  
  console.log('\n   ⚠️  Note: This is a demo. Actual execution requires MeeBot private key.');
  
  // In production:
  // const tx = await triggerSupply(contract, userAddress, meeBotAddress);
  // console.log('   ✅ Transaction Hash:', tx.transactionHash);
}

/**
 * Demo: Refund function
 */
async function demoRefund(contract: any, userAddress: string, meeBotAddress: string) {
  console.log('\n=== 5. Refund กรณี Replay ล้มเหลว ===\n');
  
  console.log('   User Address:', userAddress);
  console.log('   MeeBot Address:', meeBotAddress);
  
  console.log('\n   📝 Code Example:');
  console.log('   ```javascript');
  console.log(`   await contract.methods.refund('${userAddress}').send({`);
  console.log(`     from: '${meeBotAddress}'`);
  console.log('   });');
  console.log('   ```');
  
  console.log('\n   ⚠️  Note: This is a demo. Actual execution requires MeeBot private key.');
  
  // In production:
  // const tx = await refund(contract, userAddress, meeBotAddress);
  // console.log('   ✅ Transaction Hash:', tx.transactionHash);
}

/**
 * Demo: Utility functions
 */
async function demoUtilities() {
  console.log('\n=== 6. เคล็ดลับและ Utilities ===\n');
  
  // Convert BNB to Wei
  const bnbAmount = '2.5';
  const weiAmount = toWei(bnbAmount);
  console.log(`   ✅ toWei('${bnbAmount}') = ${weiAmount}`);
  
  // Convert Wei to BNB
  const weiValue = '2500000000000000000';
  const bnbValue = fromWei(weiValue);
  console.log(`   ✅ fromWei('${weiValue}') = ${bnbValue} BNB`);
  
  console.log('\n   📝 Transaction Receipt Example:');
  console.log('   ```javascript');
  console.log('   const receipt = await web3.eth.getTransactionReceipt(txHash);');
  console.log('   console.log("Status:", receipt.status); // 1 = success, 0 = failed');
  console.log('   console.log("Block:", receipt.blockNumber);');
  console.log('   console.log("Gas Used:", receipt.gasUsed);');
  console.log('   ```');
}

/**
 * Demo: Event listeners
 */
async function demoEventListeners(contract: any) {
  console.log('\n=== 7. Event Listeners ===\n');
  
  console.log('   📝 Listen to ReplayConfirmed event:');
  console.log('   ```javascript');
  console.log('   contract.events.ReplayConfirmed({})');
  console.log('     .on("data", (event) => {');
  console.log('       console.log("User:", event.returnValues.user);');
  console.log('       console.log("Amount:", event.returnValues.amount);');
  console.log('     });');
  console.log('   ```');
  
  console.log('\n   📝 Listen to SupplyTriggered event:');
  console.log('   ```javascript');
  console.log('   contract.events.SupplyTriggered({})');
  console.log('     .on("data", (event) => {');
  console.log('       console.log("Supply triggered for:", event.returnValues.user);');
  console.log('     });');
  console.log('   ```');
  
  // In production, you can use the helper functions:
  // listenToReplayConfirmed(contract, (user, amount, event) => {
  //   console.log(`Replay confirmed for ${user}: ${amount} tokens`);
  // });
}

/**
 * Demo: Query contract state
 */
async function demoQueryState(contract: any, userAddress: string) {
  console.log('\n=== 8. Query Contract State ===\n');
  
  console.log('   📝 Check if replay is confirmed:');
  console.log('   ```javascript');
  console.log(`   const confirmed = await contract.methods.replayConfirmed('${userAddress}').call();`);
  console.log('   ```');
  
  console.log('\n   📝 Get pending supply amount:');
  console.log('   ```javascript');
  console.log(`   const pending = await contract.methods.pendingSupply('${userAddress}').call();`);
  console.log('   ```');
  
  console.log('\n   ⚠️  Note: These are read-only calls and don\'t require gas.');
  
  // In production:
  // const confirmed = await isReplayConfirmed(contract, userAddress);
  // const pending = await getPendingSupply(contract, userAddress);
  // console.log('   Confirmed:', confirmed);
  // console.log('   Pending:', fromWei(pending), 'BNB');
}

/**
 * Demo: MetaMask Integration
 */
async function demoMetaMaskIntegration() {
  console.log('\n=== 9. MetaMask Integration ===\n');
  
  console.log('   📝 Connect with MetaMask:');
  console.log('   ```javascript');
  console.log('   if (window.ethereum) {');
  console.log('     const web3 = new Web3(window.ethereum);');
  console.log('     await window.ethereum.request({ method: "eth_requestAccounts" });');
  console.log('     const accounts = await web3.eth.getAccounts();');
  console.log('     console.log("Connected:", accounts[0]);');
  console.log('   }');
  console.log('   ```');
  
  console.log('\n   💡 Tip: ให้ MeeBot เป็น backend signer');
  console.log('      หรือใช้ Gnosis Safe สำหรับ production');
}

/**
 * Main demo function
 */
async function main() {
  console.log('\n🎯 Web3.js Integration Demo for MeeChain Smart Contract\n');
  console.log('='.repeat(70));
  console.log('\n📚 Based on the implementation guide for ธณวัฒน์');
  console.log('   This demo shows how to connect and interact with MeeChainSupply contract\n');
  
  // Example addresses (replace with actual values)
  const userAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
  const meeBotAddress = '0xYourMeeBotAddress...'; // Set this to your MeeBot address
  
  try {
    // Step 1: Initialize Web3
    const web3 = await demoInitWeb3();
    
    // Step 2: Initialize Contract
    const contract = await demoInitContract(web3);
    
    // Step 3-5: Demonstrate main functions
    await demoConfirmReplay(contract, userAddress, meeBotAddress);
    await demoTriggerSupply(contract, userAddress, meeBotAddress);
    await demoRefund(contract, userAddress, meeBotAddress);
    
    // Step 6: Utilities
    await demoUtilities();
    
    // Step 7: Event Listeners
    await demoEventListeners(contract);
    
    // Step 8: Query State
    await demoQueryState(contract, userAddress);
    
    // Step 9: MetaMask Integration
    await demoMetaMaskIntegration();
    
    console.log('\n' + '='.repeat(70));
    console.log('\n✅ Demo completed successfully!\n');
    console.log('📝 Files created:');
    console.log('   - utils/web3Config.ts - Web3 setup and utilities');
    console.log('   - utils/meeChainSupplyContract.ts - Contract integration');
    console.log('   - examples/web3-integration-demo.ts - This demo file\n');
    console.log('🚀 Next steps:');
    console.log('   1. Update contract address in utils/meeChainSupplyContract.ts');
    console.log('   2. Set up MeeBot private key securely (use .env file)');
    console.log('   3. Test on BSC Testnet first');
    console.log('   4. Integrate with MeeBot backend\n');
    
  } catch (error) {
    console.error('\n❌ Error during demo:', error);
  }
}

// Run the demo
main().catch(console.error);
