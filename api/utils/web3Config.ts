/**
 * Web3 Configuration and Contract Setup
 */

import Web3 from 'web3';
import MeeChainSupplyABI from '../abi/MeeChainSupply.json' assert { type: 'json' };
import { Web3Config } from '../types/index.js';

let web3Instance: Web3 | null = null;
let contractInstance: any = null;
let config: Web3Config | null = null;

/**
 * Initialize Web3 with configuration
 */
export function initializeWeb3(configuration: Web3Config): void {
  config = configuration;
  web3Instance = new Web3(configuration.rpcUrl);
  
  // Add private key account
  const account = web3Instance.eth.accounts.privateKeyToAccount(
    configuration.privateKey.startsWith('0x') 
      ? configuration.privateKey 
      : '0x' + configuration.privateKey
  );
  web3Instance.eth.accounts.wallet.add(account);
  web3Instance.eth.defaultAccount = account.address;
  
  // Initialize contract
  contractInstance = new web3Instance.eth.Contract(
    MeeChainSupplyABI as any,
    configuration.contractAddress
  );
  
  console.log('✅ Web3 initialized');
  console.log(`📍 RPC: ${configuration.rpcUrl}`);
  console.log(`📝 Contract: ${configuration.contractAddress}`);
  console.log(`🔐 Signer: ${account.address}`);
}

/**
 * Get Web3 instance
 */
export function getWeb3(): Web3 {
  if (!web3Instance) {
    throw new Error('Web3 not initialized. Call initializeWeb3() first.');
  }
  return web3Instance;
}

/**
 * Get Contract instance
 */
export function getContract(): any {
  if (!contractInstance) {
    throw new Error('Contract not initialized. Call initializeWeb3() first.');
  }
  return contractInstance;
}

/**
 * Get current configuration
 */
export function getConfig(): Web3Config {
  if (!config) {
    throw new Error('Configuration not set. Call initializeWeb3() first.');
  }
  return config;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  if (!web3Instance) {
    throw new Error('Web3 not initialized');
  }
  return web3Instance.utils.isAddress(address);
}

/**
 * Convert BNB to Wei
 */
export function toWei(amountBNB: string): string {
  if (!web3Instance) {
    throw new Error('Web3 not initialized');
  }
  return web3Instance.utils.toWei(amountBNB, 'ether');
}

/**
 * Convert Wei to BNB
 */
export function fromWei(amountWei: string): string {
  if (!web3Instance) {
    throw new Error('Web3 not initialized');
  }
  return web3Instance.utils.fromWei(amountWei, 'ether');
}

/**
 * Get transaction receipt
 */
export async function getTransactionReceipt(txHash: string): Promise<any> {
  if (!web3Instance) {
    throw new Error('Web3 not initialized');
  }
  return await web3Instance.eth.getTransactionReceipt(txHash);
}

/**
 * Estimate gas for a transaction
 */
export async function estimateGas(transaction: any): Promise<bigint> {
  if (!web3Instance) {
    throw new Error('Web3 not initialized');
  }
  return await web3Instance.eth.estimateGas(transaction);
}
