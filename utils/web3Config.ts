/**
 * Web3 Configuration for MeeChain
 * Sets up connection to Binance Smart Chain (BSC)
 */

import Web3 from 'web3';

/**
 * BSC RPC endpoints
 */
export const BSC_MAINNET_RPC = 'https://bsc-dataseed.binance.org';
export const BSC_TESTNET_RPC = 'https://data-seed-prebsc-1-s1.binance.org:8545';

/**
 * Initialize Web3 instance with BSC RPC
 * @param useTestnet - Use testnet if true, mainnet if false
 * @returns Web3 instance
 */
export function initWeb3(useTestnet: boolean = false): Web3 {
  const rpcUrl = useTestnet ? BSC_TESTNET_RPC : BSC_MAINNET_RPC;
  return new Web3(rpcUrl);
}

/**
 * Initialize Web3 with custom provider (e.g., MetaMask)
 * @param provider - Web3 provider (window.ethereum, etc.)
 * @returns Web3 instance
 */
export function initWeb3WithProvider(provider: any): Web3 {
  return new Web3(provider);
}

/**
 * Utility: Convert BNB to Wei
 * @param amount - Amount in BNB
 * @returns Amount in Wei
 */
export function toWei(amount: string | number): string {
  const web3 = new Web3();
  return web3.utils.toWei(amount.toString(), 'ether');
}

/**
 * Utility: Convert Wei to BNB
 * @param amountWei - Amount in Wei
 * @returns Amount in BNB
 */
export function fromWei(amountWei: string): string {
  const web3 = new Web3();
  return web3.utils.fromWei(amountWei, 'ether');
}

/**
 * Get transaction receipt
 * @param web3 - Web3 instance
 * @param txHash - Transaction hash
 * @returns Transaction receipt or null
 */
export async function getTransactionReceipt(web3: Web3, txHash: string) {
  try {
    return await web3.eth.getTransactionReceipt(txHash);
  } catch (error) {
    console.error('Error getting transaction receipt:', error);
    return null;
  }
}

/**
 * Wait for transaction confirmation
 * @param web3 - Web3 instance
 * @param txHash - Transaction hash
 * @param maxAttempts - Maximum number of attempts (default: 30)
 * @param delayMs - Delay between attempts in milliseconds (default: 2000)
 * @returns Transaction receipt or null
 */
export async function waitForTransaction(
  web3: Web3,
  txHash: string,
  maxAttempts: number = 30,
  delayMs: number = 2000
) {
  for (let i = 0; i < maxAttempts; i++) {
    const receipt = await getTransactionReceipt(web3, txHash);
    if (receipt) {
      return receipt;
    }
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  return null;
}
