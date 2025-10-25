/**
 * MeeChain Supply Contract Integration with Web3.js
 * Provides functions to interact with the MeeChainSupply smart contract
 */

import Web3 from 'web3';
import type { Contract } from 'web3-eth-contract';

/**
 * MeeChainSupply Contract Address on BSC
 * Update this after deploying the contract
 */
export const MEECHAIN_SUPPLY_ADDRESS = '0x001aCFF4ABF83647bAc745cf9D98a49F6181f15F';

/**
 * MeeChainSupply Contract ABI
 * Contains only the essential functions for MeeBot integration
 */
export const MEECHAIN_SUPPLY_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "confirmReplay",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "triggerSupply",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "refund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "replayConfirmed",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "pendingSupply",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "meeBot",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "ReplayConfirmed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "SupplyTriggered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "RefundIssued",
    "type": "event"
  }
];

/**
 * Initialize MeeChainSupply contract instance
 * @param web3 - Web3 instance
 * @param contractAddress - Contract address (optional, uses default if not provided)
 * @returns Contract instance
 */
export function initMeeChainSupplyContract(
  web3: Web3,
  contractAddress: string = MEECHAIN_SUPPLY_ADDRESS
): any {
  return new web3.eth.Contract(MEECHAIN_SUPPLY_ABI, contractAddress);
}

/**
 * Confirm replay verification for a user
 * Called by MeeBot after off-chain replay verification
 * @param contract - Contract instance
 * @param userAddress - User address
 * @param amountWei - Amount in Wei
 * @param meeBotAddress - MeeBot signer address
 * @returns Transaction receipt
 */
export async function confirmReplay(
  contract: any,
  userAddress: string,
  amountWei: string,
  meeBotAddress: string
) {
  try {
    console.log(`[MeeChainSupply] Confirming replay for ${userAddress}, amount: ${amountWei}`);
    const tx = await contract.methods.confirmReplay(userAddress, amountWei).send({
      from: meeBotAddress
    });
    console.log(`[MeeChainSupply] Replay confirmed! TxHash: ${tx.transactionHash}`);
    return tx;
  } catch (error) {
    console.error('[MeeChainSupply] Error confirming replay:', error);
    throw error;
  }
}

/**
 * Trigger supply for a user
 * Called by MeeBot or user to execute the token transfer
 * @param contract - Contract instance
 * @param userAddress - User address
 * @param meeBotAddress - MeeBot signer address
 * @returns Transaction receipt
 */
export async function triggerSupply(
  contract: any,
  userAddress: string,
  meeBotAddress: string
) {
  try {
    console.log(`[MeeChainSupply] Triggering supply for ${userAddress}`);
    const tx = await contract.methods.triggerSupply(userAddress).send({
      from: meeBotAddress
    });
    console.log(`[MeeChainSupply] Supply triggered! TxHash: ${tx.transactionHash}`);
    return tx;
  } catch (error) {
    console.error('[MeeChainSupply] Error triggering supply:', error);
    throw error;
  }
}

/**
 * Issue refund for a user
 * Called by MeeBot if replay verification fails
 * @param contract - Contract instance
 * @param userAddress - User address
 * @param meeBotAddress - MeeBot signer address
 * @returns Transaction receipt
 */
export async function refund(
  contract: any,
  userAddress: string,
  meeBotAddress: string
) {
  try {
    console.log(`[MeeChainSupply] Issuing refund for ${userAddress}`);
    const tx = await contract.methods.refund(userAddress).send({
      from: meeBotAddress
    });
    console.log(`[MeeChainSupply] Refund issued! TxHash: ${tx.transactionHash}`);
    return tx;
  } catch (error) {
    console.error('[MeeChainSupply] Error issuing refund:', error);
    throw error;
  }
}

/**
 * Check if replay is confirmed for a user
 * @param contract - Contract instance
 * @param userAddress - User address
 * @returns True if replay is confirmed
 */
export async function isReplayConfirmed(
  contract: any,
  userAddress: string
): Promise<boolean> {
  try {
    const confirmed = await contract.methods.replayConfirmed(userAddress).call();
    return confirmed;
  } catch (error) {
    console.error('[MeeChainSupply] Error checking replay confirmation:', error);
    return false;
  }
}

/**
 * Get pending supply amount for a user
 * @param contract - Contract instance
 * @param userAddress - User address
 * @returns Pending supply amount in Wei
 */
export async function getPendingSupply(
  contract: any,
  userAddress: string
): Promise<string> {
  try {
    const amount = await contract.methods.pendingSupply(userAddress).call();
    return amount;
  } catch (error) {
    console.error('[MeeChainSupply] Error getting pending supply:', error);
    return '0';
  }
}

/**
 * Get MeeBot address from contract
 * @param contract - Contract instance
 * @returns MeeBot address
 */
export async function getMeeBotAddress(contract: any): Promise<string> {
  try {
    const address = await contract.methods.meeBot().call();
    return address;
  } catch (error) {
    console.error('[MeeChainSupply] Error getting MeeBot address:', error);
    return '';
  }
}

/**
 * Listen to ReplayConfirmed events
 * @param contract - Contract instance
 * @param callback - Callback function
 */
export function listenToReplayConfirmed(
  contract: any,
  callback: (user: string, amount: string, event: any) => void
) {
  contract.events.ReplayConfirmed({})
    .on('data', (event: any) => {
      const user = event.returnValues.user;
      const amount = event.returnValues.amount;
      callback(user, amount, event);
    })
    .on('error', (error: any) => {
      console.error('[MeeChainSupply] Error listening to ReplayConfirmed:', error);
    });
}

/**
 * Listen to SupplyTriggered events
 * @param contract - Contract instance
 * @param callback - Callback function
 */
export function listenToSupplyTriggered(
  contract: any,
  callback: (user: string, amount: string, event: any) => void
) {
  contract.events.SupplyTriggered({})
    .on('data', (event: any) => {
      const user = event.returnValues.user;
      const amount = event.returnValues.amount;
      callback(user, amount, event);
    })
    .on('error', (error: any) => {
      console.error('[MeeChainSupply] Error listening to SupplyTriggered:', error);
    });
}

/**
 * Listen to RefundIssued events
 * @param contract - Contract instance
 * @param callback - Callback function
 */
export function listenToRefundIssued(
  contract: any,
  callback: (user: string, amount: string, event: any) => void
) {
  contract.events.RefundIssued({})
    .on('data', (event: any) => {
      const user = event.returnValues.user;
      const amount = event.returnValues.amount;
      callback(user, amount, event);
    })
    .on('error', (error: any) => {
      console.error('[MeeChainSupply] Error listening to RefundIssued:', error);
    });
}
